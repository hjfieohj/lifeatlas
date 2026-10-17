---
name: LifeAtlas
description: Two approved reading spaces for a continuous personal practice
colors:
  island-paper: '#edf3ff'
  island-nav: '#f8faff'
  island-surface: '#fff'
  island-ink: '#182d54'
  island-muted: '#536b91'
  island-line: '#dce5f5'
  island-wash: '#edf3ff'
  island-green: '#315fd9'
  island-forest: '#315fd9'
  island-forest-deep: '#2449b0'
  island-accent-ink: '#fff'
  island-nav-active-bg: '#e5edff'
  island-secondary-border: '#b8c8e2'
  island-focus: '#315fd9'
  island-particle: '#7398d9'
  island-amber: '#8a5426'
  island-amber-bg: '#fff3e3'
  island-red: '#a33e42'
  island-red-bg: '#fff0f0'
  observatory-paper: '#edf2f6'
  observatory-nav: '#293d4d'
  observatory-surface: '#fff'
  observatory-ink: '#1d2d3b'
  observatory-muted: '#536779'
  observatory-line: '#dce4eb'
  observatory-wash: '#eff5fa'
  observatory-green: '#276486'
  observatory-forest: '#bc4e25'
  observatory-forest-deep: '#9b3f1c'
  observatory-accent-ink: '#fff'
  observatory-nav-active-bg: '#e5eff7'
  observatory-secondary-border: '#b6c8d7'
  observatory-focus: '#bc4e25'
  observatory-particle: '#7da9c7'
  observatory-amber: '#855326'
  observatory-amber-bg: '#fcf0e1'
  observatory-red: '#a33e42'
  observatory-red-bg: '#fff0f0'
  compare-cool: '#f1f7fb'
  compare-warm: '#fcf6ef'
  start-warm: '#fdf6eb'
  record-details: '#f5f8ff'
