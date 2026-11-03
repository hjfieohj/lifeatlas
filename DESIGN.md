---
name: "LifeAtlas · Open Sky"
description: "Apple-inspired fluid controls and stable reading surfaces above blue-sky day and particle-star night backgrounds"
colors:
  island-paper: "#080c14"
  island-surface: "#20232cf5"
  island-ink: "#f2f3f7"
  island-muted: "#b1b5c2"
  island-line: "#ffffff17"
  island-wash: "#ffffff09"
  island-green: "#86b9ff"
  island-forest: "#0a67d7"
  island-forest-deep: "#0874ee"
  island-accent-ink: "#fff"
  island-rail-active: "#ffffff14"
  island-secondary-border: "#5b6070"
  island-focus: "#8dbbff"
  island-amber: "#f5ce8a"
  island-amber-bg: "#3d3325"
  island-red: "#ffaca9"
  island-red-bg: "#43292d"
  island-field: "#141720"
  island-control: "#ffffff10"
  island-control-hover: "#ffffff1c"
  island-selected: "#3c404d"
  island-glass: "#242833d9"
  island-mail-selection: "#303747"
  island-mail-selection-edge: "#637898"
  observatory-paper: "#d8eafb"
  observatory-surface: "#fffffff7"
  observatory-ink: "#20232b"
  observatory-muted: "#555f70"
  observatory-line: "#18243c18"
  observatory-wash: "#18243c05"
  observatory-green: "#0057bb"
  observatory-forest: "#0064d8"
  observatory-forest-deep: "#0059c2"
  observatory-accent-ink: "#fff"
  observatory-rail-active: "#ffffffbd"
  observatory-secondary-border: "#a6afbd"
  observatory-focus: "#0064d8"
  observatory-amber: "#79501a"
  observatory-amber-bg: "#fcf0da"
  observatory-red: "#b32b35"
  observatory-red-bg: "#fff0f0"
  observatory-field: "#f3f4f7"
  observatory-control: "#18243c08"
  observatory-control-hover: "#18243c10"
  observatory-selected: "#fff"
  observatory-glass: "#f3f6fbe6"
  observatory-mail-selection: "#e3efff"
  observatory-mail-selection-edge: "#b1cef3"
  knowledge-island-ground: "#20232cf7"
  knowledge-island-glass: "#242833ed"
  knowledge-observatory-glass: "#f3f6fbed"
  knowledge-map-glass: "#242833e6"
  knowledge-map-selected: "#464d5d"
typography:
  headline:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Microsoft YaHei', 'PingFang SC', sans-serif"
    fontSize: "32px"
    fontWeight: 650
    lineHeight: 1.4
    letterSpacing: "-.025em"
  headline-mobile:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Microsoft YaHei', 'PingFang SC', sans-serif"
    fontSize: "26px"
    fontWeight: 650
    lineHeight: 1.5
  today-headline:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Microsoft YaHei', 'PingFang SC', sans-serif"
    fontSize: "38px"
    fontWeight: 650
    lineHeight: 1.4
    letterSpacing: "-.03em"
  title:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Microsoft YaHei', 'PingFang SC', sans-serif"
    fontSize: "19px"
    fontWeight: 650
    lineHeight: 1.65
  record-title:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Microsoft YaHei', 'PingFang SC', sans-serif"
    fontSize: "17px"
    fontWeight: 600
    lineHeight: 1.7
  body:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Microsoft YaHei', 'PingFang SC', sans-serif"
    fontSize: "14px"
    lineHeight: 1.9
  event:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Microsoft YaHei', 'PingFang SC', sans-serif"
    fontSize: "16px"
    fontWeight: 500
    lineHeight: 1.95
  label:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Microsoft YaHei', 'PingFang SC', sans-serif"
    fontSize: "13px"
    fontWeight: 500
    lineHeight: 1.6
  supporting:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Microsoft YaHei', 'PingFang SC', sans-serif"
    fontSize: "11px"
  editor:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Microsoft YaHei', 'PingFang SC', sans-serif"
    fontSize: "14px"
    lineHeight: 1.65
  editor-mobile:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Microsoft YaHei', 'PingFang SC', sans-serif"
    fontSize: "16px"
    lineHeight: 1.65
  knowledge-summary:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Microsoft YaHei', 'PingFang SC', sans-serif"
    fontSize: "16px"
    lineHeight: 1.85
  library-title:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Microsoft YaHei', 'PingFang SC', sans-serif"
    fontSize: "24px"
    fontWeight: 650
    letterSpacing: "-.025em"
rounded:
  field: "11px"
  navigation: "12px"
  sheet: "16px"
  rail: "24px"
  dialog: "20px"
  capsule: "30px"
  segment: "24px"
