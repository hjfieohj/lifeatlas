---
name: LifeAtlas Reimagined
description: Three selectable skins for a quiet Chinese personal workspace
colors:
  daylight-paper: '#eaf1f2'
  daylight-nav: '#f3f7f7'
  daylight-surface: '#fbfdfd'
  daylight-ink: '#233c46'
  daylight-muted: '#526873'
  daylight-line: '#ccdadf'
  daylight-wash: '#e1ecef'
  daylight-green: '#286b78'
  daylight-forest: '#286b78'
  daylight-forest-deep: '#205562'
  daylight-accent-ink: '#fff'
  daylight-nav-active-bg: '#dcebef'
  daylight-secondary-border: '#b4c7ce'
  daylight-focus: '#286b78'
  daylight-particle: '#387887'
  daylight-amber: '#785424'
  daylight-amber-bg: '#f1e8d7'
  daylight-red: '#943d38'
  daylight-red-bg: '#f8e7e4'
  orbit-paper: '#0a121e'
  orbit-nav: '#0d1725'
  orbit-surface: '#121f2d'
  orbit-ink: '#e5edf3'
  orbit-muted: '#a0afbf'
  orbit-line: '#293b4b'
  orbit-wash: '#1c303f'
  orbit-green: '#9ed8de'
  orbit-forest: '#9ed8de'
  orbit-forest-deep: '#b7e5e9'
  orbit-accent-ink: '#10262c'
  orbit-nav-active-bg: '#213d4a'
  orbit-secondary-border: '#526b7d'
  orbit-focus: '#9ed8de'
  orbit-particle: '#a8dce8'
  orbit-amber: '#e5c38e'
  orbit-amber-bg: '#3a3024'
  orbit-red: '#f2b1a7'
  orbit-red-bg: '#412d30'
  habitat-paper: '#242724'
  habitat-nav: '#282d29'
  habitat-surface: '#30362f'
  habitat-ink: '#eeeae0'
  habitat-muted: '#b4b6aa'
  habitat-line: '#4b5347'
  habitat-wash: '#3a4136'
  habitat-green: '#d4bd99'
  habitat-forest: '#d4bd99'
  habitat-forest-deep: '#ead3b1'
  habitat-accent-ink: '#292b24'
  habitat-nav-active-bg: '#454b3d'
  habitat-secondary-border: '#737966'
  habitat-focus: '#d4bd99'
  habitat-particle: '#d4bd99'
  habitat-amber: '#e4c390'
  habitat-amber-bg: '#453d2e'
  habitat-red: '#f2b5a9'
  habitat-red-bg: '#4b3430'
typography:
  display:
    fontFamily: AtlasSerif, 'Noto Serif SC', serif
    fontSize: 34px
    fontWeight: 600
    lineHeight: 1.45
    letterSpacing: -0.025em
  display-mobile:
    fontFamily: AtlasSerif, 'Noto Serif SC', serif
    fontSize: 29px
    fontWeight: 600
    lineHeight: 1.45
    letterSpacing: -0.025em
  growth-title:
    fontFamily: '''Microsoft YaHei'', ''PingFang SC'', system-ui, sans-serif'
    fontSize: 25px
    fontWeight: 600
    lineHeight: 1.65
  growth-year:
    fontFamily: AtlasSerif, serif
    fontSize: 24px
    fontWeight: 600
    lineHeight: 1.65
  growth-editor-title:
    fontFamily: '''Microsoft YaHei'', ''PingFang SC'', system-ui, sans-serif'
    fontSize: 23px
    fontWeight: 600
    lineHeight: 1.6
  headline:
    fontFamily: '''Microsoft YaHei'', ''PingFang SC'', system-ui, sans-serif'
    fontSize: 17px
    fontWeight: 600
    lineHeight: 1.65
  growth-reading:
    fontFamily: '''Microsoft YaHei'', ''PingFang SC'', system-ui, sans-serif'
    fontSize: 16px
    lineHeight: 2
  growth-baseline:
    fontFamily: '''Microsoft YaHei'', ''PingFang SC'', system-ui, sans-serif'
    fontSize: 15px
    lineHeight: 2
  body:
    fontFamily: '''Microsoft YaHei'', ''PingFang SC'', system-ui, sans-serif'
    fontSize: 14px
    lineHeight: 1.65
  label:
    fontFamily: '''Microsoft YaHei'', ''PingFang SC'', system-ui, sans-serif'
    fontSize: 13px
    fontWeight: 500
    lineHeight: 1.7
  auxiliary:
    fontFamily: '''Microsoft YaHei'', ''PingFang SC'', system-ui, sans-serif'
    fontSize: 12px
    lineHeight: 1.65