typography:
  display-island:
    fontFamily: '''Microsoft YaHei'', ''PingFang SC'', system-ui, sans-serif'
    fontSize: 34px
    fontWeight: 650
    lineHeight: 1.45
    letterSpacing: -0.025em
  display-observatory:
    fontFamily: AtlasSerif, 'Noto Serif SC', serif
    fontSize: 34px
    fontWeight: 600
    lineHeight: 1.45
    letterSpacing: -0.025em
  display-island-mobile:
    fontFamily: '''Microsoft YaHei'', ''PingFang SC'', system-ui, sans-serif'
    fontSize: 29px
    fontWeight: 650
    lineHeight: 1.45
  display-observatory-mobile:
    fontFamily: AtlasSerif, 'Noto Serif SC', serif
    fontSize: 27px
    fontWeight: 600
    lineHeight: 1.45
  topic-title:
    fontFamily: '''Microsoft YaHei'', ''PingFang SC'', system-ui, sans-serif'
    fontSize: 23px
    fontWeight: 600
    lineHeight: 1.65
  topic-title-observatory:
    fontFamily: AtlasSerif, 'Noto Serif SC', serif
    fontSize: 24px
    fontWeight: 600
    lineHeight: 1.65
  body:
    fontFamily: '''Microsoft YaHei'', ''PingFang SC'', system-ui, sans-serif'
    fontSize: 14px
    lineHeight: 1.65
  event:
    fontFamily: '''Microsoft YaHei'', ''PingFang SC'', system-ui, sans-serif'
    fontSize: 16px
    fontWeight: 500
    lineHeight: 1.95
  comparison:
    fontFamily: AtlasSerif, 'Noto Serif SC', serif
    fontSize: 19px
    lineHeight: 1.85
  label:
    fontFamily: '''Microsoft YaHei'', ''PingFang SC'', system-ui, sans-serif'
    fontSize: 13px
    lineHeight: 1.65
  editor:
    fontFamily: '''Microsoft YaHei'', ''PingFang SC'', system-ui, sans-serif'
    fontSize: 15px
    lineHeight: 1.9
rounded:
  input: 6px
  control: 8px
  button: 9px
  nav: 10px
  topic: 12px
  compare: 14px
  panel: 16px
spacing:
  control: 10px 17px
  panel: 26px 28px
  compare: 22px
  growth-gap: 22px
  topic-gap: 20px
  mobile-panel: 22px 18px
components:
  button-primary-island:
    backgroundColor: '{colors.island-forest}'
    textColor: '{colors.island-accent-ink}'
    rounded: '{rounded.button}'
    padding: '{spacing.control}'
    typography: '{typography.label}'
  button-primary-island-hover:
    backgroundColor: '{colors.island-forest-deep}'
  button-primary-observatory:
    backgroundColor: '{colors.observatory-forest}'
    textColor: '{colors.observatory-accent-ink}'
    rounded: '{rounded.button}'
    padding: '{spacing.control}'
    typography: '{typography.label}'
  button-primary-observatory-hover:
    backgroundColor: '{colors.observatory-forest-deep}'
  button-subtle:
    backgroundColor: '{colors.island-surface}'
    textColor: '{colors.island-ink}'
    rounded: '{rounded.button}'
    padding: '{spacing.control}'
  input:
    backgroundColor: '{colors.island-surface}'
    textColor: '{colors.island-ink}'
    rounded: '{rounded.input}'
    padding: 10px 12px
    typography: '{typography.editor}'
  navigation-active:
    backgroundColor: '{colors.island-nav-active-bg}'
    textColor: '{colors.island-green}'
    rounded: '{rounded.nav}'
    padding: 14px 15px
  status-awaiting:
    backgroundColor: '{colors.island-amber-bg}'
    textColor: '{colors.island-amber}'
    rounded: 4px
    padding: 4px 9px
  growth-reading-panel:
    backgroundColor: '{colors.island-surface}'
    textColor: '{colors.island-ink}'
    rounded: '{rounded.panel}'
    padding: '{spacing.panel}'
  comparison-cool:
    backgroundColor: '{colors.compare-cool}'
    rounded: '{rounded.compare}'
    padding: '{spacing.compare}'
  comparison-warm:
    backgroundColor: '{colors.compare-warm}'
    rounded: '{rounded.compare}'
    padding: '{spacing.compare}'
---

# Design System: LifeAtlas

## Overview

**Creative North Star: "光屿与对页"**

The two image directions approved on 2026-10-17 replace all previous skins. 光屿工作台 (Island) is the default blue and white morning-lake workspace, with vertical desktop navigation and continuous dated records beside the next experiment. 对页观察室 (Observatory) uses a charcoal desktop header, a topic context rail with a lake vignette, and warm/cool facing records. Both keep body text on opaque white surfaces.

The same factual records, native controls and five destinations serve both spaces. A skin change preserves the live view and unsaved input. Atmosphere supports reading and writing; it does not supply personal history or interpretation.

**Key Characteristics:**
- Two compositions, with Island as the default.
- Opaque reading panels and explicit textual states.
- Chinese system interface type, with serif Observatory titles and comparison text.
- Independent peripheral particles that pause during writing.

## Colors

The frontmatter records the final overrides in `src/skins.css`; names retain the implemented semantic variables (`green` means link/selection accent, `forest` means primary action). Island uses blue actions on a pale blue field. Observatory pairs cool links with warm rust actions and a charcoal navigation frame; it remains a light reading theme. Shared comparison panels place cool earlier and warm later periods side by side. Use active-skin variables, rather than baking the default palette into new screens.

**The Textual State Rule.** Every consequential status has a written label; color is an additional cue.

## Typography

Chinese interface text uses the system sans stack. Island headings retain that stack; Observatory headings and both skins’ comparison excerpts use self-hosted AtlasSerif with Noto Serif SC/serif fallbacks. The font file is `/fonts/atlas-serif.woff2` (400–700, swap). Topic titles are 23px in Island and 24px in Observatory; both become 21px at <=640px. Body is 14px; prominent events are 16px/1.95. Comparison excerpts are 19px/1.85, 18px at <=640px. Editor text is 15px/1.9 and 16px at <=640px. Longer record fields wrap and preserve authored newlines, with a 70ch maximum inherited from growth styles.

## Layout

Island has a 214px fixed desktop sidebar and a main area capped at 1500px. Growth uses `minmax(0,1fr) 255px`, a 22px gap, a spanning topic strip, and the next experiment alongside the record stream. At 1051–1250px its next-step column is 220px and the gap is 16px.

Observatory uses a 235px topic/context rail beside the reading surface; its next-step strip follows the content. At >=1200px the app navigation becomes a horizontal charcoal header and main is capped at 1560px. Between 1051 and 1199px it retains the vertical app sidebar. At <=1050px both shells become horizontal and growth becomes one column; Observatory moves context back into the topic introduction and hides the vignette. At <=640px navigation has five equal columns, heading sizes reduce, form pairs stack and main padding is 26px 16px 40px. The comparison remains paired above 560px and stacks at <=560px. Base non-growth spacious-layout adjustments remain at >=1500px.

## Elevation & Depth

Panels use the skin’s ambient shadow: Island `0 14px 44px #314a7320`, Observatory `0 14px 44px #29435516`. White reading surfaces stay opaque over the decorative lake and particles. The independently generated `/images/dawn-lake.webp` (52,390 bytes) is atmosphere, not a personal photo or a crop from the approved interface references. Its provenance sidecar accompanies the asset; the asset scan found one shipping raster and no missing provenance.

Particles are 32 stable 2–3px dots, opacity .4, drifting from (-18px,12px) to (22px,-25px) with independent 78–130s linear alternate periods and negative delays. At <=640px only the first 16 remain visible. The user can hide them; typing, a hidden document or reduced-motion preference pauses them, and reduced motion removes animation. Navigation has no transition. Buttons/switches retain 150ms transitions and toast uses 200ms; the global reduced-motion rule removes transitions and animations.

## Shapes

Reading panels and dialogs use 16px corners; comparison containers 14px, topic strip 12px, navigation 10px, buttons 9px, appearance selects 8px and growth inputs 6px. Borders and ruled records carry grouping. Wide Observatory navigation uses square corners and an active underline.

## Components

Primary actions use `--forest` / `--forest-deep` with `--accent-ink`; links use `--green`. Subtle actions use the white surface and secondary border; destructive and pending states use text plus red/amber treatments. Growth actions have a 44px minimum height; shared buttons use 42px. Focus uses a 3px skin-colored outline (4px offset globally; 3px inside growth). Disabled controls retain their disabled semantics.

The native appearance selector has exactly two options and synchronizes across the shell and settings. First mounting growth in Observatory opens comparison; changing skins later changes CSS only and retains the selected view. Comparison foregrounds event and reflection, while other record fields remain in native expandable details. No record field is deleted by this presentation.

**The Live Task Rule.** Changing appearance preserves live input, focus, scroll and the current view by updating the document skin attribute.

## Do's and Don'ts

### Do

- Do use the active skin’s semantic CSS variables across all five routes.
- Do lead comparison with event and reflection; keep observation, feedback and action in expandable details.
- Do preserve native control semantics, explicit saving, keyboard focus and reduced-motion behavior.
- Do identify fictional mail separately from real growth records.
- Do state the actual viewport and capture limits when reporting visual coverage.

### Don't

- Don't add retired skins to the selector or canonical palette.
- Don't remount the live route to change appearance.
- Don't put reading text on a transparent particle layer.
- Don't turn mockup photos, counts, categories or automatic analysis into personal data.
- Don't infer hosted deployment, live Gmail access or full mobile/desktop fidelity from this review.
