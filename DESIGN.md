---
name: "LifeAtlas"
description: "LifeAtlas local workspace: deep-space dark and blue-sky light skins, familiar reading geometry"
colors:
  island-paper: "#030713"
  island-nav: "#101b30"
  island-surface: "#101b2ef5"
  island-ink: "#e4edf9"
  island-muted: "#aebed2"
  island-line: "#314159"
  island-wash: "#1b2c45"
  island-green: "#b3cefa"
  island-forest: "#abc9f3"
  island-forest-deep: "#d1e4ff"
  island-accent-ink: "#142238"
  island-nav-active-bg: "#263e5e"
  island-secondary-border: "#536b87"
  island-focus: "#bedcff"
  island-rail-active: "#29476b"
  island-rail-ink: "#e4edf9"
  island-amber: "#ecd1a1"
  island-amber-bg: "#3c3124"
  island-red: "#f1b6b0"
  island-red-bg: "#3b252c"
  observatory-paper: "#e5f2fc"
  observatory-nav: "#f3f9fe"
  observatory-surface: "#ffffffed"
  observatory-ink: "#18334d"
  observatory-muted: "#49657b"
  observatory-line: "#ccddea"
  observatory-wash: "#eaf3fa"
  observatory-green: "#205e8f"
  observatory-forest: "#205e8f"
  observatory-forest-deep: "#174b75"
  observatory-accent-ink: "#fff"
  observatory-nav-active-bg: "#dbeaf7"
  observatory-secondary-border: "#8da9bd"
  observatory-focus: "#1c639b"
  observatory-rail-active: "#d7e9f8"
  observatory-rail-ink: "#173c5b"
  observatory-amber: "#795019"
  observatory-amber-bg: "#f9edda"
  observatory-red: "#a5363c"
  observatory-red-bg: "#fbeded"
  field-ground: "#0b1526"
  island-rail-ground: "#091224e8"
  observatory-rail-ground: "#f3f9fef2"
  knowledge-accent: "#b9deeb"
  knowledge-ink: "#edf1f5"
  knowledge-panel: "#141c29f5"
  knowledge-label-detail: "#c4d2e3"
  knowledge-label-hover-bg: "#081426c9"
  knowledge-portal-label-bg: "#07112170"
  knowledge-label-hover-outline: "#88a9ce60"
  observatory-field-ground: "#fff"
  observatory-selected-ink: "#18334d"
  light-selection-bg: "#c0dff6"
  light-selection-ink: "#12334b"
  light-scroll-track: "#e5eff7"
  light-scroll-thumb: "#91aebf"
  knowledge-custom-default: "#85cfc6"
  knowledge-library-ground: "#111e30"
  knowledge-library-ink: "#e5edf7"
  knowledge-library-border: "#526b87"
  knowledge-library-muted: "#b9cadc"
  knowledge-library-line: "#3c5067"
  knowledge-library-field: "#091425"
  knowledge-library-field-ink: "#e7eff8"
  knowledge-library-field-border: "#70849a"
  knowledge-library-placeholder: "#a6b7c9"
  knowledge-library-light: "#f8fcff"
  knowledge-light-control: "#e4eff8"
  knowledge-light-summary: "#275e87"