rounded:
  category: 4px
  badge: 5px
  field: 6px
  select: 7px
  control: 8px
  navigation: 9px
  selection: 10px
  mail-list: 12px
  surface: 14px
  dialog: 16px
spacing:
  base: 8px
  control-gap: 9px
  action-gap: 12px
  mobile-inline: 16px
  form-gap: 20px
  section-gap: 24px
  panel-inline: 28px
  growth-gap: 30px
  page-inline: 36px
components:
  button-primary:
    backgroundColor: '{colors.daylight-forest}'
    textColor: '{colors.daylight-accent-ink}'
    typography: '{typography.label}'
    rounded: '{rounded.control}'
    padding: 10px 17px
    height: 42px
  button-primary-hover:
    backgroundColor: '{colors.daylight-forest-deep}'
  button-subtle:
    backgroundColor: '{colors.daylight-surface}'
    textColor: '{colors.daylight-ink}'
    typography: '{typography.label}'
    rounded: '{rounded.control}'
    padding: 10px 17px
  button-danger:
    backgroundColor: '{colors.daylight-red-bg}'
    textColor: '{colors.daylight-red}'
    typography: '{typography.label}'
    rounded: '{rounded.control}'
    padding: 10px 17px
  input-search:
    backgroundColor: '{colors.daylight-surface}'
    textColor: '{colors.daylight-ink}'
    rounded: '{rounded.select}'
    padding: 8px 11px
    width: 220px
  navigation-active:
    backgroundColor: '{colors.daylight-nav-active-bg}'
    textColor: '{colors.daylight-green}'
    rounded: '{rounded.navigation}'
    padding: 12px
  status-awaiting:
    backgroundColor: '{colors.daylight-amber-bg}'
    textColor: '{colors.daylight-amber}'
    rounded: '{rounded.category}'
    padding: 4px 9px
  growth-reading-panel:
    backgroundColor: '{colors.daylight-surface}'
    textColor: '{colors.daylight-ink}'
    rounded: '{rounded.surface}'
    padding: 28px 32px
  confirmation-dialog:
    backgroundColor: '{colors.daylight-surface}'
    textColor: '{colors.daylight-ink}'
    rounded: '{rounded.dialog}'
    padding: 30px
    width: min(570px, calc(100% - 32px))
  input-field:
    backgroundColor: '{colors.daylight-surface}'
    textColor: '{colors.daylight-ink}'
    rounded: '{rounded.field}'
    padding: 10px 12px
---

# Design System: LifeAtlas Reimagined

## Overview

**Creative North Star: "A life space you can choose"**

The user approved three selectable visual worlds on 2026-10-17. Daylight (晨光 · 生活静室) is the default cool, airy reading room; Orbit (星夜 · 成长轨迹) pairs navy and cyan with a dated growth track; Habitat (石墨 · 生活舱) pairs graphite and sand with a horizontal shell on wide screens. This system supersedes the earlier forest default.

All skins share factual content, opaque reading panels, self-hosted serif titles, Chinese system text and existing outline icons. Appearance changes preserve the live task and unsaved input. Peripheral particles add a quiet atmosphere; their independent control and writing pauses keep reading and authorship central.

**Key Characteristics:**
- Three semantic palettes with Daylight as the default.
- Opaque reading surfaces, ruled records and explicit textual states.
- Shared serif titles, legible Chinese interface type and native controls.
- Switchable peripheral particles that pause during writing.

