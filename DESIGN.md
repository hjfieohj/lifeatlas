---
name: "LifeAtlas"
description: "生活阅览室：one shared reading layout, two selectable palettes"
colors:
  island-paper: "#f0f3f9"
  island-nav: "#273c59"
  island-surface: "#fff"
  island-ink: "#273c59"
  island-muted: "#5f6f87"
  island-line: "#e0e6f0"
  island-wash: "#eef2f9"
  island-green: "#4b5db4"
  island-forest: "#4b5db4"
  island-forest-deep: "#3b4b98"
  island-nav-active-bg: "#e1e7f6"
  island-secondary-border: "#becadd"
  island-focus: "#4b5db4"
  island-accent-ink: "#fff"
  island-rail-active: "#40577b"
  island-rail-ink: "#e8edf7"
  island-particle: "#7398d9"
  island-amber: "#8a5426"
  island-amber-bg: "#fff3e3"
  island-red: "#a33e42"
  island-red-bg: "#fff0f0"
  observatory-paper: "#edf2f6"
  observatory-nav: "#293d4d"
  observatory-surface: "#fff"
  observatory-ink: "#1d2d3b"
  observatory-muted: "#536779"
  observatory-line: "#dce4eb"
  observatory-wash: "#eff5fa"
  observatory-green: "#276486"
  observatory-forest: "#a34726"
  observatory-forest-deep: "#84371d"
  observatory-nav-active-bg: "#e5eff7"
  observatory-secondary-border: "#b6c8d7"
  observatory-focus: "#a34726"
  observatory-accent-ink: "#fff"
  observatory-rail-active: "#415b6b"
  observatory-rail-ink: "#e3ebf2"
  observatory-particle: "#7da9c7"
  observatory-amber: "#855326"
  observatory-amber-bg: "#fcf0e1"
  observatory-red: "#a33e42"
  observatory-red-bg: "#fff0f0"
  compare-warm: "#faf4ec"
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
rounded:
  control: "12px"
  navigation: "9px"
  filter: "10px"
  comparison: "12px"
  sheet: "14px"
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
    backgroundColor: "{colors.island-surface}"
    textColor: "{colors.island-ink}"
    rounded: "{rounded.control}"
    padding: "11px 12px"
    typography: "{typography.editor}"
  navigation-active:
    backgroundColor: "{colors.island-rail-active}"
    textColor: "{colors.island-accent-ink}"
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
    backgroundColor: "{colors.compare-warm}"
    rounded: "{rounded.comparison}"
    padding: "{spacing.comparison}"
---

# Design System: LifeAtlas

## Overview

**Creative North Star: "生活阅览室"**

生活阅览室 is the user-selected replacement visual world, adopted on 2026-10-30. A deep blue navigation rail, an independent topic index and a continuous white reading sheet give locating, reading and acting distinct places. This shared layout now serves both 光屿工作台 (Island, default) and 对页观察室 (Observatory); their selectable color identities remain.

The same authored records, native controls and six destinations serve both palettes. Quiet hierarchy and progressive disclosure reduce nested card framing while keeping versions, uncertainty and sources findable. A skin change preserves live work; atmosphere does not supply personal history or interpretation.

**Key Characteristics:**

- One shared reading-room layout with two selectable palettes.
- A flat topic index beside an opaque, continuous reading sheet.
- Chinese sans titles and controls; serif comparison excerpts and an outlined literary wordmark.
- Independent particles with the existing pause and preference behavior.

## Colors

The frontmatter records the effective cascade: `src/style.css`, `src/growth.css`, `src/skins.css`, `src/growth-presentation.css`, `src/reading-room.css`, `src/guidance-integration.css`, then `src/uiverse-system.css`. The reading-room layer owns the shared shell and reading geometry; Uiverse is the final component layer. Implemented semantic names remain stable: `green` is the reading/selection accent; `forest` is the main action.

### Primary

Island uses restrained indigo for actions, topic selection and focus on a cool blue ground. Observatory keeps cool blue reading links and rust actions/focus inside its blue-charcoal frame.

### Neutral

