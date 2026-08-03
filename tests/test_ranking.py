"""Explainable, deterministic ranking."""

from __future__ import annotations

from salvo.ranking import Variant, keywords, rank_variants, score_variant


def _v(headline: str, sha: str = "deadbeef", idx: int = 0) -> Variant:
    return Variant(index=idx, headline=headline, image_key="k", sha256=sha, size_bytes=1)


def test_keywords_drops_stopwords_and_short_tokens():
    kw = keywords("The eco water bottle for hikers")
    assert "water" in kw and "bottle" in kw and "hikers" in kw
    assert "the" not in kw and "for" not in kw


def test_score_is_deterministic():
    brief = "eco water bottle for hikers"
    a = score_variant(brief, _v("Water bottle for hikers"))
    b = score_variant(brief, _v("Water bottle for hikers"))
    assert a == b


def test_reasons_are_explainable_and_cover_all_signals():
    score, reasons = score_variant("eco water bottle", _v("Eco water bottle, reimagined"))
    assert 0 <= score <= 100
    assert len(reasons) == 3
    joined = " ".join(reasons).lower()
    assert "coverage" in joined
    assert "length" in joined
    assert "engagement" in joined
    # honesty: the engagement signal is disclosed as not-real click data
    assert "not real click data" in joined


def test_coverage_raises_score():
    brief = "eco water bottle for hikers"
    on = score_variant(brief, _v("Eco water bottle for hikers", sha="x"))[0]
    off = score_variant(brief, _v("Completely unrelated slogan here", sha="x"))[0]
    assert on > off


def test_rank_orders_best_first_and_assigns_ranks():
    brief = "eco water bottle for hikers"
    vs = [
        _v("random unrelated words xyz", sha="a", idx=0),
        _v("Eco water bottle for hikers", sha="b", idx=1),
        _v("Water for hikers", sha="c", idx=2),
    ]
    ranked = rank_variants(brief, vs)
    assert [v.rank for v in ranked] == [1, 2, 3]
    assert ranked[0].score >= ranked[1].score >= ranked[2].score
    assert ranked[0].index == 1  # the on-brief headline wins
