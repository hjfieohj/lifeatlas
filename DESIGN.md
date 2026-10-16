---
name: LifeAtlas Reimagined
description: Current visual system of the Chinese personal daily-brief and mail-triage prototype
colors:
  forest: "#173e35"
  forest-deep: "#12352e"
  green: "#2d6251"
  ink: "#253d34"
  muted: "#627268"
  paper: "#f6f5ef"
  surface: "#fffefb"
  line: "#dfe4da"
  wash: "#edf1e8"
  amber: "#805715"
  amber-bg: "#f6ecd5"
  red: "#923d32"
  red-bg: "#faebe7"
  focus: "#b47b28"
  primary-text: "#fffef7"
  primary-hover: "#295947"
  secondary-border: "#d5ded1"
  secondary-hover: "#e9eee4"
  danger-hover: "#f5dcd6"
  nav-text: "#ccdbcf"
  nav-active-bg: "#e7ecd9"
  nav-active-text: "#1a4436"
  nav-hover: "#254e41"
typography:
  display:
    fontFamily: "AtlasSerif, 'Noto Serif SC', serif"
    fontSize: "34px"
    fontWeight: 600
    lineHeight: 1.45
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "'Microsoft YaHei', 'PingFang SC', system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 600
    lineHeight: 1.65
  title:
    fontFamily: "'Microsoft YaHei', 'PingFang SC', system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 600
    lineHeight: 1.65
  body:
    fontFamily: "'Microsoft YaHei', 'PingFang SC', system-ui, sans-serif"
    fontSize: "14px"
    lineHeight: 1.65
  label:
    fontFamily: "'Microsoft YaHei', 'PingFang SC', system-ui, sans-serif"
    fontSize: "12px"
    fontWeight: 500
    lineHeight: 1.7
rounded:
  category: "4px"
  badge: "5px"
  field: "6px"
  control: "7px"
  toast: "8px"
  navigation: "9px"
  selection: "10px"
  mail-list: "12px"
  surface: "14px"
  dialog: "16px"
spacing:
  base: "8px"
  control-gap: "9px"
  action-gap: "12px"
  form-gap: "20px"
  section-gap: "24px"
  panel-inline: "28px"
  page-inline: "42px"
components:
  button-primary:
    backgroundColor: "{colors.forest}"
    textColor: "{colors.primary-text}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "10px 17px"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
  button-subtle:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "10px 17px"
  button-subtle-hover:
    backgroundColor: "{colors.secondary-hover}"
  button-danger:
    backgroundColor: "{colors.red-bg}"
    textColor: "{colors.red}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "10px 17px"
  button-danger-hover:
    backgroundColor: "{colors.danger-hover}"
  button-text:
    backgroundColor: "transparent"
    textColor: "{colors.green}"
    padding: "0"
  input-search:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "8px 11px"
    width: "220px"
  navigation-active:
    backgroundColor: "{colors.nav-active-bg}"
    textColor: "{colors.nav-active-text}"
    rounded: "{rounded.navigation}"
    padding: "12px 16px"
  status-awaiting:
    backgroundColor: "{colors.amber-bg}"
    textColor: "{colors.amber}"
    rounded: "{rounded.category}"
    padding: "4px 9px"
  task-receipt:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.surface}"
    padding: "25px 28px"
  selection-shelf:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.selection}"
    padding: "16px 20px"
  confirmation-dialog:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.dialog}"
    padding: "30px"
    width: "min(570px, calc(100% - 32px))"
---

# Design System: LifeAtlas Reimagined

## Overview

**Creative North Star: "Quiet daily workspace" (provisional description).**

This is an extraction of the implemented prototype, not a permanent brand approval. The developer-recommended direction combines a warm mineral background, a deep-green navigation shell, and warm-white working surfaces. Serif Chinese page titles give a calm reading entry; compact sans-serif rows support decisions. Green and amber retain tentative continuity with the product plan.

The first user is the owner. The interface makes suggestions, selection, confirmation and itemized results visibly distinct. Atmosphere language here describes the current build and remains provisional. Token values document the implementation; they do not authorize a broader rebrand. Source evidence: `src/style.css`, `src/main.ts`, the workspace `PRODUCT.md`, and `work/direction.md`, extracted on 2026-10-17.

Review evidence is limited: the finish reviewer returned **ship** for the two scored corrections, select-all disabled behavior and text contrast. An initial desktop screenshot and responsive DOM checks exist; the final mobile screenshot is invalid coverage. This document does not certify final mobile visuals, whole-surface accessibility, or fidelity to an approved comp.

