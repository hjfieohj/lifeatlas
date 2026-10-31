# LifeAtlas Reimagined

<!-- impeccable:product-schema 1 -->

## Platform
web

## Stack
Delegated by the user on 2026-10-17: TypeScript Web application. The initial browser-local Vite prototype is now hosted in the supplied Sites Vinext/Cloudflare server starter. Existing UI is preserved; Sites supplies app identity and D1 supplies encrypted connection persistence. Google OAuth configuration and real-account validation remain pending. Jobs and real write actions remain separate gated work.

## Users
The owner is the first real tester, reviewing a daily brief, organizing one personal Gmail account, and observing their personal growth over time. Later recruitment is unvalidated.

## Product Purpose
Turn scattered information into reviewable actions and reduce everyday administrative burden. The primary loop is brief → email suggestions → explicit selection and confirmation → archive results → restore when needed.

User addition on 2026-10-17: support a longitudinal personal-growth loop, experience → observe → reflect/summarize → experiment → observe again. A topic preserves the present situation and desired direction, repeated dated experiences, feedback on prior attempts, changing interpretations, and cross-year comparisons. Earlier words remain inspectable through immutable content revisions. Growth is understood by the user rather than assigned a score.

## Operating Context

2026-10-31 approved integrated analysis: four questions connect self and subjects, interacting characteristics and impacts, feasible action space, and revised understanding after actual outcomes. Up to six user-authored subjects and six explicit cross-layer relationships retain facts, interpretation, observed versus possible impact, and source uncertainty. Dated topic-environment excerpts can seed a draft without replacing existing entries. Reports are current v3, recomputed server-side and frozen; v1/v2 remain unchanged. This is still bounded rule support with no model calls or source verification. See docs/ENVIRONMENT-INTEGRATED-ANALYSIS.md.

2026-10-29 follow-up: the module is named “个人成长 / 环境感知” and is the first destination after Today. The user replaced the flat environmental list with five nested scopes: individual; family; immediate social settings; locality/institutions/region; macroeconomy/external conditions. Occupation, academic major and industry connect to explicit impact paths and sources. Regional governance, influential economic actors and geopolitical observations are user-authored with uncertainty, not automated allegations or forecasts. Guidance v2 preserves v1 snapshots and offers conditional verification/resilience choices without blanket investment or location-risk conclusions. The canonical source repository is now public at hjfieohj/lifeatlas; project changes must be committed and pushed there. See docs/ENVIRONMENT-LAYERS.md and AGENTS.md.

2026-10-29: two explicit environmental-awareness purposes. “环境分析与成长” covers personal stage/strengths, locality/opportunity, family, school, neighborhood/relationships, work, society/culture, and living/information conditions. “帮我看清局面” accepts a concrete concern without a full profile and offers reasons, uncertainty and conditional preferred/alternative/compromise/pause choices. The current bounded educational rule engine makes no LLM calls or validated psychological assessments. Unknown safety, dependency and threats change feasible options. Reports are recomputed server-side, frozen with input and choice, then linked to feedback through the existing growth loop. No personality diagnosis or socioeconomic ranking. See docs/ENVIRONMENT-SUPPORT.md.

2026-10-25: environmental awareness joins the growth loop. Each topic can maintain a dated description of family, colleagues/organization, locality, policy/social conditions, and customs/culture, plus supports, constraints, sources and uncertainty. Each experience may explicitly retain its own applicable environment and observed influence. Later environmental updates preserve prior snapshots. These are user-authored observations, without automatic collection or inferred regional traits; global cross-topic sharing remains outside this increment.
Chinese interface, responsive desktop-first web. Quiet daily use, not a feed for maximizing engagement. One personal mailbox; default scan scope 7 days / 100 inbox messages. Local prototype uses fictional, explicitly labeled mail only.

## Capabilities and Constraints
v0.1 scope: daily brief, protected mail, suggestions, confirmed archive, itemized results, recovery, history and preferences. These daily/archive actions remain demonstrative. An independent real Gmail readonly flow is implemented server-side; it is disabled until the owner configures Google credentials and encryption. No send, unsubscribe, trash, payment, travel booking, health or family permissions. No real model processing. Only readonly scope is requested; app reads remain bounded by server policy. Real email never enters demo localStorage.

Personal growth is an independent implemented extension: real user-authored topics and observations persist in D1 by Sites user ID without Google setup. Dates of occurrence and recording are distinct. Topic/moment edits retain text versions and use optimistic concurrency; archive is reversible. Timeline and version history paginate; topic JSON export includes archived records and versions. Cloud storage is stated explicitly; no journal content in localStorage, AI calls, automatic psychological inference, scoring, reminders or streaks. Storage is server-side, not end-to-end encrypted. A maximum of 100 topics per account includes archived topics; individual topics can carry ongoing records across years. Full account erasure and import remain later work.

