# LifeAtlas Reimagined

2026-11-03 content addition: Politics & Capital is the seventh built-in knowledge domain, with six branches for political actors, capital owners, relationships, daily-life effects, psychology and study methods. The 42 new nodes have sources, examples, three routes and cross-domain links. Previous node IDs and personal saved state remain. Group-level psychological theories keep their evidence limits; no fixed personality, unverified individual motives or real-person profiles are asserted. See docs/POLITICS-CAPITAL.md. The existing visual system is unchanged.

<!-- impeccable:product-schema 1 -->

## Platform

Current product authority · 2026-11-03: a Chinese, desktop-first personal Windows application with a loopback browser UI. The owner is the first real tester. `docs/LOCAL-WORKSPACE.md` is the current direction and capability contract; the records below the historical divider preserve earlier decisions rather than override it.

## Stack

The local package bundles Node.js 24.13.0, a static TypeScript UI and a loopback-only SQLite service. `local/workspace.ts`, `local/workspace.css` and `local/integrations.mjs` extend the existing growth/knowledge application. Identity and records are local; the hosted Sites/Vinext/Cloudflare entry and its Gmail OAuth service remain in source as earlier implementation. Hosted D1 storage is not the installed program's storage.

## Users

A person who wants to connect daily tasks, experiences, environmental observations, knowledge, research and their own selected AI/mail services. No broader adoption, time-saved or customer-success claims have been validated.

## Product Purpose

Help the owner retain evidence, think and act with context. The growth loop remains experience → observation → reflection → experiment → observe again, preserving dated earlier words and uncertainty. The local workspace adds real record editing, knowledge import, source-attached AI assistance and readonly mail. AI helps begin an empty block or summarize and expand existing content in place. It does not infer a personal score or execute decisions for the owner.

## Operating Context

Core recording, saved knowledge and cached mail work locally without Codex. Investment/life records, tasks, growth history, uploaded originals/extracted text, mail caches and saved AI questions/references/results live in SQLite. Backups include these personal contents, excluding connection credentials. Program and personal data folders remain separate. Existing backup, restore, migration, version/conflict and growth-history boundaries remain in `docs/LOCAL-APP.md` and `docs/LOCAL-WORKSPACE.md`.

API keys and mail authorization codes are stored separately in an AES-256-GCM vault with a same-machine key; this is not end-to-end encryption or protection against compromise of the local account. Real data, keys, caches, exports and runtime configuration never belong in the public source repository.

## Capabilities and Constraints

- Today shows the owner's pending tasks and recent investment/life records. Growth remains its own preserved history and rule-support workflow; it is not automatically synthesized into the daily brief.
- Investment research and 人生丰富度 now have real local create/edit/delete/date/category records and JSON export. Investment has no live prices, broker connection, portfolio engine or automatic trading. Tasks can be completed/reopened and have recent operation records.
- AI assistance belongs beneath the current growth/input block, five-layer environment group, investment/life/task record, knowledge note or extracted file, and opened mail text; it has no separate navigation destination. Empty content offers “引导我开始”; existing content offers “总结与扩展”. The expanded question and current-block references are editable, the endpoint/model are visible, and only the explicit “发送以上内容并…” action submits them to the owner's configured compatible `/chat/completions` endpoint or prepared local model. Other topics, mail and the knowledge library are not added automatically. Results remain inline, are marked as generated, and never overwrite authored text. Each source scope shows its latest 30 analyses; all saved inputs, references, results, source fingerprints, model, endpoint and time remain in SQLite/backups. Settings retains legacy standalone analyses as history. The current preview is limited to 60000 reference characters with a visible truncation notice. There are no autonomous tools, disk/mail access by the model, vector retrieval, image input or Responses support.
- Gmail, 163 and QQ each support one configured account through TLS IMAP with application passwords/client authorization codes. Manual synchronization reads the latest 50 inbox headers; opening a message fetches and caches text. The list shows the latest 200 cached messages. There is no sending, deletion, archive or marking as read; cached bodies can be read offline. The earlier Gmail OAuth service remains in source, without a new OAuth setup wizard in this local flow. Protocol tests used local simulated services; no successful login to the owner's real account is claimed.
- Knowledge Universe keeps seven built-in domains and supports up to 24 custom nebulae and 500 custom nodes. Uploaded material can form an independent/new nebula or join an existing one, with actual file-outline/excerpt hierarchy. UTF-8 TXT/Markdown/JSON/CSV, extractable-text PDF and DOCX are supported; scanned PDF needs prior OCR. No automatic semantic relationship generation is claimed. Originals and text are local. Limits and distinct original-file/nebula deletion behavior are documented in `docs/LOCAL-WORKSPACE.md`.
- Growth retains explicit saving, immutable text revisions, dated environmental context, five nested scopes, frozen rule reports and feedback links. Field/group assistance and whole-topic/experience assistance remain attached to their sources; trajectory summaries state that they include only currently loaded records. Canonical topic/experience context permits saved and editing views to identify the same source; changed content is marked against the saved analysis. Pending, completed and failed requests remain observable across a view remount. The existing bounded rules remain distinct from this optional user-configured AI flow.