Both palettes use white reading sheets, their own ink/muted/line/wash roles, light rail text and a darker active-rail fill. Warm comparison background distinguishes the later period; the earlier period uses the active palette’s wash. Amber and red remain written pending/error states. Existing particle colors remain inherited from the skins.

**The Textual State Rule.** Every consequential status has a written label; color is an additional cue.

## Typography

Chinese interface titles and controls use the system sans stack in both palettes. Observatory no longer uses serif page/topic headings. The existing self-hosted AtlasSerif remains for comparison excerpts. The brand is a dedicated SVG wordmark, described below; it adds no runtime font request.

Module titles use the headline role; the growth title reduces to the mobile role at <=640px, while other page titles use 26px/1.6. Topic titles reduce to 18px/1.8. Editor headings are 23px/1.6 (22px on small screens). Events use 16px/1.95, with 2 line-height on small screens. Ordinary record fields use 14px/1.95, rising to 15px/2 on small screens; authored line breaks are preserved and reading fields generally cap at 70ch. Comparison excerpts retain serif at 18px/1.95; environment and detail fields use ordinary sans. Editor controls use 15px/1.85, increasing to 16px at <=640px. Supporting text uses 11–13px with generous line-height. Dates and time use tabular numerals.

## Layout

Both palettes have the same fixed desktop app rail (208px) and workspace offset. Only Settings retains the context/status utility bar, with a 64px minimum height; main content is capped at 1600px with 36px side padding. Growth places a 186px topic index beside a flexible reading sheet with a 26px gap. The topic index is transparent and borderless; recent attempts continue beneath it. The sheet uses the sheet spacing token; a divided tool panel presents the two analysis entries above segmented tabs and dated records. Starting point, management, storage and filters expand on demand.

At >=1500px, main/utility side padding is 46px, topic index is 208px with a 32px gap, and sheet padding is 30px 36px. At 1051–1200px the topic index is 170px with a 20px gap and main side padding is 26px. At <=1050px the app rail becomes a horizontal top shell, the workspace offset clears, main side padding becomes 24px, and the topic index remains 170px with a 22px gap.

At <=820px the six app destinations occupy equal columns, growth becomes one column, topic choices scroll only inside their own region, and recent attempts follow the sheet. Today and Settings also become one column. At <=640px main padding is 20px 16px 36px, the sheet uses mobile-sheet spacing, the two analysis entries and comparison stack, paired forms stack, and appearance remains available in Settings while the topbar controls hide. These are shared breakpoints, not palette-specific layouts.

## Elevation & Depth

The reading sheet has one quiet ambient shadow per palette, recorded in the sidecar. Internal records use real dividers and native disclosures without extra elevation; comparison periods use tonal fields. Dialogs have a stronger overlay shadow. Reading surfaces remain opaque above the existing particle renderer.

**The Index and Sheet Rule.** The topic index locates; the white sheet carries reading. Use dividers and disclosures inside the sheet rather than another stack of equal-weight cards.

The particle implementation is unchanged by this redesign. It retains the shared scene behind workspace/navigation, independent on/off control, local pointer response, and stop rules for typing, hidden documents and reduced motion. Existing caps remain 30fps desktop / 24fps at <=640px and a two-million-pixel main bitmap. The previous lake image remains an existing repository asset with provenance; the reading-room shell hides its scene banner and does not require new imagery. No new visual assets or paid services were used.

## Shapes

Sheets and dialogs use the sheet radius; buttons, text fields and appearance selects use the control radius. Desktop app selections use the navigation radius; topic selections use the control radius. Filters and environment inset areas use 10px, comparison periods use 12px. At <=1050px app navigation becomes a tab silhouette with rounded top corners; <=820px keeps all five entries equally available. Records inside the white sheet are flat ruled sections.

## Components

### Wordmark

LifeAtlas uses a single outlined lettering asset: true Alegreya italic 550 for “Life”, roman 500 for “Atlas”, with matched cap heights, a shared baseline and a 60-font-unit optical seam. This supplies a gentle, lived-in rhythm while the upright second half retains formality. No swash, artificial skew or pictorial ornament is added. The inline `src/wordmark.ts` asset inherits the rail ink through `currentColor`; its viewBox includes the italic descender and edge padding. Width is 156px on the desktop rail, 146px on the top shell and 138px at <=640px, with intrinsic height reserved. The Chinese subtitle remains 12px on desktop and hides at the existing small-shell breakpoint. The home link retains the full text name “LifeAtlas · 生活全图，回到今日”.