Extracted from `src/style.css` → `src/growth.css` → `src/skins.css` (the import order in `app/layout.tsx`), plus `src/appearance.ts` and `src/main.ts`. `PRODUCT.md` Brand Commitments and `.impeccable/surfaces/src-main-ts.md` record the accepted direction. Ignore `.impeccable/live` exploration state.

The independent reviewer returned **SHIP** for this skin work. Visual evidence covers the shared shell/settings in the actual approximately (718×550px) in-app browser: `.impeccable/review/skins-{daylight,orbit,habitat}-user.png`. Source/DOM checks cover the other routes. At CSS widths (390px) and (1440px), DOM checks found five visible navigation links and no horizontal overflow in all skins. Emulated mobile/wide screenshots were malformed and discarded; these checks do not certify mobile/wide visuals or whole-app accessibility. Reported validation: (33) tests, typecheck and build passed. No shipping assets were created; screenshots are review evidence.

## Colors

Frontmatter contains every hex palette primitive from the three root skin blocks. Prefixes identify the skin; the suffix matches its CSS custom property. Component token references show the default Daylight mapping; runtime components use semantic variables so Orbit and Habitat inherit their own palette.

### Primary
- **Daylight cool teal**: `green` and `forest` drive links, active navigation, checkboxes and primary actions; `forest-deep` is primary hover. White `accent-ink` keeps actions readable.
- **Orbit pale cyan**: the same roles on navy surfaces, with dark `accent-ink` for primary action text.
- **Habitat warm sand**: the same roles on graphite surfaces, with dark `accent-ink` for primary action text.
- `focus` follows each skin’s accent. `particle` is peripheral atmosphere, with opacity documented in the sidecar.

### Neutral
- `paper`, `nav`, `surface`: page ground, navigation shell and opaque working surface.
- `ink`, `muted`: reading text and supporting text. `line` separates rows; `wash` marks quiet inset or selected regions.
- `nav-active-bg` marks the active destination; `secondary-border` outlines controls and colors the unchecked switch track.

Amber/amber-background pairs signal pending, partial, uncertain and protected/promotion states; red/red-background pairs signal failure or destructive actions. These meanings remain shared across skins.

**The Textual State Rule.** Every consequential status has a written label; color is an additional cue.

## Typography

**Display Font:** self-hosted AtlasSerif (`/fonts/atlas-serif.woff2`, variable weights 400–700, `font-display: swap`), with Noto Serif SC and serif fallbacks. **Body Font:** Microsoft YaHei, PingFang SC, system-ui, sans-serif. Brand/brief numerals retain Georgia fallbacks; numeric counts and growth years use tabular numerals. No new font assets or external font requests were added.

Frontmatter records the shared hierarchy, including interface labels (13px), growth years (24px) and topic titles (25px). Page titles use the display/mobile-display roles. Section headings use the headline role, while brief titles and subjects use (15px). Growth prose uses the growth-reading role; baseline text uses growth-baseline. Forms retain contextual (14–15px) desktop text and (16px) growth-editor fields on small screens. On small screens, the more-specific inherited section-heading rule makes the topic heading (21px), overriding the skin’s (22px) declaration; editor titles retain (23px). Supporting labels use the auxiliary role. Some inherited category/status captions remain (9–11px); this is an observed limitation, not a new minimum-size recommendation. Brief leads cap at (65ch), growth prose at (70ch).

## Layout

Above (1050px), Daylight and Orbit use a fixed rail (206px) and offset workspace. Habitat uses an in-flow horizontal navigation bar at (1051px) and above, with no workspace offset. Shared main width is capped at (1420px); above (1199px), Daylight caps at (1350px) with extra reading space, and wide Habitat caps at (1320px). The header wraps appearance controls instead of clipping them.

At (1200px) and below, main side padding becomes (26px), growth gaps tighten and baseline/direction stack. At (1050px) and below, every skin uses in-flow horizontal navigation, no rail offset and a one-column growth layout. At (860px) and below, inherited daily/settings grids become one column. At (640px) and below, navigation is a five-column equal-width grid with visible icon/text links; main side padding becomes (16px), appearance controls get a full header row, growth topic links/forms/comparison stack, and reading/editor padding tightens. Keep the inherited daily-view expansion at (1500px); the skin layer determines the final shell. The spacing scale is contextual, not a strict eight-point grid.