No automatic paid API invocation, paid plugin, cloud GPU or large-model download is added. Remote AI costs belong to the owner's configured provider and require explicit analysis submission; local parsing, rendering and model inference consume local compute, memory and disk. Saving connection settings does not perform synchronization or a model analysis.

## Brand Commitments

LifeAtlas / 生活全图 keeps plain Chinese, the outlined Alegreya LifeAtlas wordmark, established navigation and reading geometry, native controls and written states. Empty real modules stay honest rather than being filled with fictional mail or records. Sources, uncertainty, earlier words and explicit saving remain visible.

The user explicitly superseded the earlier two-night-palette commitment on 2026-11-03: **深空 · 暗色** (`island`, default) and **晴空 · 亮色** (`observatory`). The storage identifiers remain for preference compatibility. Dark uses locally rendered stars; light uses locally rendered blue sky/clouds, pale navigation and reading surfaces. The knowledge 3D viewport keeps a deep-space ground in the light skin, while its surrounding toolbar, reader and library management follow the light skin. Switching appearance changes the document attribute and retains current work/input. Dynamics can be stopped and pause during editing, backgrounding and reduced motion. Appearance controls remain in Settings → 外观与动态. Current tokens are in `DESIGN.md`; local composition is in `.impeccable/surfaces/local-workspace-ts.md`.

## Evidence on Hand

Current code and `docs/LOCAL-WORKSPACE.md`, plus eight recaptured images under `.impeccable/review/inline-ai`, cover investment and growth in both skins at 1450px desktop and 390px mobile. The documentation pass opened all eight and compared the inline AI/context/growth files, local workspace/integration service and knowledge hooks against the incumbent `DESIGN.md` and `.impeccable/design.json`. This is an ordinary local extension with no visual-system change; those files remain preserved. Their earlier standalone-AI, five-column navigation and six-domain composition prose is superseded by the current product/surface contracts. The current local phone navigation uses four columns after removal of the AI destination.

The owning task reports 89 passing unit tests, typecheck and local build, plus focused simulated checks of source titles/staleness and delayed results through save/remount. The reviewer returned **ship / pass limited to F1/F2**, with both reported resolved; this is not renewed whole-surface certification. The one supplied detector run found zero primary findings and three advisories: two fallback border colors and a preexisting 10px mobile detail label. No detector rerun or warning-free claim is made. The earlier nine-image `.impeccable/review/v020` set remains historical evidence of the prior local increment. All current captures use isolated test records and clearly identified local model simulations; no real API or owner mail account was used, and no provider quality or real-account success is established.

## Product Principles

