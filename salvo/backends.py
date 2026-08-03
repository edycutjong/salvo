"""LocalDirBackend — an on-disk :class:`genblaze_core.storage.base.StorageBackend`.

This is Salvo's OFFLINE storage plane and a genblaze extension-point proof: we
implement the documented ``StorageBackend`` interface rather than consume a
prebuilt one. It backs ``OFFLINE=1`` — no network, no credentials, always green.
LIVE mode swaps in genblaze's real ``S3StorageBackend`` for Backblaze B2.
"""

from __future__ import annotations

import hashlib
import json
import os
from datetime import UTC, datetime
from pathlib import Path
from typing import Any, BinaryIO

from genblaze_core.storage.base import StorageBackend
from genblaze_core.storage.types import FileEntry, ListPage, ObjectMetadata

from salvo.config import Settings
from salvo.config import settings as _default_settings

_META_DIR = ".salvo-meta"


def _as_bytes(data: bytes | BinaryIO) -> bytes:
    if isinstance(data, (bytes, bytearray)):
        return bytes(data)
    if hasattr(data, "read"):
        return data.read()
    raise TypeError(f"unsupported data type for put(): {type(data)!r}")


class LocalDirBackend(StorageBackend):
    """Filesystem-backed StorageBackend rooted at ``root``.

    Keys map to paths under ``root``, normalised and confined to the root (safe
    against path traversal). Object tags (the B2 ``X-Bz-Info`` analogue) are kept
    in a sibling ``.salvo-meta/`` tree so the key space stays clean.
    """

    def __init__(self, root: str | Path) -> None:
        self.root = Path(root).expanduser().resolve()
        self.root.mkdir(parents=True, exist_ok=True)
        (self.root / _META_DIR).mkdir(parents=True, exist_ok=True)

    def _path(self, key: str) -> Path:
        key = key.lstrip("/")
        p = (self.root / key).resolve()
        if not str(p).startswith(str(self.root) + os.sep):
            raise ValueError(f"key escapes storage root: {key!r}")
        return p

    def _meta_path(self, key: str) -> Path:
        return self.root / _META_DIR / (key.lstrip("/") + ".json")

    def _is_meta(self, p: Path) -> bool:
        return _META_DIR in p.relative_to(self.root).parts

    def put(
        self,
        key: str,
        data: bytes | BinaryIO,
        *,
        content_type: str | None = None,
        metadata: dict[str, str] | None = None,
        extra_args: dict[str, Any] | None = None,
        **_ignored: Any,
    ) -> str:
        raw = _as_bytes(data)
        path = self._path(key)
        path.parent.mkdir(parents=True, exist_ok=True)
        tmp = path.with_suffix(path.suffix + ".tmp")
        tmp.write_bytes(raw)
        os.replace(tmp, path)

        mpath = self._meta_path(key)
        mpath.parent.mkdir(parents=True, exist_ok=True)
        mpath.write_text(
            json.dumps(
                {
                    "content_type": content_type,
                    "metadata": dict(metadata or {}),
                    "extra_args": {k: str(v) for k, v in (extra_args or {}).items()},
                    "size": len(raw),
                    "etag": hashlib.md5(raw).hexdigest(),  # noqa: S324 (S3 ETag semantics)
                    "last_modified": datetime.now(UTC).isoformat(),
                },
                indent=2,
            )
        )
        return key

    def get(self, key: str) -> bytes:
        path = self._path(key)
        if not path.is_file():
            raise FileNotFoundError(f"no object at key {key!r}")
        return path.read_bytes()

    def exists(self, key: str) -> bool:
        return self._path(key).is_file()

    def delete(self, key: str) -> None:
        path = self._path(key)
        if path.is_file():
            path.unlink()
        mpath = self._meta_path(key)
        if mpath.is_file():
            mpath.unlink()

    def get_url(self, key: str, *, expires_in: int = 3600) -> str:
        # OFFLINE presigned analogue: a file URI carrying the expiry window.
        return f"{self._path(key).as_uri()}#presigned&expires_in={expires_in}"

    def get_durable_url(self, key: str) -> str:
        return self._path(key).as_uri()

    def list(
        self,
        prefix: str = "",
        *,
        max_keys: int = 1000,
        continuation_token: str | None = None,
    ) -> ListPage:
        keys: list[str] = []
        for dirpath, _dirs, files in os.walk(self.root):
            for name in files:
                p = Path(dirpath) / name
                if self._is_meta(p) or p.suffix == ".tmp":
                    continue
                rel = p.relative_to(self.root).as_posix()
                if rel.startswith(prefix):
                    keys.append(rel)
        keys.sort()
        if continuation_token:
            keys = [k for k in keys if k > continuation_token]
        page = keys[:max_keys]
        next_token = page[-1] if len(keys) > max_keys else None
        entries = tuple(self._file_entry(k) for k in page)
        return ListPage(entries=entries, next_token=next_token)

    def _file_entry(self, key: str) -> FileEntry:
        path = self._path(key)
        st = path.stat()
        meta = self._read_meta(key)
        return FileEntry(
            key=key,
            size=st.st_size,
            last_modified=datetime.fromtimestamp(st.st_mtime, tz=UTC),
            etag=meta.get("etag", ""),
        )

    def _read_meta(self, key: str) -> dict[str, Any]:
        mpath = self._meta_path(key)
        if mpath.is_file():
            return json.loads(mpath.read_text())
        return {}

    def describe(self, key: str) -> ObjectMetadata:
        path = self._path(key)
        st = path.stat()
        meta = self._read_meta(key)
        return ObjectMetadata(
            key=key,
            size=st.st_size,
            last_modified=datetime.fromtimestamp(st.st_mtime, tz=UTC),
            etag=meta.get("etag", ""),
            content_type=meta.get("content_type"),
            metadata=meta.get("metadata", {}),
        )


def make_media_backend(
    base: Path, *, bucket: str | None = None, settings: Settings | None = None
) -> StorageBackend:
    """Return the media StorageBackend for the active mode.

    OFFLINE → on-disk :class:`LocalDirBackend` under ``base`` (always-green
    fallback). LIVE (B2 creds present) → the genblaze ``S3StorageBackend`` bound
    to the real B2 bucket. ``genblaze_s3`` is imported lazily so OFFLINE keeps its
    zero-S3-dependency import guarantee.
    """
    st = settings or _default_settings
    bucket = bucket or st.media_bucket
    if st.offline:
        return LocalDirBackend(base / "b2" / bucket)
    from genblaze_s3 import S3StorageBackend

    return S3StorageBackend.for_backblaze(
        bucket,
        key_id=os.environ["B2_KEY_ID"],
        app_key=os.environ["B2_APP_KEY"],
        preflight=False,
    )