typography:
  headline:
    fontFamily: "'Microsoft YaHei', 'PingFang SC', system-ui, sans-serif"
    fontSize: "30px"
    fontWeight: 600
    lineHeight: 1.5
    letterSpacing: "-.025em"
  growth-headline-mobile:
    fontFamily: "'Microsoft YaHei', 'PingFang SC', system-ui, sans-serif"
    fontSize: "25px"
    fontWeight: 600
    lineHeight: 1.65
  topic-title:
    fontFamily: "'Microsoft YaHei', 'PingFang SC', system-ui, sans-serif"
    fontSize: "20px"
    fontWeight: 600
    lineHeight: 1.75
    letterSpacing: "-.015em"
  body:
    fontFamily: "'Microsoft YaHei', 'PingFang SC', system-ui, sans-serif"
    fontSize: "14px"
    lineHeight: 1.65
  event:
    fontFamily: "'Microsoft YaHei', 'PingFang SC', system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 500
    lineHeight: 1.95
  comparison:
    fontFamily: "AtlasSerif, 'Noto Serif SC', serif"
    fontSize: "18px"
    lineHeight: 1.95
  label:
    fontFamily: "'Microsoft YaHei', 'PingFang SC', system-ui, sans-serif"
    fontSize: "13px"
    lineHeight: 1.65
  editor:
    fontFamily: "'Microsoft YaHei', 'PingFang SC', system-ui, sans-serif"
    fontSize: "15px"
    lineHeight: 1.85
  knowledge-heading:
    fontFamily: "Atlas, 'Microsoft YaHei', 'PingFang SC', sans-serif"
    fontSize: "24px"
    fontWeight: 400
    lineHeight: 1.4
  knowledge-node-label:
    fontFamily: "Atlas, 'Microsoft YaHei', 'PingFang SC', sans-serif"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1.5
  knowledge-domain-label:
    fontFamily: "Atlas, 'Microsoft YaHei', 'PingFang SC', sans-serif"
    fontSize: "15px"
    fontWeight: 500
    lineHeight: 1.5
    letterSpacing: ".06em"
  knowledge-domain-label-mobile:
    fontFamily: "Atlas, 'Microsoft YaHei', 'PingFang SC', sans-serif"
    fontSize: "13px"
    fontWeight: 500
    lineHeight: 1.5
    letterSpacing: ".06em"
  work-subtitle:
    fontFamily: "'Microsoft YaHei', 'PingFang SC', system-ui, sans-serif"
    fontSize: "17px"
    lineHeight: 1.6
  supporting-small:
    fontFamily: "'Microsoft YaHei', 'PingFang SC', system-ui, sans-serif"
    fontSize: "11px"
  library-heading-mobile:
    fontFamily: "Atlas, 'Microsoft YaHei', 'PingFang SC', sans-serif"
    fontSize: "21px"
rounded:
  local-field: "9px"
  local-chip: "6px"
  library-field: "8px"
  library-dialog: "16px"
  control: "12px"
  navigation: "9px"
  filter: "10px"
  comparison: "12px"
  sheet: "14px"
  knowledge-label: "5px"
spacing:
  local-editor: "24px"
  local-record: "22px 24px"
  local-mobile: "20px"
  library-dialog: "28px"
  control: "10px 16px"
  sheet: "26px 28px"
  comparison: "20px"
  growth-gap: "26px"
  mobile-sheet: "22px 18px"
  editor: "30px 32px"
components:
  button-primary-island:
    backgroundColor: "{colors.island-forest}"
    textColor: "{colors.island-accent-ink}"
    rounded: "{rounded.control}"
    padding: "{spacing.control}"
    height: "44px"
  button-primary-island-hover:
    backgroundColor: "{colors.island-forest-deep}"
  button-primary-observatory:
    backgroundColor: "{colors.observatory-forest}"
    textColor: "{colors.observatory-accent-ink}"
    rounded: "{rounded.control}"
    padding: "{spacing.control}"
    height: "44px"
  button-primary-observatory-hover:
    backgroundColor: "{colors.observatory-forest-deep}"
  button-subtle:
    backgroundColor: "{colors.island-surface}"
    textColor: "{colors.island-ink}"
    rounded: "{rounded.control}"
    padding: "{spacing.control}"
  input:
    backgroundColor: "{colors.field-ground}"
    textColor: "{colors.island-ink}"
    rounded: "{rounded.control}"
    padding: "11px 12px"
    typography: "{typography.editor}"
  navigation-active:
    backgroundColor: "{colors.island-rail-active}"
    textColor: "{colors.island-ink}"
    rounded: "{rounded.navigation}"
    padding: "12px"
  topic-active:
    backgroundColor: "{colors.island-nav-active-bg}"
    textColor: "{colors.island-green}"
    rounded: "{rounded.control}"
    padding: "13px 11px"
  status-awaiting:
    backgroundColor: "{colors.island-amber-bg}"
    textColor: "{colors.island-amber}"
    rounded: "5px"
    padding: "4px 8px"
  growth-reading-sheet:
    backgroundColor: "{colors.island-surface}"
    textColor: "{colors.island-ink}"
    rounded: "{rounded.sheet}"
    padding: "{spacing.sheet}"
  comparison-cool:
    backgroundColor: "{colors.island-wash}"
    rounded: "{rounded.comparison}"
    padding: "{spacing.comparison}"
  comparison-warm:
    backgroundColor: "{colors.island-wash}"
    rounded: "{rounded.comparison}"
    padding: "{spacing.comparison}"
  knowledge-node-label:
    backgroundColor: "transparent"
    rounded: "{rounded.knowledge-label}"
    typography: "{typography.knowledge-node-label}"
  knowledge-domain-label:
    backgroundColor: "transparent"
    rounded: "{rounded.knowledge-label}"
    typography: "{typography.knowledge-domain-label}"
  knowledge-portal-label:
    backgroundColor: "{colors.knowledge-portal-label-bg}"
    rounded: "{rounded.knowledge-label}"
  knowledge-node-label-hover:
    backgroundColor: "{colors.knowledge-label-hover-bg}"
  button-subtle-observatory:
    backgroundColor: "{colors.observatory-surface}"
    textColor: "{colors.observatory-ink}"
    rounded: "{rounded.control}"
    padding: "{spacing.control}"
  local-input-island:
    backgroundColor: "{colors.field-ground}"
    textColor: "{colors.island-ink}"
    rounded: "{rounded.local-field}"
    padding: "11px 12px"
  local-input-observatory:
    backgroundColor: "{colors.observatory-field-ground}"
    textColor: "{colors.observatory-ink}"
    rounded: "{rounded.local-field}"
    padding: "11px 12px"
  navigation-active-observatory:
    backgroundColor: "{colors.observatory-rail-active}"
    textColor: "{colors.observatory-selected-ink}"
    rounded: "{rounded.navigation}"
    padding: "12px"
  local-record:
    backgroundColor: "{colors.island-surface}"
    textColor: "{colors.island-ink}"
    rounded: "{rounded.control}"
    padding: "{spacing.local-record}"
  local-editor:
    backgroundColor: "{colors.island-surface}"
    textColor: "{colors.island-ink}"
    rounded: "{rounded.sheet}"
    padding: "{spacing.local-editor}"
  local-chip:
    backgroundColor: "{colors.island-wash}"
    textColor: "{colors.island-green}"
    rounded: "{rounded.local-chip}"
    padding: "6px 10px"
  knowledge-library-dialog:
    backgroundColor: "{colors.knowledge-library-ground}"
    textColor: "{colors.knowledge-library-ink}"
    rounded: "{rounded.library-dialog}"
    padding: "{spacing.library-dialog}"
  knowledge-library-dialog-observatory:
    backgroundColor: "{colors.knowledge-library-light}"
    textColor: "{colors.observatory-ink}"
    rounded: "{rounded.library-dialog}"
    padding: "{spacing.library-dialog}"
