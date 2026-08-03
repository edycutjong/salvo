"""Salvo OFFLINE ad-variant provider.

``MockAdProvider`` is a real genblaze :class:`SyncProvider` (the documented
extension point). For each pipeline step it emits one pre-synthesized variant
PNG (real bytes, real sha256) and records the variant's **headline** plus a
``cost_usd`` and ``stage`` tag in ``step.metadata`` — so the manifest carries the
copy alongside the image, and the ranking layer can read both back.

In LIVE mode these mock steps are swapped for real image providers (GMI FLUX /
DALL·E 3) behind the same Pipeline surface.
"""

from __future__ import annotations

from pathlib import Path

from genblaze_core.providers.base import SyncProvider

from salvo.media import local_asset


class MockAdProvider(SyncProvider):
    """OFFLINE ad-variant generator: emits one local PNG asset + a headline.

    Deterministic and network-free. The ``headline`` is stashed in
    ``step.metadata['headline']`` so it survives into the stored manifest.
    """

    def __init__(
        self,
        asset_path: Path,
        *,
        headline: str,
        name: str = "salvo-mock-image",
        media_type: str = "image/png",
        cost_usd: float = 0.002,
    ) -> None:
        super().__init__()
        self.name = name  # type: ignore[assignment]
        self._asset_path = Path(asset_path)
        self._headline = headline
        self._media_type = media_type
        self._cost_usd = cost_usd

    def generate(self, step, config=None):  # noqa: ANN001
        step.assets.append(local_asset(self._asset_path, media_type=self._media_type))
        step.cost_usd = self._cost_usd
        step.metadata.setdefault("stage", "variant")
        step.metadata["headline"] = self._headline
        return step
