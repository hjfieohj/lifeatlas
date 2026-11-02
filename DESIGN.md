---
name: "LifeAtlas"
description: "LifeAtlas × 知识宇宙：continuous cosmic sky, familiar reading geometry, two selectable palettes"
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
  observatory-paper: "#060713"
  observatory-nav: "#1a1b30"
  observatory-surface: "#171d2cf5"
  observatory-ink: "#f0eaf2"
  observatory-muted: "#c2b9ca"
  observatory-line: "#464257"
  observatory-wash: "#292b40"
  observatory-green: "#f2cca5"
  observatory-forest: "#efc39b"
  observatory-forest-deep: "#ffe3c6"
  observatory-accent-ink: "#2a1e21"
  observatory-nav-active-bg: "#393349"
  observatory-secondary-border: "#74677b"
  observatory-focus: "#f6d7b8"
  observatory-rail-active: "#473b51"
  observatory-rail-ink: "#f0eaf2"
  observatory-amber: "#ecd1a1"
  observatory-amber-bg: "#3c3124"
  observatory-red: "#f1b6b0"
  observatory-red-bg: "#3b252c"
  navigation-selected-ink: "#fff"
  field-ground: "#0b1526"
  island-rail-ground: "#091224b8"
  observatory-rail-ground: "#151023b8"
  knowledge-accent: "#b9deeb"
  knowledge-ink: "#edf1f5"
  knowledge-panel: "#141c29f5"
  knowledge-label-detail: "#c4d2e3"
  knowledge-label-hover-bg: "#081426c9"
  knowledge-portal-label-bg: "#07112170"
  knowledge-label-hover-outline: "#88a9ce60"
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
rounded:
  control: "12px"
  navigation: "9px"
  filter: "10px"
  comparison: "12px"
  sheet: "14px"
  knowledge-label: "5px"
spacing:
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
    textColor: "{colors.navigation-selected-ink}"
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
---

# Design System: LifeAtlas

## Overview

**Creative North Star: "生活阅览室 × 知识宇宙"**

LifeAtlas now joins its familiar reading layout to the user-requested 3D knowledge universe under one continuous cosmic sky. The outlined LifeAtlas wordmark, desktop rail, independent topic index and native controls remain the identity anchors. 光屿工作台 (Island, default) and 对页观察室 (Observatory) retain their names and shared geometry, with cool blue and warm violet/peach night palettes respectively.

The November 2 integration supersedes the earlier white-sheet palette and isolated landscape treatments. Reading remains calm and legible on near-opaque dark surfaces; the sky provides spatial continuity through the navigation and transparent knowledge scene. Knowledge is a core destination alongside the existing daily and personal modules. Appearance changes preserve live work; scenery and knowledge examples never become authored personal history.

**Key Characteristics:**

- One locally generated cosmic sky spans the shell and transparent knowledge scene.
- A familiar LifeAtlas rail, flat topic index and continuous dark reading sheet.
- Two named night palettes with native controls and explicit written states.
- Chinese sans host UI, serif comparison excerpts, outlined wordmark and local Space Grotesk inside knowledge.
- Real perspective 3D exploration with a readable detail panel and compact module toolbar.

## Colors

The normative palette is the final `src/cosmic-integration.css` cascade, imported last by `app/layout.tsx` after the inherited shell, growth, Uiverse and optional-module layers. Earlier light values in those files are historical fallbacks. Semantic names remain stable: `green` is the reading/selection accent; `forest` is the main action.

### Primary

Island uses pale blue actions and focus against midnight-blue surfaces. Observatory uses peach actions and focus against violet-charcoal surfaces. Main actions use the palette’s dark `accent-ink`; selected rail links retain white text. These are two color identities on the same layout, not additional skins.

### Secondary

The knowledge module retains its own pale cyan accent and categorical domain colors. Those identify knowledge domains and relationships rather than task completion or personal evaluation. Its local palette does not replace host semantic controls.

The nebula refinement is scoped to `public/knowledge-universe/nebula.css`, loaded after the embedded styles. Its label-detail, portal-label and hover tokens apply only to projected map labels; shader gas and stellar tints derive from the existing domain colors and do not add a host palette.

### Neutral

The shared ground is midnight dark. A translucent rail lets the same stars continue beneath navigation; reading sheets and detail panels use near-opaque night surfaces. Muted text, lines and wash remain distinct roles. Growth comparison periods now both use the active wash and keep written earlier/later labels. Fields have a darker fixed ground. Amber and red remain explicit pending/error treatments; Observatory inherits those status values from the root palette.

**The Textual State Rule.** Every consequential status has a written label; color is an additional cue.

## Typography

**Display and body font:** Microsoft YaHei, PingFang SC, system sans. **Comparison font:** self-hosted AtlasSerif, Noto Serif SC, serif. **Knowledge font:** local Space Grotesk under the internal Atlas family name, with the same OS Chinese fallbacks. **Wordmark:** outlined Alegreya lettering, independent of page typography.

