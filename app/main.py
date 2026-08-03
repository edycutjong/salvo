"""Salvo FastAPI backend — batch creative factory.

Surface:
- ``GET  /healthz``              liveness + mode + genblaze version (no credentials).
- ``GET  /``                     service info / links.
- ``POST /campaigns``            run a campaign: brief in → N scored variants + top-3.
- ``GET  /campaigns/{id}``       fetch a completed campaign.
- ``GET  /campaigns/{id}/variants/{i}.png``  serve a variant's PNG bytes.
- ``GET  /console``              the operator console (textarea → variant grid).

Campaigns are kept in an in-memory dict — no database. Startup needs no credentials:
OFFLINE mode (mock providers + LocalDirBackend) is the default, always-green path.
"""

from __future__ import annotations

from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from pydantic import BaseModel, Field

from salvo import __version__
from salvo.config import settings
from salvo.pipeline import MAX_VARIANTS, CampaignResult, run_campaign

WEB_DIR = Path(__file__).resolve().parent.parent / "web"

# In-memory campaign store (id -> CampaignResult). Stateless service; no DB.
_CAMPAIGNS: dict[str, CampaignResult] = {}


def _genblaze_version() -> str:
    import importlib.metadata as _md

    try:
        return _md.version("genblaze")
    except _md.PackageNotFoundError:  # pragma: no cover
        return "unknown"


app = FastAPI(
    title="Salvo",
    version=__version__,
    description="Brief in, N scored ad variants out, best three ship. On Genblaze + Backblaze B2.",
)


@app.get("/healthz")
def healthz() -> dict:
    return {
        "status": "ok",
        "service": "salvo",
        "version": __version__,
        "mode": settings.mode,
        "genblaze_version": _genblaze_version(),
    }


@app.get("/")
def root() -> dict:
    return {
        "name": "Salvo",
        "tagline": "brief in, N scored ad variants out, best three ship",
        "mode": settings.mode,
        "console": "/console",
        "docs": "/docs",
        "health": "/healthz",
    }


class CampaignRequest(BaseModel):
    brief: str = Field(..., min_length=1, description="The creative brief.")
    n: int = Field(6, ge=1, le=MAX_VARIANTS, description="Number of variants to generate.")


@app.post("/campaigns")
async def create_campaign(req: CampaignRequest) -> dict:
    result = await run_campaign(req.brief, n=req.n)
    _CAMPAIGNS[result.id] = result
    return result.to_dict()


@app.get("/campaigns/{campaign_id}")
def get_campaign(campaign_id: str) -> dict:
    result = _CAMPAIGNS.get(campaign_id)
    if result is None:
        raise HTTPException(status_code=404, detail="unknown campaign")
    return result.to_dict()


@app.get("/campaigns/{campaign_id}/variants/{index}.png")
def get_variant_png(campaign_id: str, index: int) -> FileResponse:
    result = _CAMPAIGNS.get(campaign_id)
    if result is None:
        raise HTTPException(status_code=404, detail="unknown campaign")
    path = result.image_path(index)
    if path is None or not path.is_file():
        raise HTTPException(status_code=404, detail="unknown variant")
    return FileResponse(path, media_type="image/png")


@app.get("/console")
def console() -> FileResponse:
    page = WEB_DIR / "console.html"
    if not page.is_file():  # pragma: no cover
        raise HTTPException(status_code=404, detail="console not built")
    return FileResponse(page, media_type="text/html")