## Brand Commitments

2026-10-30 wordmark refinement: the owner asked for LifeAtlas lettering with everyday warmth, artistry, formality and comfort. Only the wordmark changes: true italic “Life” and upright “Atlas” from the same openly licensed Alegreya family, optically spaced and shipped as SVG outlines. The text home-link name, existing Chinese subtitle behavior, two palettes, page typography and particles remain. No new runtime font download or paid service.

2026-10-19 growth refinement: explicit feedback-to-attempt links with server-validated frozen source versions; period reviews with selected, frozen record excerpts; owner-scoped keyword/date search across paginated history. Prior records retain empty context rather than inferred relationships. Recent attempt counts describe linked feedback only. Manual saving remains necessary; durable drafts and automatic conclusions are outside this increment. See docs/GROWTH-RESEARCH.md.
LifeAtlas Reimagined / 生活全图. Plain Chinese, calm and concrete, with actual records and capabilities kept distinct from fictional demonstrations. Preserve sources, uncertainty, earlier words and explicit saving; do not turn examples, counts or scenery into personal history or claim automatic interpretation.

2026-10-30 current visual commitment: the owner selected “生活阅览室” as a replacement layout. 光屿工作台 / Island remains the default palette and 对页观察室 / Observatory remains selectable; both now share a deep blue desktop app rail, an independent topic index and a continuous white reading sheet. Chinese sans titles and controls, restrained indigo selection, warm/cool comparison excerpts and native disclosures support quiet reading without nested card framing. Observatory keeps blue-charcoal and rust color roles, not its former horizontal desktop shell. Appearance changes preserve the current view and live draft. Existing particles remain independently switchable and pause during typing, hidden documents or reduced-motion preferences. No new images, fonts, data model, analysis capability or paid service is part of this redesign.

Historical visual approval: on 2026-10-17 the owner replaced the original three skins with concepts 1 and 2. Their lake banner, horizontal Observatory navigation and distinct composition references in .impeccable/mocks/approved/01-light-island.png and 02-facing-pages.png are superseded by the 2026-10-30 reading-room direction. The two palette names, existing decorative asset provenance and particle renderer are retained. Current tokens and responsive geometry are recorded in DESIGN.md and .impeccable/design.json; the selected surface contract is .impeccable/surfaces/src-growth-ts.md.

## Evidence on Hand
Google Docs product plan v1.1, approved as a starting baseline. User confirms no existing code or prototype. Official Gmail scopes and modify endpoint reviewed on 2026-10-17. No customer quotes, time-saved claims, pricing evidence, or live account verification.

## Product Principles
- Prepare proactively, execute only the specific confirmed operation.
- Preserve sources and distinguish facts, suggestions and demonstrations.
- Make failures, uncertainty and recovery visible.
- Keep protected mail out of bulk actions.
- Favor a completed daily task over more screen time.

## Open Decisions
Real OAuth project and test account configuration, data retention, model provider/data terms, deployment for real mail, notifications and budget. Do not silently treat prototype storage as production persistence.


2026-10-31 Uiverse component integration: the approved reading-room layout now uses a coordinated 12px control radius, expanding CTA background, accessible track switches, segmented views, and a divided growth tool panel. Both palettes, wordmark and particles remain. Sources, pinned revision and MIT attribution are recorded in docs/UIVERSE-DESIGN.md; src/uiverse-system.css is the final component layer.


2026-10-31 appearance placement: skin and particle controls are available only in Settings → 外观与动态. Other modules render no top utility bar; the Settings header retains its context/status without duplicate appearance controls. Existing saved appearance still applies throughout the app.


2026-10-31 investment placeholder: six primary destinations now include 投资 immediately after Growth, before Mail. The #investment route contains a static international-market planning surface for funds/ETFs, bonds and stocks; no market data, portfolio persistence or trading. It inherits the reading-room palettes and controls. Phone navigation uses six equal columns. Planned scope is in docs/INVESTMENT-PLAN.md.


2026-10-31 optional modules: Investment and 人生丰富多彩 have independent browser-local switches inside Settings → 外观与动态, next to appearance preferences. Default on; closed routes return to Settings without deleting records. Core destinations remain visible; navigation has 5–7 visible items and adapts its columns. The colorful-life heading carries the exact user motto “人的创造性是本质的，人的社会化是必然的。” and four initial content directions, with no recording feature yet. See docs/OPTIONAL-MODULES.md.
