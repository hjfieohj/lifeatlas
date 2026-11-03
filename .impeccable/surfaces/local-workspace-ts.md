---
version: 1
slug: "local-workspace-ts"
primary_target: "local/workspace.ts"
related_targets: ["local/application.ts", "local/workspace.css", "local/entry.ts", "local/integrations.mjs", "local/bootstrap.ts", "src/inline-ai.ts", "src/inline-ai.css", "src/ai-context.ts", "src/growth-ai.ts", "src/growth-ai-context.ts", "src/appearance.ts", "src/cosmic-background.ts", "src/main.ts", "public/knowledge-universe/library.js", "public/knowledge-universe/library.css", "public/knowledge-universe/app.js"]
---

# LifeAtlas / 本地工作空间 · 0.4

Mode: Operate. Pinned user direction, ordinary code-led local extension; no comp or visual-system change. Current daily-use and capability authority is `docs/DAILY-USE.md`, `docs/LOCAL-WORKSPACE.md` and `PRODUCT.md`; incumbent visual tokens remain in `DESIGN.md` and `.impeccable/design.json`. Current composition below supersedes earlier standalone-AI and navigation descriptions. Earlier implementation/evidence records remain historical.

## Current production direction · daily local use · 2026-11-03

THESIS: Let the owner return each day to their own records, locate the next task, edit without losing another draft, and recover saved work through explicit backup and restore.

OWN-WORLD: Operate, ordinary refinement. Preserve the LifeAtlas wordmark, Chinese/native controls, established shell, growth index, dark stars/light clouds and deep-space 3D knowledge viewport. No visual-system change; `DESIGN.md` and `.impeccable/design.json` stay unchanged.

STORY: Today shows real pending tasks and recent records. Search/category/task-status filters narrow lists in batches of 20 without replacing the editor. Recycle-bin removal can restore the same record and analysis identity; confirmed permanent clearing leaves saved analyses retained. New record A survives editing and saving existing B through separate draft slots. Record drafts are retained automatically, while formal growth content still needs explicit saving and keeps its revision history. No personal examples are seeded. Only the owner’s explicitly identified test records are eligible for the separately backed-up installation cleanup; public upgrades do not guess titles for deletion.

FIRST VIEWPORT: `local/application.ts` supplies eight named destinations, with Investment and Life independently optional and AI attached to content. Phone navigation uses four columns for seven/eight visible destinations and three for six. Settings adds a native anchored directory for appearance/modules, backup, AI, mail and originals; secondary explanations remain in disclosures. Growth states local storage/manual saving accurately. Mail disables sync when unconfigured while cached bodies remain readable. Default development/build run the full local application; the production bundle excludes prototype controllers and the service excludes hosted OAuth routes.

FORM: Keep the incumbent reading surfaces, corners, native inputs, wrapped action rows and written status. Visible AI surfaces restore their latest source-scoped analysis; history loads 30 at a time and retains all saved analyses. Request previews bind the destination/model and block changed destinations until re-previewed. AI/mail forms track unsaved input and revisions separately: cross-form saves/removals and late responses preserve current typing. Connection secrets never enter automatic record drafts. Coalesced input writes retain immediate browser recovery; explicit backup waits for synchronization. Internal state checkpoints are bounded per key to one per minute, 16 entries and 12MB; formal revisions, AI history and complete backups are not pruned by that policy. UTF-8 byte checks enforce state capacity.

## Current production evidence and limits · 2026-11-03

Ten full-page captures in `.impeccable/review/production` cover `dark-today-desktop`, `dark-investment-desktop`, `dark-growth-desktop`, `dark-knowledge-desktop`, `dark-settings-mobile`, `light-today-mobile`, `light-investment-mobile`, `light-growth-mobile`, `light-mail-mobile` and `light-settings-desktop` (1450px / 390px). The documenter opened light Settings, dark Investment and Knowledge desktop plus light Growth and Mail mobile. The parent and reviewer inspected all ten. These are isolated test records, local simulated model output and cached fixture mail, never shipped personal examples.

