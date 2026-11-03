# LifeAtlas desktop icon · Aurora Nebula

Mode: Operate. Scope: desktop, executable and favicon identity asset. Current application UI authority is Open Sky; the outlined LifeAtlas navigation wordmark remains a separate asset.

User pin · 2026-11-03: **Aurora Nebula / 极光星云**, an artistic flowing colored ribbon. This replaces the previous Atlas Orbit arch/orbit direction and its v2 names. The icon is original LifeAtlas vector geometry, with no copied third-party logo or generated/sourced bitmap.

Direction: a tilted folded aurora ribbon, open center and one small guiding star on a midnight rounded tile. Mint, pearl and violet give the ribbon a front/back fold; the broad silhouette carries recognition at small sizes. No text or monogram. The icon's color treatment stays asset-local and is not a global gradient/control palette.

Geometry: one 1024 × 1024 SVG, 232-unit tile corners, filled Bézier ribbon paths rather than the old fixed-width arch/orbit strokes, transparent outside corners and a compact four-point guiding star. Ground uses `#243653` → `#111c34` → `#101427`; palette anchors are mint `#6be0d3`, pearl `#b7eddd`, violet `#a08dd8` and star `#effaf5`. Full path and gradient authority is `public/brand/lifeatlas-app-icon.svg`; provenance is `public/brand/app-icon-provenance.json`.

Exports: Sharp rasterizes a 1024px PNG; `scripts/build-local-icon.py` embeds `impeccable:prompt` provenance and Pillow writes native ICO frames at 16, 20, 24, 32, 40, 48, 64, 96, 128 and 256px. Source outputs are `local/lifeatlas-icon.png` and `local/lifeatlas.ico`; local build copies `LifeAtlas.ico` and `LifeAtlas-Aurora-v3.ico` and embeds the icon in `LifeAtlas.exe`. Shortcuts use a `LifeAtlas-Shortcut-<content-hash>.ico` copied from the v3 file; the primary target remains the native executable. Both web and local HTML entries request `favicon.svg?v=atlas-aurora-v3`.

Reference: Apple App icons principles only, for simplicity and small-size recognition. No Apple logos, SF font files or SF Symbols are distributed. Rebuild, cache behavior and cost boundaries are recorded in `docs/APP-ICON.md`.

Evidence: the documenter viewed `C:/Users/zzb01/Documents/Codex/2026-11-02/new-chat/work/icon-aurora/size-check.png` on light/dark grounds and read `icon-check.json` (ten decoded sizes, transparent corners) and `native-check.json` (the EXE's extracted 32px frame matches the ICO frame pixel for pixel). These are asset/native-resource checks. Installed shortcut targets/hash and public release assets require separate verification; no Windows-shell screenshot is asserted. Local open-source rendering used no paid API or cloud compute.

Standalone Knowledge Universe also uses the same generated `public/knowledge-universe/favicon.svg`, versioned with `atlas-aurora-v3`, copied from the sole geometry source by the render script.
