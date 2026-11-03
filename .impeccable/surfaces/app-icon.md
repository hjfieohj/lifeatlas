# LifeAtlas desktop icon

Mode: Operate. Scope: desktop, executable and favicon identity asset. Existing app UI, navigation wordmark, design tokens and personal data retain their current authority.

User request: replace the unattractive desktop icon with a minimal, refined mark informed by major software brands.

Direction: **Atlas Orbit**. One soft white Atlas arch on a restrained midnight tile, crossed by one mint rising orbit. The arch reads as A and a gateway; the orbit connects it to exploration. No text, starfield, fine outlines or third-party logo assets. Gentle ground shading stays subordinate to the two-stroke glyph.

First view: a single recognizable mark at desktop size. One 1024-unit SVG supplies all sizes; the tile has a corner radius of 232 units, a white arch stroke of 92 units and a mint orbit stroke of 66 units, with rounded stroke ends. Asset-local colors are ground `#263753` to `#101827`, arch `#F3F7FC` and orbit `#80DDCD`. These values are not new application tokens.

Exports: Sharp renders the SVG to a 1024px transparent-corner PNG; Pillow writes native ICO frames at 16, 20, 24, 32, 40, 48, 64, 96, 128 and 256px. The executable embeds the icon, while desktop and Start menu shortcuts use `LifeAtlas-Orbit-v2.ico` as their versioned icon resource and keep the existing executable target. Both app entries request `favicon.svg?v=atlas-orbit-v2`.

Source: `public/brand/lifeatlas-app-icon.svg`. Provenance: `public/brand/app-icon-provenance.json`. Rebuild and deployment notes: `docs/APP-ICON.md`. Microsoft and Apple guidance informs simplification and small-size recognition; their logos are not source material. Original code-authored vector geometry is rasterized locally with no paid API or generated bitmap art.

Verification evidence: decoded ICO frames on light and dark grounds in `C:/Users/zzb01/Documents/Codex/2026-11-02/new-chat/work/icon-design/size-check.png`; `icon-check.json` verifies all ten sizes and transparent corners. A preview is saved as `C:/Users/zzb01/Documents/Codex/2026-11-02/new-chat/outputs/LifeAtlas新图标.png`. These are asset checks, not a live Windows desktop capture. Installed shortcut appearance requires separate observation; changing a filename avoids broad system-cache operations.
