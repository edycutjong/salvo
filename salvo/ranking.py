"""Explainable, deterministic ad-variant ranking.

``score_variant(brief, variant)`` returns ``(score, reasons)`` where ``score`` is
a 0-100 number and ``reasons`` is a human-readable breakdown of exactly how it
was reached. Three transparent signals, each contributing weighted points:

  1. Brief coverage   (0.45) — how many brief keywords the headline actually uses.
  2. Headline length  (0.25) — closeness to a 22-42 character scannable sweet spot.
  3. Engagement index (0.30) — a pseudo-signal *seeded from the content hash*.
     This is explicitly NOT real click/CTR data; it is a deterministic stand-in
     so the ranking is reproducible offline. Labelled as such in every reason.

Nothing here is random: the same brief + variant always yields the same score,
which is what makes the ranking testable and the demo honest.
"""

from __future__ import annotations

import hashlib
import re
from dataclasses import dataclass, field

# Weights (sum to 1.0). Coverage dominates: an ad that ignores the brief is a bad
# ad no matter how pretty. Length and the seeded engagement index break ties.
W_COVERAGE = 0.45
W_LENGTH = 0.25
W_ENGAGEMENT = 0.30

# Headline character sweet spot — long enough to say something, short enough to scan.
LEN_LOW, LEN_HIGH = 22, 42
LEN_FALLOFF = 30.0  # chars away from the window at which the length score hits 0

# Only the first N brief keywords count toward coverage (a brief has a few core ideas).
COVERAGE_CAP = 6

_STOPWORDS = frozenset(
    {
        "the", "a", "an", "and", "or", "for", "to", "of", "in", "on", "with", "your",
        "you", "our", "that", "this", "is", "are", "be", "it", "at", "by", "as", "from",
        "into", "who", "new", "get", "meet", "make", "made", "built", "build",
    }
)


def keywords(text: str) -> list[str]:
    """Lowercased, de-duplicated content words (stopwords + short tokens dropped)."""
    seen: list[str] = []
    for tok in re.findall(r"[a-z0-9]+", text.lower()):
        if len(tok) >= 3 and tok not in _STOPWORDS and tok not in seen:
            seen.append(tok)
    return seen


@dataclass
class Variant:
    """One generated ad variant plus its (later-populated) ranking."""

    index: int
    headline: str
    image_key: str
    sha256: str
    size_bytes: int
    score: float = 0.0
    reasons: list[str] = field(default_factory=list)
    rank: int | None = None


def _coverage(brief_kw: list[str], head_kw: set[str]) -> tuple[float, list[str]]:
    core = brief_kw[:COVERAGE_CAP]
    if not core:
        return 0.0, []
    matched = [k for k in core if k in head_kw]
    return len(matched) / len(core), matched


def _length_score(length: int) -> float:
    if LEN_LOW <= length <= LEN_HIGH:
        return 1.0
    dist = LEN_LOW - length if length < LEN_LOW else length - LEN_HIGH
    return max(0.0, 1.0 - dist / LEN_FALLOFF)


def _engagement_index(headline: str, sha256: str) -> float:
    """Deterministic 0..1 pseudo-engagement seeded from content (NOT real data)."""
    seed = hashlib.sha256(f"{headline}\x00{sha256}".encode()).hexdigest()
    return int(seed[:8], 16) / 0xFFFFFFFF


def score_variant(brief: str, variant: Variant) -> tuple[float, list[str]]:
    """Return ``(score_0_100, reasons)`` for ``variant`` against ``brief``."""
    brief_kw = keywords(brief)
    head_kw = set(keywords(variant.headline))

    cov, matched = _coverage(brief_kw, head_kw)
    length = len(variant.headline)
    length_s = _length_score(length)
    eng = _engagement_index(variant.headline, variant.sha256)

    cov_pts = W_COVERAGE * cov * 100
    len_pts = W_LENGTH * length_s * 100
    eng_pts = W_ENGAGEMENT * eng * 100
    score = round(cov_pts + len_pts + eng_pts, 1)

    core = brief_kw[:COVERAGE_CAP]
    matched_txt = ", ".join(matched) if matched else "none"
    if LEN_LOW <= length <= LEN_HIGH:
        len_txt = f"{length} chars, inside the {LEN_LOW}-{LEN_HIGH} sweet spot"
    else:
        len_txt = f"{length} chars, outside the {LEN_LOW}-{LEN_HIGH} sweet spot"

    reasons = [
        f"Brief coverage {len(matched)}/{len(core)} keywords ({matched_txt}) "
        f"→ +{cov_pts:.1f} pts",
        f"Headline length {len_txt} → +{len_pts:.1f} pts",
        f"Engagement index {eng:.2f} (seeded from content hash, not real click data) "
        f"→ +{eng_pts:.1f} pts",
    ]
    return score, reasons


def rank_variants(brief: str, variants: list[Variant]) -> list[Variant]:
    """Score every variant in place, then return them sorted best-first with ranks.

    Ties break deterministically on ``sha256`` so ordering never wobbles between runs.
    """
    for v in variants:
        v.score, v.reasons = score_variant(brief, v)
    ordered = sorted(variants, key=lambda v: (-v.score, v.sha256))
    for i, v in enumerate(ordered, start=1):
        v.rank = i
    return ordered
