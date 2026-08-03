"""Targeted tests closing the last coverage gaps to 100%.

Grouped by module. These exercise error paths, the storage backend's full
surface (delete / describe / presigned URL / traversal guard), the LIVE-mode
backend factory (via a mocked ``genblaze_s3``), and the pipeline's
failed/assetless branches (via a fake pipe).
"""

from __future__ import annotations

import dataclasses
import io
import sys
import types
from pathlib import Path

import pytest


# --------------------------------------------------------------------------- #
# salvo/config.py
# --------------------------------------------------------------------------- #
def test_has_b2_creds_both_present_and_absent(monkeypatch):
    from salvo import config

    monkeypatch.delenv("B2_KEY_ID", raising=False)
    monkeypatch.delenv("B2_APP_KEY", raising=False)
    assert config._has_b2_creds() is False

    monkeypatch.setenv("B2_KEY_ID", "k")
    monkeypatch.setenv("B2_APP_KEY", "s")
    assert config._has_b2_creds() is True


# --------------------------------------------------------------------------- #
# salvo/ranking.py
# --------------------------------------------------------------------------- #
def test_coverage_empty_brief_keywords():
    from salvo.ranking import _coverage

    assert _coverage([], set()) == (0.0, [])


# --------------------------------------------------------------------------- #
# salvo/backends.py — LocalDirBackend surface
# --------------------------------------------------------------------------- #
def _backend(tmp_path: Path):
    from salvo.backends import LocalDirBackend

    return LocalDirBackend(tmp_path / "store")


def test_put_accepts_file_like_object(tmp_path):
    be = _backend(tmp_path)
    be.put("a/b.bin", io.BytesIO(b"hello"))
    assert be.get("a/b.bin") == b"hello"


def test_put_rejects_unsupported_type(tmp_path):
    be = _backend(tmp_path)
    with pytest.raises(TypeError, match="unsupported data type"):
        be.put("bad", 12345)  # not bytes, not file-like


def test_path_traversal_is_blocked(tmp_path):
    be = _backend(tmp_path)
    with pytest.raises(ValueError, match="escapes storage root"):
        be._path("../../etc/passwd")


def test_get_missing_key_raises(tmp_path):
    be = _backend(tmp_path)
    with pytest.raises(FileNotFoundError, match="no object at key"):
        be.get("nope")


def test_delete_removes_object_and_meta(tmp_path):
    be = _backend(tmp_path)
    be.put("k.bin", b"x")
    assert be.exists("k.bin")
    be.delete("k.bin")
    assert not be.exists("k.bin")
    be.delete("k.bin")  # idempotent: deleting a gone key is a no-op


def test_presigned_url_carries_expiry(tmp_path):
    be = _backend(tmp_path)
    be.put("k.bin", b"x")
    url = be.get_url("k.bin", expires_in=120)
    assert url.startswith("file://")
    assert "presigned" in url and "expires_in=120" in url


def test_list_continuation_token_filters(tmp_path):
    be = _backend(tmp_path)
    for k in ("a.bin", "b.bin", "c.bin"):
        be.put(k, b"x")
    page = be.list(continuation_token="a.bin")
    keys = [e.key for e in page.entries]
    assert keys == ["b.bin", "c.bin"]  # strictly greater than the token


def test_read_meta_missing_returns_empty(tmp_path):
    be = _backend(tmp_path)
    assert be._read_meta("never-written") == {}


def test_describe_returns_object_metadata(tmp_path):
    be = _backend(tmp_path)
    be.put("k.bin", b"hello", content_type="application/octet-stream")
    meta = be.describe("k.bin")
    assert meta.key == "k.bin"
    assert meta.size == 5
    assert meta.content_type == "application/octet-stream"


def test_make_media_backend_live_uses_s3(monkeypatch, tmp_path):
    from salvo import backends
    from salvo.config import settings

    sentinel = object()
    captured = {}

    class _FakeS3:
        @classmethod
        def for_backblaze(cls, bucket, *, key_id, app_key, preflight):
            captured.update(bucket=bucket, key_id=key_id,
                            app_key=app_key, preflight=preflight)
            return sentinel

    fake_mod = types.ModuleType("genblaze_s3")
    fake_mod.S3StorageBackend = _FakeS3
    monkeypatch.setitem(sys.modules, "genblaze_s3", fake_mod)
    monkeypatch.setenv("B2_KEY_ID", "kid")
    monkeypatch.setenv("B2_APP_KEY", "secret")

    live = dataclasses.replace(settings, offline=False)
    got = backends.make_media_backend(tmp_path, settings=live)
    assert got is sentinel
    assert captured == {"bucket": live.media_bucket, "key_id": "kid",
                        "app_key": "secret", "preflight": False}