## Elevation & Depth

Panels are opaque and flat; borders and tonal differences carry hierarchy. The selection shelf and small prepare-stack layers have no shadow after skin overrides. The shared skin-specific shadow is reserved for dialog/toast elevation (exact values in the sidecar). Dialog backdrop is dark with (2px) blur. Particles sit behind the app and never receive pointer events; they are not text backgrounds.

## Shapes

Use the extracted radius scale: restrained rounded controls, larger reading surfaces, and joined mail-list outer corners. Avatars, timeline dots and particles are circular. Existing SVG icons retain their (24×24) viewBox, no fill, (1.6px) stroke, and round caps/joins; reuse those paths rather than introducing an icon font.

## Components

### Buttons and fields

Primary buttons use `forest`/`accent-ink`, with `forest-deep` hover. Subtle buttons use `surface`, `ink` and `secondary-border`, then `wash` on hover. Danger uses the red semantic pair. Shared buttons retain (10px 17px) padding, a (9px) icon gap, label type and a minimum height (42px); growth actions retain the inherited (44px) minimum. Disabled buttons remain native and visibly dimmed. Search retains its inline icon, transparent inner input and (220px) default width, becoming full-width under the inherited toolbar breakpoint. Its inner input removes the outline; no custom search-container focus ring is implemented.

Settings fields use a thin semantic border and native labels. Global keyboard focus is a (3px) skin-accent outline, offset (4px); growth-specific controls use offset (3px). Native checkboxes use the skin accent. Existing switches retain a (36×21px) rounded track, white (15px) thumb, checked translation (15px), explicit labels and track focus outline.

### Navigation, chips and records

Five destinations remain available: 今日、邮箱整理、个人成长、任务记录、偏好设置. Active links carry `aria-current="page"`, accent text, a filled background and increased weight; hover uses `wash` and `ink`. Status/category chips stay textual informational spans, without invented hover behavior. Mail remains a ruled list, with selection/review/confirmation and itemized recovery kept distinct. Dialogs retain native modal semantics, a bounded width/height and a permission checkbox; styling alone does not implement these behaviors.

Growth uses a topic list plus a reading/writing area. Orbit adds a ruled timeline and small dated-entry dots without assigning scores. Habitat changes the wide shell; all skins preserve the same topic records, versions and comparison controls. The growth surface brief owns the reflection workflow; this document owns its shared visual system.

### Appearance and motion

The header and settings expose synchronized native skin selects and an independent particle checkbox. New/invalid preferences default to Daylight with particles enabled. `lifeatlas-appearance-v1` stores only `{version, skin, particles}` in browser localStorage; journal content stays in the server database. Appearance storage failure leaves the current session functional and displays a status message in settings. Cross-tab storage events synchronize preferences.

**The Live Task Rule.** Changing appearance must preserve live input, focus and scroll; update the document skin attribute instead of remounting the route.

The decorative layer contains (32) stable-position dots, with only (16) visible on small screens. Long alternating drifts pause while a text field/contenteditable has focus, while the tab is hidden, or when the system requests reduced motion. The checkbox independently hides the layer. Existing background/switch transitions are (0.15s), toast transitions (0.2s), and toast duration (4200ms); reduced motion disables transitions and animations. Exact animation/shadow values and standalone component specimens live in `.impeccable/design.json`.

## Do's and Don'ts

### Do:
- **Do** use the active skin’s semantic CSS variables across all five routes.
- **Do** pair consequential color states with explicit labels and item-level results.
- **Do** preserve selection, review, confirmation and recovery as distinct stages.
- **Do** retain native control semantics, keyboard focus and reduced-motion behavior.
- **Do** verify mobile and wide-screen visuals before claiming that coverage.

### Don't:
- **Don't** restore the superseded forest palette as the default.
- **Don't** use color alone for protected, pending, failed or uncertain states.
- **Don't** replace or remount the live form to change appearance.
- **Don't** put reading text on a transparent particle layer.
- **Don't** infer live Gmail access, AI processing or hosted deployment from the skin review.