Source/document comparison covered the official shell/entry, workspace, build exclusion guard, package commands and inline-AI latest/history handling, along with `docs/DAILY-USE.md` and `docs/LOCAL-WORKSPACE.md`. The supplied test log records 95 passes; the parent reports successful typecheck/build. The three `work/qa/{production,production-regression,production-fixes}/verification.json` files report passing daily-use, inline-regression and focused draft checks, zero real-provider calls and no errors. The final reviewer returned **ship, limited to production F1/F2**, both **Resolved**: F1 is cross-form/late-response connection draft preservation; F2 is new draft A retained while saving existing B. This scoped verdict does not certify the whole product, real providers or all interaction paths. It is distinct from the older inline-AI F1/F2 below.

The single `work/production-detect.json` output has zero primary findings and three advisories (two fallback border colors; preexisting 10px mobile detail text). No rerun or zero-advisory claim. Existing Platform prose schema drift remains reported without schema repair. Product/security/cost/retention limits remain in the current product and daily-use contracts.

## Historical inline-AI increment · 0.3 · 2026-11-03

> The following inline-AI direction and evidence are preserved for that increment. Its latest-30-only phrasing and earlier test/review claims are superseded by the production contract above.

## Direction contract · inline AI · 2026-11-03

THESIS: Let the owner ask for help where they are writing or reading, review exactly what will be sent, and retain the result beside its source without replacing their own words.

OWN-WORLD: Preserve LifeAtlas lettering, Chinese sans/native controls, rail/top shell, growth index and continuous reading geometry. Keep 深空 · 暗色 (`island`) stars and 晴空 · 亮色 (`observatory`) sky/clouds, including the deliberate dark knowledge viewport. Compact ruled action rows extend existing source surfaces; no new module, identity, imagery, font or global token system is introduced.

STORY: At an empty block choose “引导我开始”; with content choose “总结与扩展”. Expand and edit the question/current-block reference preview, inspect the configured endpoint/model, then explicitly send. Show pending/error/result in place, retain generated-result provenance and the original question/references, and permit copying for the owner's manual use. A changed source marks the result as corresponding to earlier content. Saving/reopening a source retains its scoped identity; pending/completed/failed requests notify remounted views. Each scope exposes its recent 30 analyses; all remain in SQLite and backups. Settings → 旧版独立分析记录 preserves legacy history.

FIRST VIEWPORT: Keep the existing heading, honest local-save status, record list/editor and source text primary. Assistance sits after growth text blocks, environment groups and whole forms, saved topic/experience/loaded-trajectory surfaces, record editors/saved records, knowledge note/file previews and opened mail. Growth trajectory context explicitly covers only loaded records. Previews contain only the current source; no automatic cross-topic, mail or library gathering. At 640px local navigation now has four columns after the AI destination was removed. At 760px record editor asides continue to lead their stacked lists. These are current composition facts, not a new global visual direction.

FORM: `src/inline-ai.css` supplies wrapped action rows, ordinary editable textareas, ruled result sections, native disclosures/history and written status. Mobile helper text moves beneath actions; action groups stack and long content wraps. The implementation reuses semantic colors and the existing reading surfaces. Appearance changes preserve live input; no authored content is auto-filled or overwritten. Missing AI configuration points to Settings while local recording remains available. Reference preview is capped at 60000 characters with a truncation notice.

## Evidence and limits · inline AI · 2026-11-03

The documenter opened all eight supplied recaptured PNGs in `.impeccable/review/inline-ai`: `island-desktop`, `island-mobile`, `observatory-desktop`, `observatory-mobile`, `growth-island-desktop`, `growth-island-mobile`, `growth-observatory-desktop` and `growth-observatory-mobile`. Desktop captures are 1450px and phone captures 390px. Investment shows source-attached results/history in editor and saved record; growth shows an editable reference preview, inline result and empty-block opening action. Both skins preserve the incumbent shell and reading geometry. Captures use isolated records and a clearly labelled local simulation.

Source comparison covered `src/inline-ai.ts/css`, `src/ai-context.ts`, `src/growth-ai.ts`, `src/growth-ai-context.ts`, `local/workspace.ts/css`, `local/integrations.mjs`, `local/bootstrap.ts` and the knowledge app/library hooks, with `docs/LOCAL-WORKSPACE.md`, `DESIGN.md` and `.impeccable/design.json` as authority. The latter two remain unchanged: no visual-system replacement is warranted. Their stale standalone-AI/five-column navigation/six-domain composition prose is superseded here and in current product authority, not silently regenerated.