# --------------------------------------------------------------------------- #
# salvo/pipeline.py
# --------------------------------------------------------------------------- #
def test_campaign_image_path_none_for_unknown_index():
    from salvo.pipeline import CampaignResult
    from salvo.ranking import Variant

    cr = CampaignResult(
        id="c", brief="b", n=1, mode="OFFLINE", created_at="t",
        variants=[Variant(index=0, headline="h", image_key="k.png",
                           sha256="s", size_bytes=1)],
        top3=[], manifest_hash="", manifest_verified=False, cost_usd=0.0,
        bucket="salvo-media", store_root=Path("/tmp/x"),
    )
    assert cr.image_path(999) is None  # no such variant
    assert cr.image_path(0) == Path("/tmp/x") / "b2" / "salvo-media" / "k.png"


class _FakePipe:
    def __init__(self, events):
        self._events = events

    async def astream(self, *, sink=None, max_concurrency=None,
                      heartbeats=None, raise_on_failure=None):
        for ev in self._events:
            yield ev


def test_run_campaign_pipeline_failed_yields_empty(monkeypatch, tmp_path):
    import salvo.pipeline as P

    fake = _FakePipe([types.SimpleNamespace(type="pipeline.failed")])
    monkeypatch.setattr(P, "_build_pipeline",
                        lambda base, headlines, images: (fake, None, None))
    res = P.run_campaign_sync("fast cars for city life", n=2, store_root=tmp_path)
    assert res.variants == []
    assert res.manifest_hash == ""
    assert res.manifest_verified is False


def test_run_campaign_skips_assetless_steps(monkeypatch, tmp_path):
    """A completed step with no assets is skipped; only asset-bearing steps
    become variants."""
    import salvo.pipeline as P

    asset = types.SimpleNamespace(
        url="file:///x/b2/salvo-media/campaigns/v1.png",
        sha256="deadbeef", size_bytes=42)
    step0 = types.SimpleNamespace(assets=[], cost_usd=0.0, step_index=0, metadata={})
    step1 = types.SimpleNamespace(assets=[asset], cost_usd=0.002, step_index=1,
                                  metadata={"headline": "Fast cars for city life"})
    run = types.SimpleNamespace(steps=[step0, step1])
    fake_result = types.SimpleNamespace(run=run)
    fake_manifest = types.SimpleNamespace(canonical_hash="abc123", verify=lambda: True)
    fake_sink = types.SimpleNamespace(read_manifest=lambda run, verify=True: fake_manifest)
    fake_backend = types.SimpleNamespace(
        list=lambda: types.SimpleNamespace(entries=[types.SimpleNamespace(key="campaigns/v1.png")]))
    fake = _FakePipe([types.SimpleNamespace(type="pipeline.completed", result=fake_result)])

    monkeypatch.setattr(P, "_build_pipeline",
                        lambda base, headlines, images: (fake, fake_sink, fake_backend))
    res = P.run_campaign_sync("fast cars for city life", n=2, store_root=tmp_path)
    assert res.manifest_hash == "abc123"
    assert res.manifest_verified is True
    assert len(res.variants) == 1  # the assetless step was skipped
    assert res.variants[0].image_key == "campaigns/v1.png"


# --------------------------------------------------------------------------- #
# app/main.py
# --------------------------------------------------------------------------- #
def test_console_page_served(client):
    resp = client.get("/console")
    assert resp.status_code == 200
    assert "text/html" in resp.headers["content-type"]


def test_variant_png_unknown_campaign_404(client):
    assert client.get("/campaigns/nope/variants/0.png").status_code == 404


def test_variant_png_unknown_index_404(client):
    created = client.post("/campaigns", json={"brief": "fast cars for city life", "n": 2})
    assert created.status_code == 200
    campaign_id = created.json()["id"]
    # A real campaign but an out-of-range variant index → 404.
    assert client.get(f"/campaigns/{campaign_id}/variants/999.png").status_code == 404