Host module titles use the headline role; growth titles reduce to the mobile role at ≤640px, while other host page titles use 26px/1.6. Topic titles reduce to 18px/1.8. Editor headings are 23px/1.6, or 22px on small screens. Events use the event role, with line-height 2 on small screens. Ordinary record fields use 14px/1.95, rising to 15px/2 on small screens. Authored line breaks remain; reading fields generally cap at 70ch. Comparison excerpts retain the serif role. Editor controls increase to 16px at ≤640px. Supporting text is 11–13px; dates and time use tabular numerals.

The host knowledge-module heading is 22px, or 20px on phones. Inside the frame the embedded map heading uses the knowledge-heading role and the detail title is 25px/1.5 at weight 500. This scoped difference preserves the imported module’s character without changing the host font system.

Projected node labels use the knowledge-node-label role; the six domain labels use knowledge-domain-label, switching to knowledge-domain-label-mobile at ≤620px. Their small secondary lines remain 11px. These local roles describe nebula navigation, not reading-body typography.

## Layout

The desktop app rail remains fixed at 208px and the workspace retains that offset. Ordinary main content is capped at 1600px with 36px side padding. Only Settings retains its context/status topbar, with a 64px minimum height. Growth places a transparent 186px topic index beside a flexible continuous reading sheet, separated by 26px. The sheet uses its spacing token; dated records, versions and secondary tools stay in ruled sections and native disclosures.

At ≥1500px, main/utility side padding is 46px, topic index width is 208px, the gap is 32px and sheet padding is 30px 36px. At 1051–1200px, the index is 170px with a 20px gap and 26px main side padding. At ≤1050px, the rail becomes a horizontal top shell, the workspace offset clears and main side padding is 24px. At ≤820px, growth, Today and Settings stack into one column and navigation uses the actual visible destination count. At ≤640px, main padding is 20px 16px 36px, sheet padding uses the mobile token, paired forms and comparison stack, and navigation uses three columns for six visible entries or four for seven/eight. Knowledge is core: six core destinations plus two optional ones give six to eight visible routes.

Knowledge fills the available workspace rather than the ordinary content cap. Its host main uses 18px horizontal padding on desktop, 14px below the top-shell breakpoint and 8px on phones. A compact heading precedes a same-origin iframe with rounded border and transparent background. Desktop frame height is `calc(100dvh - 112px)` with 600px minimum; top-shell and phone layouts retain explicit 620px/650px minima for usable exploration. The embedded toolbar is 104px tall, 108px at ≤620px, with search, add, domain selector, routes, bookmarks and import/export. Duplicate module branding and sidebar are hidden. Universe overview collapses the reader so the nebula fills the map; selecting a node restores reading. The open detail reader sits beside the map on wider frames and becomes a bottom drawer at ≤620px, with a 50px reader launcher.

## Elevation & Depth

The shared procedural sky provides atmospheric depth, while dark reading surfaces, fine rules and restrained shadows keep text stable. Sheets use the current dark ambient shadow; dialogs use a stronger overlay shadow and dark backdrop. No white-paper sheet remains normative. The 3D knowledge map uses a perspective camera (47°) and alpha-enabled WebGL with a null scene background, allowing the parent sky to continue behind organic XYZ gas volumes, dense stellar fields, dark dust and semantic filament streams. Domain volumes and descendants occupy three dimensions; luminous stellar beacons identify selectable nodes, with invisible sphere meshes used only as hit targets. Depth attenuation, overlapping gas and stellar parallax supply volume rather than visible planets or orbital guides.

**The Continuous Sky Rule.** Use one body-level sky behind navigation and modules; the embedded knowledge renderer stays transparent rather than painting a second sky.

**The Index and Sheet Rule.** The topic index locates; the near-opaque sheet carries reading. Use dividers and disclosures inside the sheet rather than another stack of equal-weight cards.

The sky is produced locally by `src/cosmic-background.ts`: an offscreen four-octave fBm nebula, layered drifting stars, twinkle and sparse cross-shaped highlights. There is one fixed, pointer-transparent body canvas below the application. Active rendering caps at 24fps desktop and 20fps at widths below 640px, with an approximately 1.7-million-pixel bitmap cap. Editing, hidden documents and reduced-motion stop animation; disabling the existing dynamic preference retains a static star field. The embedded frame reports editing to the parent with source/origin validation. The independent 3D renderer caps near 30fps. No external media, paid API or cloud rendering is required.

## Shapes

Continuous sheets and dialogs retain the sheet radius; native buttons, fields and appearance selects retain the control radius. Rail selection uses the navigation radius; topic selection uses the control radius. Filters use 10px and comparisons 12px. At the top-shell breakpoint, app navigation retains its rounded tab silhouette. Knowledge uses irregular translucent gas, stellar beacons and curved point-stream filaments inside its map, compact rounded toolbar segments and a 14px iframe boundary, reduced to 10px on phones. Projected map labels use the local knowledge-label radius, transparent unbordered resting surfaces and a faint portal or hover wash. Their dark text shadow preserves legibility over luminous gas; the hover outline remains local to the map. These map shapes do not replace host control geometry.

