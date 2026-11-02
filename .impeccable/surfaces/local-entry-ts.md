---
version: 1
slug: "local-entry-ts"
primary_target: "local/entry.ts"
related_targets: ["local/storage.ts", "src/main.ts", "src/reading-room.css", "src/uiverse-system.css", "src/cosmic-integration.css"]
---

# LifeAtlas / 本地资料与备份

Mode: Operate + Read. Ordinary extension of the existing 生活阅览室 × 知识宇宙 world. The owner wants the whole app as a personal PC program with long-term disk records; browser technology is acceptable. Runtime and migration truth belong in PRODUCT.md and docs/LOCAL-APP.md.

## Direction contract

THESIS: Keep the familiar app and give its owner a clear place to check disk saving, locate personal data and protect or recover the whole collection.

OWN-WORLD: Preserve the current cosmic night palettes, wordmark, navigation, continuous reading sheets, Chinese sans UI, 12px native controls and reduced-motion behavior. `local/entry.ts` imports every incumbent style layer, ending in `src/cosmic-integration.css`. No new CSS, visual assets, palette or type tokens are introduced by this panel.

STORY: Open the local program, write and explicitly save growth records or use existing knowledge saving, check written disk status, then use Settings for full backup, confirmed restore or draft rescue. Distinguish saved records from pending or conflicting drafts and distinguish full-app backups from knowledge-only exports.

FIRST VIEWPORT: Keep existing shell and Settings context. The first section in the main Settings column is “本地资料与备份”, with status, a plain storage explanation, a wrapping data-folder path and the existing wrapping action row: primary “备份全部资料”, subtle “从备份恢复”, subtle “导出本窗口草稿”. A hidden native file input handles the chosen JSON. Restore uses native confirmation. Existing responsive Settings rules stack the surface without inventing a new breakpoint. Existing live status and error notice semantics carry failures into the current route; written state accompanies color.

FORM: Code-led extension in `local/entry.ts`, reusing `.settings-section`, `.inline-buttons`, `.button`, `.notice.error`, native buttons, file selection and confirmation. The local app icon derives from the existing favicon; it is packaging identity, not a new interface system.

## Documentation check · 2026-11-03

Source comparison checked local/entry.ts, local/storage.ts, local/server.mjs, local/database.mjs, local/launcher.mjs, scripts/build-local.mjs and scripts/install-local.mjs, plus inherited Settings rules in src/style.css, src/reading-room.css, src/uiverse-system.css and src/cosmic-integration.css. No reusable token or component specimen changed; DESIGN.md receives only the local-entry and panel composition notes, while `.impeccable/design.json` remains unchanged. This documentation pass does not create a new review verdict or claim new screenshot coverage. Separate supplied QA records cover behavior and rendering; migration and final installed-package results are recorded by the owning task.

No pre-existing visual advisories were promoted into design rules. The earlier growth-surface light-palette contract remains historical; current DESIGN.md cosmic tokens take precedence for this local extension.

Finish: fresh scoped UI review returned `ship` with no material fixes over the supplied desktop Settings, Growth and mobile Settings captures. Type checking, local build and 77 automated tests pass. Isolated runtime QA additionally checked disk persistence, restart/new-browser reading, backup/restore, invalid backups, source/host checks and interrupted-save recovery. Installation copied the existing growth database with a consistency backup and compared its record tables row-for-row; reports and personal files remain local. This does not certify all backend security or external Gmail integration.
