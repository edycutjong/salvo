"""FastAPI surface: health, campaign create/fetch, variant PNG serving."""

from __future__ import annotations


def test_healthz_ok(client):
    resp = client.get("/healthz")
    assert resp.status_code == 200
    body = resp.json()
    assert body["status"] == "ok"
    assert body["service"] == "salvo"
    assert body["mode"] == "OFFLINE"
    assert body["genblaze_version"] == "0.4.1"


def test_root(client):
    resp = client.get("/")
    assert resp.status_code == 200
    assert resp.json()["name"] == "Salvo"


def test_create_campaign_returns_variants_and_top3(client):
    resp = client.post("/campaigns", json={"brief": "eco water bottle for hikers", "n": 6})
    assert resp.status_code == 200
    body = resp.json()
    assert len(body["variants"]) == 6
    assert len(body["top3"]) == 3
    assert body["manifest_verified"] is True
    # top3 really are the three best
    assert [v["score"] for v in body["top3"]] == sorted(
        (v["score"] for v in body["variants"]), reverse=True
    )[:3]


def test_get_campaign_roundtrip_and_variant_png(client):
    created = client.post("/campaigns", json={"brief": "smart home thermostat", "n": 4}).json()
    cid = created["id"]

    got = client.get(f"/campaigns/{cid}")
    assert got.status_code == 200
    assert got.json()["id"] == cid

    idx = created["variants"][0]["index"]
    png = client.get(f"/campaigns/{cid}/variants/{idx}.png")
    assert png.status_code == 200
    assert png.headers["content-type"] == "image/png"
    assert png.content[:8] == b"\x89PNG\r\n\x1a\n"


def test_unknown_campaign_404(client):
    assert client.get("/campaigns/nope").status_code == 404