---

# Design System: LifeAtlas

## Overview

**Creative North Star: "生活阅览室 × 知识宇宙"**

LifeAtlas retains its outlined wordmark, app rail, independent topic index, continuous reading geometry and native controls. The current local workspace extends that world with real record forms, an AI question–references–confirmation–result sequence, readonly mail and local knowledge management. The user's November 3 direction explicitly replaces the earlier pair of night palettes with 深空 · 暗色 (Island, default) and 晴空 · 亮色 (Observatory); stored identifiers remain compatible.

Dark surrounds calm, near-opaque reading surfaces with locally rendered stars. Light surrounds pale navigation and reading surfaces with locally rendered blue sky and clouds. The knowledge map remains a deep-space volume inside light surroundings so stellar knowledge stays visible. This is a code-led expansion of the pinned direction; no new comp or identity replacement is asserted. October white-sheet/lake concepts and the November 2 two-night-palette description are historical, not current authority.

**Key Characteristics:**

- One locally generated atmospheric background: stars in dark, blue sky/clouds in light.
- The established LifeAtlas lettering, rail, growth index and continuous reading geometry.
- Real local lists and editors, explicit written states and honest empty views.
- Chinese sans host UI, serif growth comparisons and local Space Grotesk inside knowledge.
- A deep-space 3D knowledge viewport with skin-aware surrounding controls and reading panels.

## Colors

The frontmatter records the shipped local program's final cascade: `local/entry.ts` imports inherited layers through `src/cosmic-integration.css`, then `local/workspace.css`. The latter overrides Observatory to light and supplies local fields/rail. `public/knowledge-universe/library.css`, loaded after the nebula layer, supplies light knowledge chrome, reader and management-dialog overrides. The retained hosted entry's earlier cascade is not the current installed program's palette authority.

### Primary

Island uses pale blue actions on midnight-blue surfaces; Observatory uses deep blue actions on pale surfaces. Main buttons use each skin's accent-ink, so dark actions have dark lettering and light actions have white lettering. Semantic CSS names `green` and `forest` retain compatibility; their names do not require a green hue. Local active navigation uses ink, including dark-blue ink on the light selected rail fill.

### Secondary

Knowledge keeps pale cyan and existing domain tints to identify content and relations. The mint custom-nebula default is an editable user-content color, not a third skin. Its map-local dark label/hover colors remain intentional in either skin.

### Neutral