**Key Characteristics:**
- Deep-green shell, warm-white work surfaces and ruled information rows.
- Serif page titles with compact, neutral sans-serif reading text.
- Explicit textual status, selection, confirmation and recovery affordances.
- Flat working surfaces; lifted confirmation and transient feedback.

## Colors

The palette uses forest greens for structure, soft warm neutrals for reading, and semantic amber/red pairs for states. Frontmatter is the normative color record; names below describe observed roles rather than user-approved brand terminology.

### Primary
- **Forest**: persistent navigation shell, primary action and feedback toast.
- **Green**: text actions, connection indicators, checkboxes and enabled switches.
- **Forest deep**: shadow tint source; not an additional action tier.

### Neutral
- **Ink / Muted**: main reading text / secondary provenance and supporting copy. The final footer override uses Muted; the old lighter footer colors are superseded.
- **Paper / Surface / Wash**: page ground / working containers / quiet icon and permission fills.
- **Line**: rules dividing brief entries, mail rows, settings and receipts.
- **Navigation text / active background / active text / hover**: distinct default, active and hover states in the green shell.

### Semantic States
- **Amber / Amber background**: demo notice, awaiting confirmation, uncertain and partial task status. Protected-mail chips also use a related amber fill; amber is not an exclusive confirmation color in the actual source.
- **Red / Red background**: destructive reset, errors and failed item results.
- **Focus**: keyboard outline across actionable controls, including switches.
- Literal per-category tints and low-emphasis support colors remain in the source; they are not promoted into new global accents here.

**The Textual State Rule.** Every consequential status has a written label; color is an additional cue.

## Typography

**Display Font:** locally hosted AtlasSerif with Noto Serif SC and generic serif fallback. The font face uses `/fonts/atlas-serif.woff2`, a variable weight range (400–700), and `font-display: swap`.

**Body Font:** Microsoft YaHei, PingFang SC, system-ui, sans-serif. No external font request is needed. Georgia appears in brief entry numerals and the brand fallback. These are implementation facts, not proof of full glyph coverage.

### Hierarchy
- **Display**: page title, reduced to (29px) at the small-screen breakpoint. Balanced wrapping and slightly tight tracking create the reading entry.
- **Headline / Title**: section headings and brief entry titles. Some contextual headings use (17px), (20px) or the display serif; do not flatten these into one arbitrary scale.
- **Body**: root reading defaults are in frontmatter. Most interface copy intentionally uses (11–13px), with brief paragraphs at line heights (1.9–1.95) and a lead width of (65ch).
- **Label**: buttons use the frontmatter role; provenance, counts and statuses commonly use (10–11px). Mobile auxiliary text reaches (9px); that is an observed limitation, not a recommendation for new screens.
- Tabular numerals align mail counts, brief indices and daily totals.

## Layout

Desktop uses a fixed navigation rail (230px), an offset workspace, a top bar (68px), and a main container capped at (1450px). Default page side padding is (42px). The daily view has a fluid primary column plus a narrow side column (263px), separated by (38px). Settings follows the same two-column family with a (250px) side column. Mail triage is a ruled list rather than a grid of independent cards.

The CSS defines an (8px) base variable but uses contextual spacing rather than a strict multiple-only scale. Preserve the source's deliberate page/panel/row hierarchy; do not claim a universal eight-point grid.

Responsive behavior is extracted from CSS, not visually certified: at (1500px) and above, daily-view spacing and side-column width increase; at (1150px) and below, the rail narrows to (194px), page padding becomes (28px), search fills the toolbar, and the decorative prepare stack disappears. At (860px) and below, the primary grids become one column and auxiliary sections use a two-column arrangement. At (640px) and below, navigation becomes an in-flow top row with stacked icon/text links, the workspace loses its offset, page side padding becomes (20px), and the selection shelf wraps near the viewport bottom. Receipt rows stack item detail beneath the subject. The final mobile navigation override uses equal-width links, a (4px) gap and (10px) labels.

## Elevation & Depth

Working panels are flat tonal surfaces with fine rules. Elevation is reserved for confirmation, transient feedback, the sticky selection shelf and the small prepare-stack illustration. There are no ambient gradients or image textures in this prototype.