spacing:
  control: "10px 18px"
  field: "11px 12px"
  list-sheet: "26px 28px"
  editor: "28px"
  growth-sheet: "28px 32px"
  dialog: "28px"
  mobile-sheet: "22px 20px"
  work-gap: "28px"
  mobile-gap: "22px"
components:
  button-primary-island:
    backgroundColor: "{colors.island-forest}"
    textColor: "{colors.island-accent-ink}"
    rounded: "{rounded.capsule}"
    padding: "{spacing.control}"
    typography: "{typography.label}"
  button-primary-island-hover:
    backgroundColor: "{colors.island-forest-deep}"
  button-primary-observatory:
    backgroundColor: "{colors.observatory-forest}"
    textColor: "{colors.observatory-accent-ink}"
    rounded: "{rounded.capsule}"
    padding: "{spacing.control}"
    typography: "{typography.label}"
  button-primary-observatory-hover:
    backgroundColor: "{colors.observatory-forest-deep}"
  button-subtle:
    backgroundColor: "{colors.island-control}"
    textColor: "{colors.island-ink}"
    rounded: "{rounded.capsule}"
    padding: "{spacing.control}"
    typography: "{typography.label}"
  input:
    backgroundColor: "{colors.island-field}"
    textColor: "{colors.island-ink}"
    rounded: "{rounded.field}"
    padding: "{spacing.field}"
    typography: "{typography.editor}"
  navigation-active:
    backgroundColor: "{colors.island-rail-active}"
    textColor: "{colors.island-ink}"
    rounded: "{rounded.navigation}"
    padding: "10px 13px"
  status-chip:
    backgroundColor: "{colors.island-glass}"
    textColor: "{colors.island-ink}"
    rounded: "{rounded.capsule}"
    padding: "8px 13px"
    typography: "{typography.supporting}"
  reading-sheet:
    backgroundColor: "{colors.island-surface}"
    textColor: "{colors.island-ink}"
    rounded: "{rounded.sheet}"
    padding: "{spacing.list-sheet}"
  segment-active:
    backgroundColor: "{colors.island-selected}"
    textColor: "{colors.island-ink}"
    rounded: "{rounded.segment}"
    padding: "8px 16px"
  inline-ai-trigger:
    backgroundColor: "{colors.island-control}"
    textColor: "{colors.island-green}"
    rounded: "22px"
    padding: "7px 13px"
  mail-selected-observatory:
    backgroundColor: "{colors.observatory-mail-selection}"
    textColor: "{colors.observatory-ink}"
    rounded: "10px"
    padding: "16px 10px"
  library-dialog:
    backgroundColor: "{colors.observatory-surface}"
    textColor: "{colors.observatory-ink}"
    rounded: "{rounded.dialog}"
    padding: "{spacing.dialog}"
---

# Design System: LifeAtlas · Open Sky

## Overview

**Creative North Star: "Open Sky / 留一点空间"**

LifeAtlas places the owner's writing, evidence and knowledge in a calm personal workspace. The user explicitly selected Apple-inspired visual hierarchy, fluid capsule controls and restrained translucent navigation on 2026-11-03. This replaces the earlier reading-room token system and the unpresented seed 953eaba1 direction. It describes the implemented local web UI, not native macOS or a complete Liquid Glass implementation.

Blue sky and clouds remain the light background; particle stars remain the dark background. Text lives on near-opaque white or charcoal reading surfaces, while navigation and tools use limited frosted material. The original outlined Alegreya LifeAtlas wordmark remains the identity anchor; the selected Aurora Nebula ribbon is the application icon. Geometry stays purposeful: a floating rail, continuous record lists, an independent growth index and a real 3D knowledge canvas.

**Key Characteristics:**
- Sky and stars surround stable reading surfaces.
- Blue primary capsules and quiet secondary actions carry a clear hierarchy.
- Chinese system UI type, drawn icons and native form controls stay familiar.
- Source-attached AI remains beside the owner’s content.

This is a scan-mode record of the shipped source layers: `local/cupertino.css` is imported last by `local/entry.ts`; `public/knowledge-universe/cupertino.css` is the corresponding final iframe layer. `PRODUCT.md` owns capability and service boundaries; `.impeccable/surfaces/open-sky-ui.md` owns the selected direction and `.impeccable/surfaces/local-workspace-ts.md` owns its local composition. Prior DESIGN.md values are superseded by this authorized visual-system replacement.

## Colors

The palette combines blue action color with neutral white/charcoal content and a locally rendered sky. Frontmatter is normative; its keys retain the CSS semantic names, including the historical `green` and `forest` names that now resolve to blue.