Dark uses midnight ground and near-opaque blue reading panels; light uses blue-white ground, white fields and pale reading panels. Rail ground, muted text, lines and wash are distinct roles. Sky-exposed light introductory/help text, links, timestamps, footer and growth/AI sidebar text use ink where final scoped CSS needs stronger contrast; interior muted hierarchy remains. Knowledge light reader content and hover states also use explicit ink/deep-blue overrides rather than inherited pale dark-theme text. Amber and red are skin-specific written pending/error treatments. Selection and scrollbar colors are scoped light utilities, not new action roles.

**The Textual State Rule.** Every consequential status has a written label; color is an additional cue.

## Typography

**Display and body font:** Microsoft YaHei, PingFang SC, system sans. **Comparison font:** self-hosted AtlasSerif, Noto Serif SC, serif. **Knowledge font:** local Space Grotesk under the internal Atlas family name with Chinese OS fallbacks. **Wordmark:** outlined Alegreya lettering, independent of page typography.

Local module headings use the headline role; section headings are 20px/1.6, local record subtitles 17px/1.6 and empty-state subtitles 18px. Body inherits 14px/1.65, local prose reads at 1.9, record paragraphs at 1.85 and local textareas at 1.8. Reading text caps at 75ch; introductory copy at 70ch. Metadata is 12px; small navigation/library controls are 11px. The library heading is 24px, reducing to the documented 21px role at 620px. Dates use tabular numerals.

Existing growth typography remains: topic titles, explicit event/reflection hierarchy, serif comparison excerpts, preserved line breaks and native editor fields. Its phone-specific type and reading treatment remain inherited. Projected knowledge labels keep one title centered on the stellar core, with existing 12px node and 15px/13px domain roles. These scoped steps describe actual functions rather than a new general type scale.

## Layout

The desktop rail remains 208px; local main content is capped at 1440px with padding 34px 38px 60px. The inherited top-shell transition remains 1050px. Local records place a flexible list beside a 290–360px editor with a 38px gap. AI uses a flexible 26px-padded reading/form section and a 280px history column. Mail uses a 300px list, flexible text reader and 30px gap. Growth preserves its separate topic index and continuous reading sheet. Settings retains the existing two-column arrangement and ordinary sections.

At 1100px, local main padding becomes 26px 24px 45px, record/editor gap 24px and mail list/gap 250px/20px. At 760px, records, AI and mail stack; ordinary editor asides lead, while AI history follows the analysis. Main padding becomes 24px 18px 120px; editor/reader padding becomes 20px. Two paired local fields remain two columns. At 640px the local navigation uses five columns, 64px minimum items, 11px labels and 10px detail labels, accommodating actual visible destinations rather than the historical six/eight-route formula.

Knowledge retains its dedicated full-width iframe and compact module toolbar, with inherited 600px desktop minimum and 620px/650px top-shell/phone minima. Selection opens a reader beside the map or a bottom drawer at the iframe's 620px breakpoint. Library management uses a native modal constrained to min(760px, viewport minus 28px), 88dvh maximum height and internal scrolling; padding changes from 28px to 20px at 620px. Long filenames, paths, references and record text wrap. The lower upload section may require scrolling; this is a scoped interaction limitation, not an instruction to invent a new global layout.

## Elevation & Depth

Atmospheric depth comes from the locally drawn sky and volumetric knowledge map; text uses stable reading surfaces. Local editors/start/settings-note surfaces have a low ambient shadow, different in dark and light. The inherited growth sheet shadow remains its own token; dialogs use a stronger overlay/backdrop. The map retains perspective (47°), transparent WebGL rendering, organic XYZ gas, stellar cores, dust and broad semantic bridges. In light mode its viewport has a deliberate deep-space ground while reader, toolbar and management surfaces become light.

**The Continuous Atmosphere Rule.** Use one body-level atmosphere for the shell; preserve the deliberate dark knowledge viewport in the light skin and skin-aware surrounding reading controls.

**The Index and Sheet Rule.** The topic index locates; the near-opaque sheet carries reading. Use dividers and disclosures inside the sheet rather than another stack of equal-weight cards.

`src/cosmic-background.ts` generates the sky locally using offscreen noise: dark adds drifting stars/twinkle; light renders blue-white cloud color without stars. Rendering caps at 24fps desktop, 20fps below 640px and approximately 1.7 million bitmap pixels. Editing, hidden documents and reduced motion pause animation; switching dynamics off retains a static background. The knowledge renderer has its own approximately 30fps cap and shared motion gates. No image API, external footage or cloud renderer is needed.

## Shapes

