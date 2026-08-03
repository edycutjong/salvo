"""OFFLINE campaign pipeline: real genblaze fan-out → stored PNGs → ranked top-3."""

from __future__ import annotations

from salvo.media import is_valid_png
from salvo.pipeline import run_campaign_sync


def test_campaign_produces_n_scored_variants(store):
    r = run_campaign_sync("eco water bottle for hikers", n=6, store_root=store)
    assert r.n == 6
    assert len(r.variants) == 6
    assert all(0 <= v.score <= 100 for v in r.variants)
    assert all(v.reasons for v in r.variants)


def test_top3_are_the_three_highest(store):
    r = run_campaign_sync("fast affordable electric scooter", n=8, store_root=store)
    assert len(r.top3) == 3
    scores = [v.score for v in r.variants]
    assert scores == sorted(scores, reverse=True)
    assert r.top3 == r.variants[:3]
    assert r.top3[0].score >= r.top3[2].score


def test_ranking_is_deterministic_across_runs(store, tmp_path):
    a = run_campaign_sync("eco water bottle for hikers", n=6, store_root=store)
    b = run_campaign_sync("eco water bottle for hikers", n=6, store_root=tmp_path / "b")
    assert [(v.headline, v.score) for v in a.variants] == [
        (v.headline, v.score) for v in b.variants
    ]


def test_manifest_provenance_read_back(store):
    r = run_campaign_sync("cozy wool socks", n=4, store_root=store)
    assert r.manifest_hash
    assert r.manifest_verified is True
    # every generated variant PNG landed as a real object in the B2 sink
    assert any(k.endswith("manifest.json") for k in r.object_keys)
    assert sum(k.endswith(".png") for k in r.object_keys) == 4


def test_stored_variant_pngs_are_valid(store):
    r = run_campaign_sync("premium coffee subscription", n=5, store_root=store)
    for v in r.variants:
        path = r.image_path(v.index)
        assert path is not None and path.is_file()
        assert is_valid_png(path.read_bytes())
        assert v.sha256


def test_cost_is_reported(store):
    r = run_campaign_sync("noise cancelling headphones", n=6, store_root=store)
    assert r.cost_usd > 0