### Primary

- **Action Blue** (`island-forest` / `observatory-forest`): primary actions, with their respective `forest-deep` hover values and white `accent-ink` text.
- **Link Blue** (`island-green` / `observatory-green`): links, navigation icons and inline assistance; it is lighter in the dark skin.
- **Focus Blue** (`*-focus`): visible keyboard focus, with a broader transparent field halo.

### Secondary

- **Caution and Removal** (`*-amber`, `*-amber-bg`, `*-red`, `*-red-bg`): written caution/error and destructive states. These communicate state rather than a decorative accent.

### Neutral

- **Sky Ground** (`*-paper`): fallback behind the locally rendered background; `island` remains the default stored theme.
- **Reading White / Reading Charcoal** (`*-surface`): the stable document, list and editor ground. Knowledge has a slightly more opaque charcoal ground of its own.
- **Primary Ink / Supporting Ink** (`*-ink`, `*-muted`): authored text versus explanations and metadata.
- **Quiet Separator / Wash** (`*-line`, `*-wash`): subtle internal divisions and contextual excerpts.
- **Field / Control / Selected** (`*-field`, `*-control`, `*-control-hover`, `*-selected`): inputs, secondary actions and segmented selections.
- **Frosted Rail** (`*-glass`): translucent navigation/tools; the knowledge toolbar uses its scoped glass values.
- **Current Mail** (`*-mail-selection`, `*-mail-selection-edge`): distinct selected-row fill and inset edge. The persistent “当前阅读” label also identifies the opened message.

**The Sky Continuity Rule.** Retain day clouds and night stars around the workspace, and retain the deep-space knowledge viewport in both skins.

The Aurora Nebula icon palette is asset-local, defined in its SVG and provenance record, and does not redefine application theme tokens. The sidecar’s eight-step OKLCH ramps are synthesized panel previews from the source hues; they omit alpha and are not additional runtime theme values.

## Typography

**Display and Body Font:** the frontmatter system UI stack. Windows uses its installed Segoe UI / Microsoft YaHei fallback; no Apple font file is distributed. The user-pinned Apple-style UI makes system headings intentional for this world. The LifeAtlas wordmark is an outlined Alegreya asset, not the page display face.

**Character:** clear Chinese sans headings and native-feeling controls, with moderate weight contrast and generous prose leading. No invented eyebrow or kicker hierarchy is part of the system.

### Hierarchy

- **Headline:** `headline`; module headings. The compact phone form uses `headline-mobile`; Today has the larger `today-headline` role and shrinks to 31px on phones.
- **Title:** `title`; editor and section headings. Growth topic headings use 23px, shrinking to 21px on phones; the library uses `library-title`, shrinking to 22px.
- **Record title:** `record-title`; distinguishes a saved record without creating another card.
- **Body:** `body`; record prose stays within 72ch. Growth event text uses `event`; knowledge summaries use `knowledge-summary`.
- **Label:** `label`; primary/secondary controls. Supporting metadata uses `supporting`, kept subordinate to content.
- **Editor:** `editor`; ordinary fields. Phone fields use `editor-mobile` to keep native editing comfortable.

## Layout

Desktop navigation floats 16px from the viewport edges, is 218px wide and uses a 24px outer corner. The main workspace begins after a 250px left offset, caps ordinary content at 1480px and uses 48px top/bottom padding. Record lists and editors share an open two-column composition with a 28px gap and a 300–380px editor. Records are divided rows within one reading surface. Today uses a wider list and an offset starting panel; this is a Today composition, not a universal grid.

Growth keeps its own 184px topic index beside the continuous reading surface. Settings pairs main sections with a 230px anchored directory. Mail pairs a 300px cached list with its reader. Knowledge gives the 3D viewport the remaining space and layers the toolbar, reader, controls and internally scrolling library dialog around it.

At 1200px the rail narrows to 190px and the content spacing contracts. At 1000px navigation becomes an in-flow, four-column compact header and the workspace left margin disappears. At 760px record, settings and mail work areas stack; record editor asides lead their lists, while Today's start panel follows its content. Growth's topic index becomes a horizontally scrolling strip. At 480px main padding is 14px at the sides, fields grow to the phone editor role and primary controls have a 44px minimum height. Knowledge uses its own 620px compact-toolbar/dialog adaptation. These are observed layout breakpoints, not a device-detection policy.

## Elevation & Depth

Translucency distinguishes tools from reading, with soft ambient elevation rather than hard card outlines. Navigation uses blur and saturation; documents remain near-opaque. Record rows have no individual elevation. Full shadow, material and motion values live in `.impeccable/design.json`, which extends this frontmatter.