## Components

### Wordmark

The original LifeAtlas outlined wordmark remains: true Alegreya italic 550 for “Life”, roman 500 for “Atlas”, matched cap heights, shared baseline and a 60-font-unit optical seam. `src/wordmark.ts` inherits rail ink through currentColor. Width remains 156px on desktop, 146px on the top shell and 138px at ≤640px. The existing Chinese subtitle is 12px and hides at the small-shell breakpoint. The home link retains “LifeAtlas · 生活全图，回到今日”. The source, standalone vector and SIL OFL provenance remain in `public/brand/`; no runtime font request is added.

### Buttons and fields

Main actions bind to `forest`, hover to `forest-deep` and use dark `accent-ink`. Subtle actions use the surface with a secondary border and hover to wash. The existing Uiverse-derived CTA layer expands from the right over 240ms; its arrow shifts 3px over 180ms. Other button, field, topic and segmented-state feedback uses 180ms. Shared actions and growth analysis entries retain 44px minimum height; growth fields retain native semantics and 46px minimum height. Fields now use the fixed dark field ground, palette ink and secondary border. Visible keyboard focus remains palette-bound, with inherited 3px growth offsets. Disabled controls remain disabled. Reduced motion suppresses transitions and animations. Pinned Uiverse source and MIT attribution remain documented in `docs/UIVERSE-DESIGN.md`.

### Navigation and reading

Core destinations are Today, Personal Growth / Environmental Awareness, Knowledge Universe, Mail, History and Settings. Investment and 人生丰富度 are independently optional. Active rail entries use the palette’s rail-active fill and white text; hidden optional entries leave no focusable gaps. The separate growth index and continuous reading sheet retain one reading anchor. Both analysis entries precede tabs; event and reflection lead comparison while secondary fields stay expandable. Explicit pending/error text remains mandatory.

### Knowledge universe

The same-origin `public/knowledge-universe/index.html?embedded=1` module retains six separate domains: stocks, psychology, philosophy, astronomy, mathematics and physics. Its 113 nodes, 218 total links, eight routes and maximum five-level hierarchy are content facts, not reusable layout tokens. Native toolbar controls expose domains, routes, bookmarks and backup import/export. Shader-rendered gas, dark dust, stellar beacons, projected labels and cross-domain filament streams share the transparent map; selecting a node restores the reader for long text, notes and relationship explanations. Existing local Space Grotesk and Chinese OS fonts remain scoped to this module. Module detail and behavior are recorded in `docs/KNOWLEDGE-UNIVERSE.md`.

TrackballControls support palm-like rotation with unrestricted roll, inertial settling, pan and zoom. Rotation speed is 2.1, zoom speed 1.1, pan speed 0.6 and damping 0.13. Manual interaction interrupts camera flight; automatic orbit waits 2800ms after release and runs only when the local toggle, global motion preference, editing state and reduced-motion setting permit it. Hidden documents stop the render loop. Gas breathing and stellar twinkle share the same motion gate; manual exploration remains available. The compact field uses fewer gas, star and filament points below 640px; the measured desktop overview's 19,002 field points are an implementation observation, not a density token.

### Appearance and live work

The native selector has exactly two choices: 光屿工作台 and 对页观察室. Appearance, dynamic sky and optional-module controls exist only in Settings → 外观与动态. Existing native checkbox semantics and saved preference migration remain. Switch knob movement uses 180ms; inherited Settings track-color feedback remains 150ms. The sky responds to the existing dynamic preference without deleting the static scene. Skin changes retain the view and live DOM. Original data stores, APIs and authentication boundaries are outside this visual integration and remain unchanged.

**The Live Task Rule.** Changing appearance preserves live input, focus, scroll and the current view by updating the document skin attribute.

## Do's and Don'ts

### Do

- Do use the active palette’s semantic CSS variables across all core and optional destinations.
- Do preserve the LifeAtlas wordmark, native control semantics, explicit saving, visible keyboard focus and reduced-motion behavior.
- Do keep topic lookup separate from continuous reading and secondary tools in native disclosures.
- Do keep the knowledge scene transparent over the shared sky and reading panels sufficiently opaque for long text.
- Do keep appearance and animation preferences exclusively in Settings → 外观与动态.
- Do distinguish fictional demonstrations and static knowledge content from real authored records.

### Don't

- Don't restore the superseded white-paper palettes, lake banner or horizontal Observatory desktop shell as current design authority.
- Don't add retired skins or duplicate brand/navigation chrome inside the embedded knowledge module.
- Don't remount the live route to change appearance.
- Don't put long reading text directly on the animated star field.
- Don't make editing, hidden-page or reduced-motion states keep animating the shared sky.
- Don't turn examples, scenery, counts or unimplemented analysis into personal data or capability claims.
