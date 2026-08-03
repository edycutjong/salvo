"""Salvo campaign pipeline — brief in, N scored variants out, best three ship.

    brief
      └─ N variant steps : MockAdProvider (one PNG + headline each)
                 ↓  astream(max_concurrency=N)  — genblaze owns the fan-out
      ObjectStorageSink(LocalDirBackend, HIERARCHICAL) → campaigns/{date}/{run}/…
                 ↓  read_manifest(verify=True)      — provenance read back
      ranking.rank_variants(brief, variants)         — explainable scores
                 ↓
      top-3 = the three highest-scoring variants

All N variant steps run in PARALLEL via one real genblaze ``Pipeline``. Always-green
``OFFLINE=1``: mock provider + LocalDirBackend + raw-PNG swatches, zero network. LIVE
mode swaps the mock steps for real image providers behind the same surface.
"""

from __future__ import annotations

import asyncio
import tempfile
import uuid
from dataclasses import dataclass, field
from datetime import UTC, datetime
from pathlib import Path
from typing import Any

from genblaze_core import KeyStrategy, Modality, ObjectStorageSink, Pipeline

from salvo.backends import make_media_backend
from salvo.config import settings
from salvo.media import synth_png
from salvo.providers import MockAdProvider
from salvo.ranking import Variant, keywords, rank_variants

# Deterministic ad-copy templates. {A} = Title-cased keyword, {a}/{b} = lowercase.
_TEMPLATES = (
    "{A}, reimagined for {b}",
    "The {a} built for {b}",
    "{A}: {b} without compromise",
    "Finally, {a} that fits your {b}",
    "Your {b}, upgraded with {a}",
    "Less {b}, more {a}",
    "{A} for every kind of {b}",
    "Say hello to smarter {a}",
    "{A} that puts {b} first",
    "Where {a} meets {b}",
)

# Accent swatch palette (violet / magenta / green family — Salvo brand). Rotated per
# variant so the grid is visually differentiable while staying byte-deterministic.
_ACCENTS = (
    (139, 92, 246),
    (236, 72, 153),
    (52, 211, 153),
    (167, 139, 250),
    (244, 114, 182),
    (96, 165, 250),
    (129, 140, 248),
    (251, 146, 60),
)
_BG = (17, 15, 28)

MAX_VARIANTS = 12
UNIT_COST_USD = 0.002  # per mock variant; mirrors MockAdProvider default


def _headline(brief_kw: list[str], i: int) -> str:
    kw = brief_kw or ["it"]
    a = kw[i % len(kw)]
    b = kw[(i + 1) % len(kw)]
    return _TEMPLATES[i % len(_TEMPLATES)].format(A=a.title(), a=a, b=b)


@dataclass
class CampaignResult:
    id: str
    brief: str
    n: int
    mode: str
    created_at: str
    variants: list[Variant]  # ranked best-first
    top3: list[Variant]
    manifest_hash: str
    manifest_verified: bool
    cost_usd: float
    bucket: str
    store_root: Path
    object_keys: list[str] = field(default_factory=list)

    def variant_by_index(self, index: int) -> Variant | None:
        return next((v for v in self.variants if v.index == index), None)

    def image_path(self, index: int) -> Path | None:
        v = self.variant_by_index(index)
        if v is None:
            return None
        return self.store_root / "b2" / self.bucket / v.image_key

    def to_dict(self) -> dict[str, Any]:
        def _v(v: Variant) -> dict[str, Any]:
            return {
                "index": v.index,
                "rank": v.rank,
                "headline": v.headline,
                "score": v.score,
                "reasons": v.reasons,
                "sha256": v.sha256,
                "size_bytes": v.size_bytes,
                "image_key": v.image_key,
                "image_url": f"/campaigns/{self.id}/variants/{v.index}.png",
            }

        return {
            "id": self.id,
            "brief": self.brief,
            "n": self.n,
            "mode": self.mode,
            "created_at": self.created_at,
            "cost_usd": round(self.cost_usd, 4),
            "manifest_hash": self.manifest_hash,
            "manifest_verified": self.manifest_verified,
            "variants": [_v(v) for v in self.variants],
            "top3": [_v(v) for v in self.variants[:3]],
            "object_keys": self.object_keys,
        }


