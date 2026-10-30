---
version: 1
slug: "src-growth-ts"
primary_target: "src/growth.ts"
related_targets: ["src/reading-room.css","src/growth-presentation.ts","src/main.ts","src/skins.css"]
---

# LifeAtlas / 生活阅览室
Mode: Operate + Read. Owner and later individual users recording lived experience and understanding their environment. Scope: shared shell, growth, mail, history, settings and Today. Keep real data, native interactions, two selectable skins and the existing particle renderer.

## Direction contract
THESIS: A quiet working reading room lets the user locate a theme, understand a real experience, and choose the next action without a stack of equal-weight boxes.
OWN-WORLD: Deep blue fixed navigation; cool blue ground; white 14px-corner reading surface; restrained indigo selection. System Chinese sans for controls and titles; existing serif only in comparison excerpts. Flat topic index, continuous reading, 8px controls, one soft sheet elevation. Observatory retains charcoal and rust color roles inside the same layout.
STORY: Locate a theme in the adjacent index, use either environment analysis or decision support, then read, compare and respond to actual dated records. Earlier versions, uncertainty and storage remain findable.
FIRST VIEWPORT: A 208px desktop app rail, compact 64px utility bar, 30px module heading with the primary recording action; five environment scopes beneath. A 186px theme index sits beside the flexible white reading sheet. Two compact analysis entries share a divided operation band above standard tabs and the continuous record area. Metadata, starting point, sources and filtering expand on demand. Phone navigation becomes a five-item horizontal row; topics scroll within their own region, content stacks without page overflow. Signature interaction: switching skin updates color in place while preserving a live draft; choosing a theme keeps the same reading anchor and control positions. No entrance animation; state transitions use existing 150ms controls, particles remain independently paused.
FORM: Grounded candidate 7, public reading room; direction seed 32a82516. Seven considered sources: open folio, garden journal, civic wayfinding, museum catalogue, family album, correspondence desk, public reading room. User selected 生活阅览室 through the structured question fallback after the decision page closed unanswered. Code-led; chosen sketch .impeccable/mocks/decision/reading-room.html is the layout reference, no approved raster comp.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

Constraints: no fabricated personal records, no new collection or analysis claims, no data migration. Existing two skin choices remain. Public source remains hjfieohj/lifeatlas. No new raster assets, fonts or paid services required. Native details keep secondary tools available; all existing field limits, save behavior, archived records and feedback references remain.

## Ordinary extension · 2026-10-31

The approved integrated-analysis extension keeps the reading-room world and both selectable palettes. Within “帮我看清局面”, the report now follows four questions: self and surrounding subjects → how their characteristics interact and affect the situation → feasible action space → revising understanding after actual outcomes. This approval expands the earlier analysis scope; it does not authorize automatic collection, model calls, source verification or personality diagnosis. Product behavior and limits are recorded in PRODUCT.md and docs/ENVIRONMENT-INTEGRATED-ANALYSIS.md.

The added subject and relationship editor reuses existing native fields, buttons and optional disclosures. Report sections and expandable subject readings use flat ruled divisions inside the continuous sheet. `src/guidance-integration.css`, loaded after `src/reading-room.css`, adds only scoped composition: existing semantic colors, Chinese sans hierarchy, visible focus, 44px minimum subject action targets and the incumbent 640px stacking breakpoint. It defines no new palette, font, elevation or motion tokens. The global DESIGN.md and .impeccable/design.json remain authoritative and unchanged.

Documentation comparison checked `src/guidance-integration.css`, `src/guidance-subjects-ui.ts`, `src/growth-advisor.ts`, the integration rendering in `src/growth.ts`, and the inherited controls, semantic variables and responsive rules in `src/reading-room.css`. The four supplied captures were opened individually: `.impeccable/review/integrated-desktop.jpg`, `integrated-mobile.jpg`, `integrated-editor-desktop.jpg` and `integrated-editor-mobile.jpg`. They show the integrated reading/editor sections at desktop and phone widths in Island; Observatory inheritance is supported by semantic-variable reuse, not a new screenshot claim. The independent finish review returned `ship` with no required fixes. This is an ordinary-extension consistency check, not a refresh of the global system or a new whole-site visual audit.
