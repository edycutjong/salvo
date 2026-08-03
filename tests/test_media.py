"""Raw-PNG generator: valid bytes, deterministic, no Pillow/ffmpeg."""

from __future__ import annotations

import hashlib

from salvo.media import is_valid_png, synth_png


def test_synth_png_is_a_valid_png(store):
    p = synth_png(store / "a.png", width=64, height=40)
    data = p.read_bytes()
    assert is_valid_png(data)
    assert data[:8] == b"\x89PNG\r\n\x1a\n"


def test_synth_png_is_deterministic(store):
    a = synth_png(store / "a.png", accent=(139, 92, 246)).read_bytes()
    b = synth_png(store / "b.png", accent=(139, 92, 246)).read_bytes()
    assert hashlib.sha256(a).hexdigest() == hashlib.sha256(b).hexdigest()


def test_accent_changes_bytes(store):
    a = synth_png(store / "a.png", accent=(139, 92, 246)).read_bytes()
    b = synth_png(store / "b.png", accent=(236, 72, 153)).read_bytes()
    assert a != b