def _build_pipeline(
    base: Path, headlines: list[str], images: list[Path]
) -> tuple[Pipeline, ObjectStorageSink, Any]:
    backend = make_media_backend(base)
    sink = ObjectStorageSink(backend, prefix="campaigns", key_strategy=KeyStrategy.HIERARCHICAL)
    pipe = Pipeline("campaign", preflight=False)
    for i, (headline, img) in enumerate(zip(headlines, images, strict=True)):
        pipe = pipe.step(
            MockAdProvider(img, headline=headline, name=f"salvo-mock-image-{i}"),
            model="flux-1-schnell",
            prompt=headline,
            modality=Modality.IMAGE,
        )
    return pipe, sink, backend


async def run_campaign(
    brief: str,
    *,
    n: int = 6,
    campaign_id: str | None = None,
    store_root: Path | None = None,
) -> CampaignResult:
    """Generate ``n`` ad variants for ``brief``, score them, surface the top 3.

    Runs a real genblaze fan-out pipeline through an ObjectStorageSink, reads the
    manifest back (``verify=True``) for provenance, then applies the explainable
    deterministic ranking. Always returns a populated :class:`CampaignResult`.
    """
    n = max(1, min(int(n), MAX_VARIANTS))
    campaign_id = campaign_id or uuid.uuid4().hex[:12]
    base = Path(store_root or settings.local_store) / campaign_id
    # Synth inputs under the system temp dir: genblaze's S3 asset transfer only reads
    # local source files from its ALLOWED_FILE_ROOTS (temp). Harmless for OFFLINE.
    work = Path(tempfile.gettempdir()) / "salvo-work" / campaign_id
    work.mkdir(parents=True, exist_ok=True)

    brief_kw = keywords(brief)
    headlines = [_headline(brief_kw, i) for i in range(n)]
    images: list[Path] = []
    for i in range(n):
        img = synth_png(
            work / f"variant_{i}.png",
            rgb=_BG,
            accent=_ACCENTS[i % len(_ACCENTS)],
        )
        images.append(img)

    pipe, sink, backend = _build_pipeline(base, headlines, images)

    result = None
    async for ev in pipe.astream(
        sink=sink, max_concurrency=n, heartbeats=False, raise_on_failure=False
    ):
        if ev.type == "pipeline.completed":
            result = ev.result
        elif ev.type == "pipeline.failed":
            result = getattr(ev, "result", None)

    manifest_hash = ""
    manifest_verified = False
    cost = 0.0
    variants: list[Variant] = []
    object_keys: list[str] = []
    prefix = f"/b2/{settings.media_bucket}/"

    if result is not None:
        run = result.run
        manifest = sink.read_manifest(run, verify=True)
        manifest_hash = manifest.canonical_hash
        manifest_verified = manifest.verify()
        object_keys = [e.key for e in backend.list().entries]
        cost = sum((s.cost_usd or 0.0) for s in run.steps)
        for step in run.steps:
            assets = getattr(step, "assets", None) or []
            if not assets:
                continue
            asset = assets[0]
            url = getattr(asset, "url", "") or ""
            image_key = url.split(prefix, 1)[-1] if prefix in url else url
            variants.append(
                Variant(
                    index=step.step_index if step.step_index is not None else len(variants),
                    headline=step.metadata.get("headline", ""),
                    image_key=image_key,
                    sha256=getattr(asset, "sha256", "") or "",
                    size_bytes=getattr(asset, "size_bytes", 0) or 0,
                )
            )

    ranked = rank_variants(brief, variants)

    return CampaignResult(
        id=campaign_id,
        brief=brief,
        n=n,
        mode=settings.mode,
        created_at=datetime.now(UTC).isoformat(),
        variants=ranked,
        top3=ranked[:3],
        manifest_hash=manifest_hash,
        manifest_verified=manifest_verified,
        cost_usd=cost,
        bucket=settings.media_bucket,
        store_root=base,
        object_keys=object_keys,
    )


def run_campaign_sync(brief: str, *, n: int = 6, **kwargs: Any) -> CampaignResult:
    """Synchronous convenience wrapper (tests + scripts)."""
    return asyncio.run(run_campaign(brief, n=n, **kwargs))


__all__ = [
    "CampaignResult",
    "MAX_VARIANTS",
    "run_campaign",
    "run_campaign_sync",
]
