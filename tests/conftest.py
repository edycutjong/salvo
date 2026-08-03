"""Shared test fixtures. OFFLINE is forced before any salvo import."""

from __future__ import annotations

import os

os.environ["OFFLINE"] = "1"
os.environ.pop("B2_KEY_ID", None)
os.environ.pop("B2_APP_KEY", None)

from pathlib import Path  # noqa: E402

import pytest  # noqa: E402


@pytest.fixture
def store(tmp_path: Path) -> Path:
    """A fresh on-disk object store root."""
    return tmp_path / "store"


@pytest.fixture
def client():
    """FastAPI TestClient (imported lazily so OFFLINE env is already set)."""
    from fastapi.testclient import TestClient

    from app.main import app

    return TestClient(app)