- Preserve sources and distinguish authored records, model output, bounded rules and demonstrations.
- Preview outgoing content and require specific confirmation before an AI request.
- Make saving, failure, uncertainty, backup and recovery visible.
- Keep mail access readonly and manual; keep credentials separate from exported records.
- Favor a completed personal task over engagement, scores or streaks.

## Open Decisions

Actual owner mail/provider connectivity, chosen model and data terms, account/network policies, long-term retention preferences and broader user validation. Local simulations or screenshots do not silently certify these.

---

# Historical product record · through 2026-11-02

> Historical record: earlier scope and approvals are preserved below. Current local-runtime, capability and appearance authority is the 2026-11-03 record above and docs/LOCAL-WORKSPACE.md. Cloud storage, demo-only investment/life modules, one Gmail account, no model calls, white sheets and two night palettes describe dated increments, not the current local release.

## Platform
Windows personal local application, using a loopback web UI; the earlier hosted web entry remains in source for development history.

## Stack
Current owner decision, 2026-11-03: the whole app runs as a personal local PC program, with browser technology acceptable. The installed Windows package includes Node.js 24.13.0, a bundled static TypeScript UI and a loopback-only SQLite server. It reuses the Growth/Gmail services through a D1-compatible SQLite adapter, without React or a cloud framework at runtime. Stable local identity replaces online identity for personal records. The earlier Sites/Vinext/Cloudflare entry remains in source. Google OAuth configuration and real-account validation remain pending; actual online capabilities keep their existing boundaries.

## Users
The owner is the first real tester, reviewing a daily brief, organizing one personal Gmail account, and observing their personal growth over time. Later recruitment is unvalidated.

## Product Purpose
Turn scattered information into reviewable actions and reduce everyday administrative burden. The primary loop is brief → email suggestions → explicit selection and confirmation → archive results → restore when needed.

User addition on 2026-10-17: support a longitudinal personal-growth loop, experience → observe → reflect/summarize → experiment → observe again. A topic preserves the present situation and desired direction, repeated dated experiences, feedback on prior attempts, changing interpretations, and cross-year comparisons. Earlier words remain inspectable through immutable content revisions. Growth is understood by the user rather than assigned a score.

## Operating Context

2026-11-03 local ownership supersedes earlier hosted-storage statements for the installed PC program. Core use works without Codex or external network. Program and personal data are separate sibling folders; growth history and the four existing knowledge/demo/appearance/module storage keys persist in SQLite. Knowledge and preference changes use versions, idempotency, pending journals and conflict preservation; growth keeps explicit saving and existing version history. New browser sessions load saved disk values. The local settings section exposes save status, data folder, full backup, confirmed restore and draft export. Startup creates a consistent backup; restore checks the backup and protects the pre-restore data. Old growth database import backs up then copies without modifying the source; completed migration must be evidenced separately. Old file-origin knowledge notes require export from that old page and import in Knowledge; there is no cross-origin browser scan. Core runtime adds no paid API/model calls; local CPU/GPU, memory and disk are used. See docs/LOCAL-APP.md and .impeccable/surfaces/local-entry-ts.md.

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


2026-10-31 optional modules: Investment and 人生丰富度 have independent browser-local switches inside Settings → 外观与动态, next to appearance preferences. Default on; closed routes return to Settings without deleting records. Core destinations remain visible; navigation has 5–7 visible items and adapts its columns. The colorful-life heading carries the exact user motto “人的创造性是本质的，人的社会化是必然的。” and four initial content directions, with no recording feature yet. See docs/OPTIONAL-MODULES.md.


## 2026-11-02 confirmed integration

The user requested merging LifeAtlas with the offline3D knowledge universe and a global animated cosmic sky. Knowledge is a core navigation module; all existing routes, optional investment/life toggles, authentication boundaries and data stores remain. Six separate knowledge domains include mathematics and physics independently. The global sky is generated locally, spans navigation and the transparent same-origin knowledge frame, and pauses during editing, backgrounding or reduced-motion. No paid API, cloud GPU or OS startup registration. Reference: docs/KNOWLEDGE-UNIVERSE.md.