The parent reports 89 passing unit tests, typecheck, local build and focused simulated source/staleness/remount checks. The final reviewer disposition is **ship**, with **pass limited to F1/F2** (false source title/staleness and delayed result lost on save); both are resolved. This is not a renewed whole-surface or real-provider certification. The one supplied detector run reported zero primary findings and three advisories: two fallback border colors and the preexisting 10px mobile detail label. No rerun, zero-advisory claim, real API or real owner mail login is asserted. Screenshots do not independently prove all optional attachment surfaces, keyboard paths or model quality. All product, cost, backup and credential limits remain in the product/local contract.

## Historical workspace record · 0.2 · 2026-11-03

> The original 0.2 direction and evidence are retained below. Standalone AI composition, five-column phone navigation, earlier test counts and review claims describe that increment only; current authority is above.

## Direction contract

THESIS: Give the owner one real local place to retain tasks, experiences, research and knowledge, then explicitly choose what to read or send to their own AI service.

OWN-WORLD: Keep LifeAtlas lettering, familiar rail/top-shell navigation, independent growth index, continuous reading geometry, Chinese sans/native controls and written states. The user explicitly changes the former two night palettes to 深空 · 暗色 (`island`) and 晴空 · 亮色 (`observatory`). Stars belong to dark, locally rendered blue sky/clouds to light. The light knowledge viewport remains deep-space; toolbar, reader and library management follow the skin. No identity replacement or new external imagery is requested.

STORY: Open Today to real tasks/recent records; write and save a record; create an independent nebula or import into a new/existing nebula; preview/edit keyword-selected references; confirm the visible question/references and destination before an AI request; save and revisit the result. Configure Gmail/163/QQ separately, manually synchronize readonly headers and open text bodies for local caching. Backup protects saved records; credentials are managed separately. Unconfigured and empty states remain useful and honest.

FIRST VIEWPORT: A clear module heading, introductory sentence and written local-saving chip precede the work. Records pair list and editor; AI pairs question/reference/confirmation/result with recent analyses; mail pairs cached list and text reader. Settings holds backup, AI/mail connections, originals management and appearance. Knowledge retains one host heading and its compact internal tools. The native library modal starts with independent-nebula creation, then upload/preview and target choice below; it scrolls internally rather than overflowing the viewport.

FORM: Reuse the existing shell and reading system, with the final local workspace stylesheet after inherited cosmic styles. Local fields/status notices use 9px corners, status chips 6px, records 12px and editor/reader sections 14px. Library modal uses 16px corners and 8px fields/previews. Local main caps at 1440px, stacks at 760px, and uses five navigation columns at 640px. Light sky-exposed small text and light knowledge-reader content use explicit dark ink overrides. Skin changes update the document attribute and preserve live work; editing/background/reduced motion pause dynamics.

## Evidence and limits · 2026-11-03

Nine captures in `.impeccable/review/v020` cover desktop light Today/Settings/Knowledge/Library, desktop dark AI/Growth, mobile light Settings/Library and mobile dark AI at 1450px/390px. The documenter inspected light Today/Library and dark AI directly and compared current source. The owning reviewer inspected all nine and, after recapture of the two light-contrast fixes, returned **ship**. The parent reports 85 passing automated tests plus isolated static-file, built PDF/DOCX and full backup/restore checks. These reports are attributed verification, not independently repeated by this documentation pass.

The supplied single detector run reported 15 advisory entries: nine colors, three radius values and three font sizes. The current frontmatter now records the actual light utilities/library colors, 6/8/16px scoped radii and 11/17/21px type roles. No advisory was converted into an unrequested UI redesign. No detector rerun or zero-warning claim is made. The library dialog and mobile Settings remain long scrolling surfaces; screenshot containment does not establish all touch/keyboard discoverability.

Real local records, uploaded originals/excerpts and saved analyses are implemented. Simulated protocol/model responses do not prove a real owner account or provider connection. Keyword retrieval is not vector retrieval; there is no autonomous model tool execution, live market feed or automatic trading. Product/security/storage limits remain in `docs/LOCAL-WORKSPACE.md` and `PRODUCT.md`.
