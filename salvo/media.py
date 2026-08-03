"""Media helpers: a dependency-free raw-PNG generator for OFFLINE ad variants.

``synth_png`` encodes a valid PNG by hand (zlib + struct) — no Pillow, no ffmpeg,
no system binaries. Each OFFLINE ad variant lands *real* PNG bytes (with a real
sha256) through the genblaze manifest/sink chain, zero network, zero credentials.

In LIVE mode these deterministic swatches are replaced by real image-provider
output (GMI FLUX / DALL·E), but the offline factory stays byte-deterministic so
the ranking is reproducible and the demo is always green.
"""

from __future__ import annotations

import hashlib
import struct
import zlib
from pathlib import Path

from genblaze_core.models.asset import Asset

RGB = tuple[int, int, int]


def _chunk(tag: bytes, data: bytes) -> bytes:
    return (
        struct.pack(">I", len(data))
        + tag
        + data
        + struct.pack(">I", zlib.crc32(tag + data) & 0xFFFFFFFF)
    )


def _encode_png(width: int, height: int, rows: list[bytearray]) -> bytes:
    """Encode 8-bit RGB scanlines into a valid PNG byte string."""
    sig = b"\x89PNG\r\n\x1a\n"
    ihdr = struct.pack(">IIBBBBB", width, height, 8, 2, 0, 0, 0)  # 8-bit, colour type 2 (RGB)
    raw = bytearray()
    for row in rows:
        raw.append(0)  # filter type 0 (None) per scanline
        raw.extend(row)
    idat = zlib.compress(bytes(raw), 9)
    return sig + _chunk(b"IHDR", ihdr) + _chunk(b"IDAT", idat) + _chunk(b"IEND", b"")


def synth_png(
    path: Path,
    *,
    width: int = 640,
    height: int = 400,
    rgb: RGB = (17, 15, 28),
    accent: RGB = (139, 92, 246),
    band: tuple[float, float] = (0.62, 0.80),
) -> Path:
    """Write a deterministic PNG swatch: solid ``rgb`` field with an ``accent`` band.

    The band mimics a headline plate on a poster; distinct ``rgb``/``accent`` per
    variant makes the grid visually differentiable while staying reproducible.
    """
    path.parent.mkdir(parents=True, exist_ok=True)
    y0 = int(band[0] * height)
    y1 = int(band[1] * height)
    bg = bytes(rgb)
    fg = bytes(accent)
    bg_row = bytearray(bg * width)
    fg_row = bytearray(fg * width)
    rows = [fg_row if y0 <= y < y1 else bg_row for y in range(height)]
    path.write_bytes(_encode_png(width, height, rows))
    return path


def local_asset(path: Path, *, media_type: str = "image/png") -> Asset:
    """Build a genblaze Asset for a local file (file:// URL + real sha256)."""
    raw = path.read_bytes()
    return Asset(
        url=path.as_uri(),
        media_type=media_type,
        sha256=hashlib.sha256(raw).hexdigest(),
        size_bytes=len(raw),
    )


def is_valid_png(data: bytes) -> bool:
    """Cheap structural check: signature + terminal IEND chunk."""
    return data[:8] == b"\x89PNG\r\n\x1a\n" and data[-8:] == b"IEND\xaeB`\x82"