### Shadow Vocabulary

- **Rail ambient:** `shadow`; a soft 16px/48px spread of depth in both skins, tinted by its ground.
- **Reading elevation:** `work-elevation`; a quieter 10px/32px shadow under continuous work areas.
- **Pressed/selected controls:** primary actions use a small blue ambient shadow; selected segments use a shallow 2px/6px shadow. Current mail selection uses an inset edge rather than elevation.
- **Library dialog:** a soft 24px/70px shadow with a dimmed, blurred backdrop.

**The Stable Reading Rule.** Use frosted material for navigation and tools; keep authored text and form content on near-opaque reading surfaces.

Control transitions are short (150–160ms), with a restrained pressed scale. Reduced motion removes control transitions and existing background rules pause dynamics during editing, backgrounding and system reduction. Reduced transparency replaces supported frosted shell surfaces with reading ground.

## Shapes

Capsules define actions and segmented controls. Inputs use the `field` corner, navigation and contextual excerpts use `navigation`, continuous reading sheets use `sheet`, and the library dialog uses `dialog`. Outer rail corners are broader than internal fields. Borders appear where they explain selection, grouping or focus; ordinary record rows use separators rather than their own rounded frames. Preserve native date, select, checkbox, radio and disclosure affordances.

## Components

### Buttons

Soft, precise actions. Primary controls use Action Blue with white text, the `capsule` radius and `control` padding; hover uses the paired deeper blue, and press scales to .97. Main controls have a 42px minimum height on desktop and 44px on phones. Secondary controls use the transparent neutral control layer, with a stronger hover fill. Destructive controls use the red state pair. Disabled controls visibly reduce opacity and retain a written context. Focus remains visible.

### Chips and segments

The local-saving chip is a small frosted capsule, not a score or decorative badge. Growth tabs sit in a lightly filled capsule track and select a separate neutral segment. Map view controls remain dark over the deep-space canvas in both skins.

### Cards / Containers

Continuous reading areas carry the `sheet` corner and soft work elevation. The list uses `list-sheet` spacing; editors use `editor`; growth uses `growth-sheet`. At phone size, `mobile-sheet` spacing preserves the text column. Avoid a card around each record or every disclosure.

### Inputs / Fields

Quiet filled controls with a transparent resting border, the `field` corner and native input semantics. The focus border and halo must remain visible. Textareas resize vertically, and long content wraps. Metadata and connection hints remain written text beside the relevant form.

### Navigation

An inset frosted rail with drawn blue icons, readable Chinese labels, a neutral selected tile and a modest weight change. Hover uses a quiet control fill. Compact navigation has four columns; phone navigation places icon above label. The original LifeAtlas wordmark remains above it. Growth's independent topic index keeps its own selection state.

### Source-attached assistance

The trigger is a quiet capsule beneath the source, followed by editable question/reference preview, visible destination/model, explicit submission, written pending/error/result and generated-result provenance. Results use a restrained top rule and readable prose rather than a separate dashboard panel. History stays source-scoped; legacy standalone analysis is only history in Settings.

**The Source Stays Rule.** Keep AI guidance, previews and generated results beneath the source they concern; do not introduce a separate AI destination.

### Knowledge and library

Keep the 3D canvas dark, and theme its surrounding tools, reader and library. The library uses a broad softly rounded native dialog with internal scrolling; independent nebula creation, upload/preview and target choice remain distinct sections. Map controls use dark capsules so they stay legible on the canvas.

### Current mail

The opened row combines its theme-specific selected fill, an inset edge and the persistent Chinese “当前阅读” label. Preserve this cue in both themes, alongside the separate readable message body.

## Do's and Don'ts

### Do:

- **Do** retain the outlined LifeAtlas wordmark and the original Aurora Nebula icon as separate identity assets.
- **Do** use theme tokens for text, controls, focus and selection in both skins.
- **Do** keep record rows continuous with restrained separators and give the editor its own stable surface.
- **Do** preserve visible written saving, pending, error and selection states alongside color.
- **Do** preserve drafts and source-attached assistance when appearance changes.
- **Do** retain keyboard focus, native fields, reduced-motion and reduced-transparency behavior.

### Don't:

- **Don't** turn this workspace into a rigid grid of nested dashboard cards.
- **Don't** place long-form text directly on a blurred sky or starfield.
- **Don't** add a standalone AI module or overwrite authored text with generated results.
- **Don't** copy Apple logos, SF font files or SF Symbols, or claim native Apple materials.
- **Don't** use the icon's mint/violet gradients as a new global control palette.
- **Don't** claim installation, real-account connectivity or exhaustive interaction coverage from screenshots.