Existing shared buttons retain 12px corners, active navigation 9px, growth filters 10px and reading sheets 14px. Local fields/status notices use 9px, local status chips 6px, records 12px and editor/AI/mail reading surfaces 14px. The scoped knowledge library modal uses 16px corners, with 8px fields/previews; projected labels retain 5px. These are intentional local roles rather than global replacement values. Custom nebulae continue existing irregular gas/stellar geometry rather than introducing card-shaped objects in the map.

## Components

### Wordmark and application icon

The LifeAtlas outlined Alegreya wordmark remains true italic 550 “Life” and roman 500 “Atlas”, matched cap heights, baseline and optical seam. It inherits currentColor; widths remain 156px desktop, 146px top shell and 138px small shell. The home link retains its accessible Chinese name and small-shell subtitle behavior. The original Atlas Orbit app icon remains a packaging asset with its own colors and shape, documented in `docs/APP-ICON.md`; it does not redefine UI tokens. Source and OFL attribution remain in `public/brand/`.

### Buttons and fields

Native main actions bind to forest/forest-deep and accent-ink. Subtle actions use surface, ink and secondary border; written disabled/loading states remain visible. Existing Uiverse-derived expanding CTA feedback is 240ms with a 180ms arrow shift; common feedback and switches use 180ms. Shared action targets retain 44px minimum height. Local field fill uses work-field, with a 9px corner and 11px 12px padding; inherited growth controls keep their own 12px geometry. Local keyboard focus is a 2px palette focus outline with 3px offset. Reduced motion suppresses transitions. Pinned source/MIT attribution remain in `docs/UIVERSE-DESIGN.md`.

### Navigation and reading

The local workspace exposes Today, Growth, Knowledge, optional Investment and Life, AI Analysis, Mail, Task Records and Settings. Task Records reuses the history route identifier. Optional destination switches remain independent. The wordmark and existing rail/top-shell behavior remain; current local mobile navigation uses the scoped five-column treatment. Records use list + editor composition, AI uses question → editable references → destination confirmation → saved result, and mail uses list + text reading. Empty views explain the next useful action; saved history is not fabricated to fill space.

### Knowledge and library management

The six built-in domains remain distinct; content counts are not layout tokens. Users can create/rename/delete custom nebulae and upload into an independent/new or existing nebula. File outline/excerpts become real custom hierarchy, not inferred semantic links. The library modal is a native dialog with labelled inputs, close action, explicit extraction/preview and confirmation controls, written status and internal scrolling. Dark/light modal fields/reading text follow their scoped palette; knowledge actions retain the module's established accent. Original-file management belongs in Settings. Static file mode has narrower capabilities than the full local program; product limits are in `docs/LOCAL-WORKSPACE.md`.

Existing trackball rotation/roll, pan, zoom, inertial settling, camera fit and map labels remain. Approaching reveals a title at the projected core; selected labels receive priority, local overlap culling does not relocate labels, and the domain selector stays usable. Long knowledge content is read in the reader rather than on gas. Nebula/bridge rendering remains governed by its source and sidecar motion metadata.

### Appearance and live work

The selector has exactly two current choices: 深空 · 暗色 and 晴空 · 亮色. The `island` and `observatory` identifiers preserve saved preference compatibility, not historical visual appearance. Settings → 外观与动态 is the only appearance/dynamics location. Local backup, AI/mail configuration and original-file management use ordinary Settings sections and labelled native controls, with explicit connection, persistence and failure messages.

**The Live Task Rule.** Changing appearance preserves live input, focus, scroll and the current view by updating the document skin attribute.

## Do's and Don'ts

### Do

- Do use the active skin's semantic variables and the final local workspace cascade.
- Do preserve LifeAtlas lettering, established reading geometry, native control semantics and explicit written states.
- Do use ink for small text exposed directly to the light sky and explicit dark reader text on light knowledge surfaces.
- Do keep the knowledge viewport deep-space in light mode while its toolbar, reader and library follow the selected skin.
- Do keep appearance controls in Settings and honor editing, hidden-document and reduced-motion pauses.
- Do distinguish authored local records, isolated test fixtures, bounded rules and user-requested model output.

### Don't

- Don't restore historical lake concepts, a horizontal Observatory desktop shell or the superseded two-dark-palette commitment as current authority.
- Don't duplicate brand/navigation inside the knowledge frame or remount live work to change appearance.
- Don't put long reading text directly on an animated background.
- Don't claim real account success, semantic/vector retrieval, automatic tools, live markets or trading from these surfaces.
- Don't treat a simulated analysis or protocol test as proof of a real provider or the owner's credentials.
