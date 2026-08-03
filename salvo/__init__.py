"""Salvo — brief in, N scored ad variants out, best three ship."""

from __future__ import annotations

__version__ = "1.1.2"

from salvo.backends import LocalDirBackend
from salvo.config import settings
from salvo.pipeline import CampaignResult, run_campaign, run_campaign_sync
from salvo.providers import MockAdProvider
from salvo.ranking import Variant, rank_variants, score_variant

__all__ = [
    "__version__",
    "settings",
    "LocalDirBackend",
    "MockAdProvider",
    "Variant",
    "score_variant",
    "rank_variants",
    "CampaignResult",
    "run_campaign",
    "run_campaign_sync",
]