### Shadow Vocabulary
- **Modal and toast** (`0 16px 48px rgba(18,53,46,.16)`): the shared shadow variable.
- **Selection shelf** (`0 6px 24px #173e3510`): separates a sticky action region from list content.
- **Prepare-stack middle layer** (`0 5px 14px #6a80531a`): a small static illustration layer, shifted left (7px).
- Dialog backdrop (`#102f2770`) uses (2px) blur. This treatment belongs to the modal layer rather than ordinary cards.

## Shapes

Small controls have gently curved corners; larger reading surfaces use the shared surface radius. Mail rows join into a list with only the outer top and bottom corners rounded. Chips are compact rounded rectangles, while connection markers and the profile avatar are circular. Stroke icons use a (24×24) viewBox, no fill, a (1.6) stroke, and round caps/joins; most render at (13–19px). Preserve those existing SVG paths rather than introducing an icon font.

## Components

### Buttons

Primary actions use Forest and warm-white text; secondary actions use a Surface fill and a thin green-gray border. The destructive variant uses the Red semantic pair. All three share compact label type, a minimum height (40px), a (9px) icon gap and a short background transition (0.15s). Text actions are unboxed Green and underline on hover; source actions are the smaller (11px) variation. Disabled buttons use opacity (0.45) and the unavailable cursor. Global keyboard focus is an outlined ring (3px) offset (4px).

### Inputs / Fields

Search uses an inline search icon, a narrow border and a transparent inner input. The inner input removes its outline; the current implementation does not provide a custom search-container focus-within ring, so do not claim otherwise. Settings inputs/selects have a field radius, a thin border, (9px 10px) padding and labels above them. Native checkboxes use Green accent color. Switches use a rounded track (36×21px), a white thumb (15px), checked translation (15px), explicit accessible labels and a focus outline on the track.

### Navigation

The persistent desktop rail carries four routes: 今日, 邮箱整理, 任务记录, 偏好设置. The active route has a pale filled shape, darker text and increased weight; hover lightens the forest shell. Active links carry `aria-current="page"`. Mobile moves the same navigation into document flow and hides the badge counts and profile area. Mail filters are separate text tabs with an active bottom rule.

### Chips and Task Status

Category and status labels stay compact and textual. Green-toned statuses indicate ordinary completion; amber covers pending/partial/unknown; red identifies failure. Category chips have distinct subscription, promotion, action and protected fills. They are informational spans, not buttons, and have no invented hover or focus response.

### Mail List and Selection Shelf

Each mail row aligns a native checkbox or lock mark, sender identity, subject, preview and category. A ruled reason line and source action sit below. Selection changes the row fill; subject activation expands details while keeping row identity stable. The sticky shelf displays current selection and a review action. Select-all is disabled outside the suggested tab and whenever there are no eligible current results; an empty selection disables review. The mobile shelf wraps, with a bottom offset (8px).

### Confirmation and Itemized Receipt

The signature is a staged action flow: inspect suggestions, explicitly select, review an itemized native dialog, authorize the local demonstration, then read a task receipt. The dialog has a scrollable list, explicit permission checkbox, cancel/confirm actions, and a bounded width/height. It uses native modal behavior; processing prevents cancellation. No snippet or token record implies that the style layer implements these behaviors by itself.

Receipts preserve subjects and show per-item results with recoverable actions. They use a flat Surface container with ruled item rows and a textual task status. Failed and unknown item details remain visible; unknown results offer reconciliation. This visual document covers local fictional-data UI, not production Gmail authorization.

### Feedback and Motion

Toasts fade and translate (0.2s) and remain visible for (4200ms). Hover backgrounds and switch states transition (0.15s); there is no entrance choreography. The reduced-motion query removes transitions/animations and resets smooth scrolling. Modal, toast, switch and shelf details are preserved in the sidecar because frontmatter cannot represent them fully.

## Do's and Don'ts

### Do:
- **Do** reuse the existing forest, warm-neutral and semantic state tokens.
- **Do** pair consequential color states with explicit labels and item-level results.
- **Do** preserve selection, review and confirmation as separate visible stages.
- **Do** retain keyboard focus, native control semantics and reduced-motion support.
- **Do** treat aesthetic interpretation as provisional and verify mobile visuals before claiming coverage.

### Don't:
- **Don't** present tentative green/amber continuity as a user-approved permanent brand.
- **Don't** turn the flat mail list into unrelated floating cards without a new design decision.
- **Don't** use color alone to distinguish protected, pending, failed or uncertain states.
- **Don't** infer working OAuth, live mail, scheduling or model processing from the prototype styling.
- **Don't** treat generated sidecar tonal ramps as production tokens or claim whole-surface approval from the two-fix verdict.