The standalone vector, SIL OFL 1.1 license and source hashes live in `public/brand/`. `scripts/build-wordmark.py` reproduces both SVG outputs from the documented free source fonts. The full source fonts are not shipped. This is a narrow brand-lettering refinement; page type, layout, palettes and particles retain their existing authority.

### Buttons and fields

Main actions bind to `forest` and hover to `forest-deep`, with white accent text. Their Uiverse-derived background expands from the right over 240ms; an existing arrow shifts 3px over 180ms. Button color, border and pressed feedback use 180ms, with `cubic-bezier(.2,.8,.2,1)` for transforms and the expanding layer. Subtle actions use the surface and secondary border, hovering to wash. Shared actions and both growth analysis actions have a 44px minimum height. Growth editor fields retain native semantics and a 46px minimum height; their borders and focus feedback use 180ms. Visible keyboard focus remains palette-bound; inherited growth topic/content controls retain a 3px offset. Disabled states remain explicitly disabled. App navigation has no transition; topic and segmented-view state colors use 180ms. Reduced motion suppresses CSS transitions and animations.

The coordinated component update was adopted on 2026-10-31. The CTA and switch derive from the pinned Uiverse Galaxy sources; fields, segmented views, topic selection and the growth tool panel are LifeAtlas companion designs. Source revision and modifications are recorded in `docs/UIVERSE-DESIGN.md`; the full MIT notice is in `public/licenses/Uiverse-Galaxy-MIT.txt`. Both palettes, wordmark and particles remain.

### Navigation, topics and reading

The six destinations are Today, Personal Growth / Environmental Awareness, Mail, History and Settings. The active app entry uses rail-active with white text; topic selection uses the active palette’s semantic colors. The separate index and white sheet share one anchor. Both analysis entries stay visible before the tabs; records and their versions remain available through existing controls. Comparison presents event and reflection first; secondary content stays expandable. Pending status uses explicit text with amber; failure uses text with red.

### Appearance and live work

The native selector still has exactly two choices: 光屿工作台 and 对页观察室. Particle controls retain native checkboxes; their track color and knob movement use 180ms. Existing Settings switches use 180ms knob movement; their track color retains the inherited 150ms transition. Appearance controls exist only in Settings, at all screen sizes; no duplicate controls are inserted into the shell. First growth mount in Observatory still opens the existing comparison view, while subsequent skin changes preserve the current view and DOM. Existing preference migration and particle behavior remain in `appearance.ts`.

**The Live Task Rule.** Changing appearance preserves live input, focus, scroll and the current view by updating the document skin attribute.

## Do's and Don'ts

### Do

- Do use the active palette’s semantic CSS variables across all six destinations.
- Do keep topic lookup separate from continuous reading and secondary tools in native disclosures.
- Do lead comparison with event and reflection; keep observation, feedback and action in expandable details.
- Do preserve native control semantics, explicit saving, visible keyboard focus and reduced-motion behavior.
- Do distinguish fictional demonstrations from real authored records and report the actual viewport limits of visual review.

### Don't

- Don't restore the superseded horizontal Observatory desktop shell or lake banner as the current layout authority.
- Don't add retired skins to the selector or canonical palette.
- Don't remount the live route to change appearance.
- Don't put reading text on a transparent particle layer.
- Don't turn examples, scenery, counts or unimplemented analysis into personal data or capability claims.


2026-10-31 appearance placement: skin and particle controls are available only in Settings → 外观与动态. Other modules render no top utility bar; the Settings header retains its context/status without duplicate appearance controls. Existing saved appearance still applies throughout the app.


2026-10-31 investment placeholder: six primary destinations now include 投资 immediately after Growth, before Mail. The #investment route contains a static international-market planning surface for funds/ETFs, bonds and stocks; no market data, portfolio persistence or trading. It inherits the reading-room palettes and controls. Phone navigation uses six equal columns. Planned scope is in docs/INVESTMENT-PLAN.md.
