# CHANGELOG


## v1.7.1 (2026-08-04)

### Continuous Integration

- **release**: Set semantic-release changelog mode=init + backfill CHANGELOG
  ([`83bb995`](https://github.com/edycutjong/salvo/commit/83bb995a2b877a3d0b8fa3c563c3d390fc31a370))

### Performance Improvements

- **landing**: Set explicit dimensions on footer sponsor logos
  ([`500f7c7`](https://github.com/edycutjong/salvo/commit/500f7c7a793eb2d2fb4bf25bfd3d5e8fc19e2dc2))


## v1.7.0 (2026-08-04)

### Chores

- Verify single-path Railway deploy after GitHub disconnect (no-op)
  ([`3c56478`](https://github.com/edycutjong/salvo/commit/3c56478382f4717d4970a9c551162e1f62bdd6aa))

### Continuous Integration

- Tolerate Railway 'Failed to stream build logs' flake — verify deploy via /healthz instead of
  failing on log-stream error
  ([`cae49ad`](https://github.com/edycutjong/salvo/commit/cae49ad3841ae32269cda251a5ae4ba21c000f95))

### Documentation

- **readme**: Correct test count 19 → 37 (accurate count)
  ([`6817733`](https://github.com/edycutjong/salvo/commit/6817733b8aa166781b04de5766056e291e3dc1d5))

### Features

- Author credit in README footer + expand landing footer socials
  ([`8065845`](https://github.com/edycutjong/salvo/commit/8065845a2cf502d90b23bc4222a6cbc79d142689))


## v1.6.0 (2026-08-03)

### Documentation

- **readme**: Add Devpost project badge
  ([`60d13fb`](https://github.com/edycutjong/salvo/commit/60d13fbcaea6b90468e4b0c10c6ff9cdb4023d4a))

### Features

- Credit sponsors (Backblaze + GMI Cloud) in README, landing footer, and pitch deck
  ([`c054eb4`](https://github.com/edycutjong/salvo/commit/c054eb45629f3419e98c232e1ced9d6bc1f1170b))


## v1.5.0 (2026-08-03)

### Features

- Wire real demo video URL everywhere — README badge, landing footer, pitch deck Ask slide
  ([`48bce63`](https://github.com/edycutjong/salvo/commit/48bce63e70a7695b62a0ab709111a7f7d897cf26))


## v1.4.0 (2026-08-03)

### Features

- **pitch**: Rebuild deck to full spec — 10 slides, presenter mode (P), ESC overview, contrast debug
  (C), print-to-PDF (10 pages), cover animation, doc-quality architecture, real console screenshot
  with numbered callouts, QR ask
  ([`cd97df0`](https://github.com/edycutjong/salvo/commit/cd97df0f6f2ba0cba0724f96cca504fe4376759e))


## v1.3.0 (2026-08-03)

### Features

- **pitch**: Add branded single-file pitch deck at /pitch.html (keyboard/swipe nav, 8 slides)
  ([`2ec5a60`](https://github.com/edycutjong/salvo/commit/2ec5a60ec377e77de003e41e5b4e3d4e768a4eeb))


## v1.2.1 (2026-08-03)

### Bug Fixes

- **console**: Rich idle state with scoring-rubric cards (fills empty void), slimmer variant
  thumbnail with gradient backdrop
  ([`b54ab22`](https://github.com/edycutjong/salvo/commit/b54ab22e83dc38a637d5c9eb426d7e720bd24fd4))


## v1.2.0 (2026-08-03)

### Features

- **console+landing**: Redesign console to match landing (brand fonts, white gradient button, preset
  chips); swap hero 📝 emoji for Crosshair icon
  ([`8bcb733`](https://github.com/edycutjong/salvo/commit/8bcb733209eaf2552cb27297161e76af6b5c0a83))


## v1.1.2 (2026-08-03)

### Bug Fixes

- **security**: Next 15 + React 19 + postcss/sharp pins (landing) and force Pillow≥12.3.0 (uv
  override) — clears 42 Dependabot alerts; tests green
  ([`809df99`](https://github.com/edycutjong/salvo/commit/809df992c3e17261063d5eddf94f56e4f855a906))


## v1.1.1 (2026-08-03)

### Bug Fixes

- **landing**: White text on primary buttons (was dark, low-contrast) + single-line brief input
  aligned with controls
  ([`6c3187c`](https://github.com/edycutjong/salvo/commit/6c3187c94d2c8a2bbf00fe1546a897742186a457))

### Build System

- **deps**: Bump fastapi>=0.141.1, httpx>=0.28.1, pytest-asyncio>=1.4.0, pytest-cov>=7.1.0
  ([`303fdbe`](https://github.com/edycutjong/salvo/commit/303fdbe1fac6d40c587eb8d7d1e26e3bfb3aace2))

### Chores

- Prune unused docs assets + landing/readme polish
  ([`7818dae`](https://github.com/edycutjong/salvo/commit/7818daef58ae1f1d0aefad79f6af9ef9bc48f6c1))

### Documentation

- **readme**: Add tests/license/release/CI status badges
  ([`1860468`](https://github.com/edycutjong/salvo/commit/1860468fab912722d2034c6da3320b443ac4e0a9))


## v1.1.0 (2026-08-03)

### Chores

- Set baseline version to 1.0.0
  ([`a5ad72d`](https://github.com/edycutjong/salvo/commit/a5ad72da80607f624c7fcd5e13f4660ab36f1e38))

- **pages**: Pin custom domain via CNAME
  ([`29b2025`](https://github.com/edycutjong/salvo/commit/29b202537ddca4d240964d45804a40291f8acaae))

### Continuous Integration

- Trigger deploy to verify RAILWAY_TOKEN
  ([`6e1e266`](https://github.com/edycutjong/salvo/commit/6e1e2660c7aa8b2481afcd26add1e0c043c8f3e8))

### Documentation

- Mermaid diagram for How it works + emoji on section headings
  ([`559ef2b`](https://github.com/edycutjong/salvo/commit/559ef2ba8f518d09ccd13bc0a951da7c67c9b1ba))

### Features

- **landing**: Complete metadata + apple-icon + OG image, modern browserslist; README
  landing/api/pitch badges
  ([`3f719bf`](https://github.com/edycutjong/salvo/commit/3f719bf0613358e3f380e6deda5ecfe7aad65e73))


## v1.0.0 (2026-08-03)

- Initial Release
