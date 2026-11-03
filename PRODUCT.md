# LifeAtlas Reimagined

2026-11-03 content addition: Politics & Capital is the seventh built-in knowledge domain, with six branches for political actors, capital owners, relationships, daily-life effects, psychology and study methods. The 42 new nodes have sources, examples, three routes and cross-domain links. Previous node IDs and personal saved state remain. Group-level psychological theories keep their evidence limits; no fixed personality, unverified individual motives or real-person profiles are asserted. See docs/POLITICS-CAPITAL.md. That content increment preserved its then-current visual system; the later Open Sky replacement is recorded below.

<!-- impeccable:product-schema 1 -->

## Platform

Current product authority · 2026-11-04: a Chinese, desktop-first personal Windows application with a loopback browser UI. The owner is the first real tester. `docs/DAILY-USE.md` and `docs/LOCAL-WORKSPACE.md` are the current daily-use and capability contracts; the records below the historical divider preserve earlier decisions rather than override it.

## Stack

The local package bundles Node.js 24.13.0, a static TypeScript UI and a loopback-only SQLite service. `local/application.ts` is the official installed shell, mounted by `local/entry.ts`; `local/workspace.ts`, `local/workspace.css` and `local/integrations.mjs` supply the daily modules and connections. Default `npm run dev` and `npm run build` use the complete local application. The local build rejects prototype controllers, including `src/main.ts`, and the local server does not expose the earlier hosted Gmail OAuth routes. Identity and records are local; the hosted Sites/Vinext/Cloudflare entry and its Gmail OAuth service remain in source as earlier implementation. Hosted D1 storage is not the installed program's storage.

## Users

A person who wants to connect daily tasks, experiences, environmental observations, knowledge, research and their own selected AI/mail services. No broader adoption, time-saved or customer-success claims have been validated.

## Product Purpose

Help the owner retain evidence, think and act with context. The growth loop remains experience → observation → reflection → experiment → observe again, preserving dated earlier words and uncertainty. The local workspace adds real record editing, knowledge import, source-attached AI assistance and readonly mail. AI helps begin an empty block or summarize and expand existing content in place. It does not infer a personal score or execute decisions for the owner.

## Operating Context

Core recording, saved knowledge and cached mail work locally without Codex. Investment/life records, tasks, growth history, uploaded originals/extracted text, mail caches and saved AI questions/references/results live in SQLite. Backups include these personal contents, excluding connection credentials. Program and personal data folders remain separate. Existing backup, restore, migration, version/conflict and growth-history boundaries remain in `docs/LOCAL-APP.md` and `docs/LOCAL-WORKSPACE.md`.

API keys and mail authorization codes are stored separately in an AES-256-GCM vault with a same-machine key; this is not end-to-end encryption or protection against compromise of the local account. Real data, keys, caches, exports and runtime configuration never belong in the public source repository.

## Capabilities and Constraints

- Today shows the owner's pending tasks and recent investment/life records. Growth remains its own preserved history and rule-support workflow; it is not automatically synthesized into the daily brief.
- Investment research and 人生丰富度 have local create/edit/date/category records, search, progressive 20-record lists, reversible recycle-bin removal and JSON export. Tasks add completion/status filters and recent operation records. Search and filtering preserve the editor; editing saved record B preserves new draft A and its source identity. Emptying the recycle bin deletes those records after confirmation; associated AI analyses remain in SQLite. Investment has no live prices, broker connection, portfolio engine or automatic trading.
- AI assistance belongs beneath the current growth/input block, five-layer environment group, investment/life/task record, knowledge note or extracted file, and opened mail text; it has no separate navigation destination. Empty content offers “引导我开始”; existing content offers “总结与扩展”. The expanded question and current-block references are editable, the endpoint/model are visible, and only the explicit “发送以上内容并…” action submits them to the owner's configured compatible `/chat/completions` endpoint or prepared local model. Other topics, mail and the knowledge library are not added automatically. Results remain inline, are marked as generated, and never overwrite authored text. Visible source surfaces restore their latest saved analysis; history loads in batches of 30, with earlier analyses available. All saved inputs, references, results, source fingerprints, model, endpoint and time remain in SQLite/backups. Settings retains legacy standalone analyses as history. Previewed requests bind the endpoint/model and require a fresh preview if another window changes the destination. AI and mail settings keep separate unsaved-form and revision guards: saving or removing one preserves the other, and late responses preserve newer typing. Credentials are excluded from automatic record drafts. The current preview is limited to 60000 reference characters with a visible truncation notice. There are no autonomous tools, disk/mail access by the model, vector retrieval, image input or Responses support.
- Gmail, 163 and QQ each support one configured account through TLS IMAP with application passwords/client authorization codes. Manual synchronization reads the latest 50 inbox headers; opening a message fetches and caches text. The list shows the latest 200 cached messages. There is no sending, deletion, archive or marking as read; cached bodies can be read offline. The earlier Gmail OAuth service remains in source, without a new OAuth setup wizard in this local flow. Protocol tests used local simulated services; no successful login to the owner's real account is claimed.
- Knowledge Universe keeps seven built-in domains and supports up to 24 custom nebulae and 500 custom nodes. Uploaded material can form an independent/new nebula or join an existing one, with actual file-outline/excerpt hierarchy. UTF-8 TXT/Markdown/JSON/CSV, extractable-text PDF and DOCX are supported; scanned PDF needs prior OCR. No automatic semantic relationship generation is claimed. Originals and text are local. Limits and distinct original-file/nebula deletion behavior are documented in `docs/LOCAL-WORKSPACE.md`.
- Growth retains explicit saving, immutable text revisions, dated environmental context, five nested scopes, frozen rule reports and feedback links. Field/group assistance and whole-topic/experience assistance remain attached to their sources; trajectory summaries state that they include only currently loaded records. Canonical topic/experience context permits saved and editing views to identify the same source; changed content is marked against the saved analysis. Pending, completed and failed requests remain observable across a view remount. The existing bounded rules remain distinct from this optional user-configured AI flow.
- Growth's five basic-environment entry buttons are visible before any topic: 个人、家庭、周围社会、地区文化（民间与政府）、国家与国际. Each opens the actual group. With no topic, clicking opens an unsaved environment form; explicit Save creates the topic with editable default title “我的基本环境”. With a selected topic, saving updates that topic and its revision history. This is not a separate global profile database. Switching groups in an open form retains input. Regional content has 民间生活与文化 and 政府与公共治理 subsections. The additive `country` field records 国家制度与公共政策 with applicable scope/time, source and observed personal effect. Stable `personal/family/social/regional/macro` layer IDs, older JSON with absent fields, saved revisions and source-attached AI identities remain compatible. No personal profiles or real-world policy conclusions are seeded.

New installations start without personal example topics or fictional records. Cleaning the owner’s specifically identified old test topics is an installation-specific backed-up upgrade action; the public package does not delete topics by guessed names. Record drafts are coalesced after a short input pause while the browser recovery journal updates immediately. Full backup waits for pending input synchronization. Internal state-recovery checkpoints retain at most one old state per minute per key, up to 16 states and 12MB per key; this does not prune formal growth revisions, AI history or full startup backups. State size is checked in UTF-8 bytes.

No automatic paid API invocation, paid plugin, cloud GPU or large-model download is added. Remote AI costs belong to the owner's configured provider and require explicit analysis submission; local parsing, rendering and model inference consume local compute, memory and disk. Saving connection settings does not perform synchronization or a model analysis.

## Brand Commitments

LifeAtlas / 生活全图 keeps plain Chinese, the outlined Alegreya LifeAtlas wordmark, native form semantics and written states. Empty real modules stay honest rather than being filled with fictional mail or records. Sources, uncertainty, earlier words and explicit saving remain visible.

On 2026-11-03 the user explicitly selected **Apple-inspired light, fluid controls and hierarchy for the UI**, with day blue sky/clouds and night particle stars. That authorized replacement supersedes the heavy dashboard/card aesthetic, previous reading-room tokens and unpresented seed 953eaba1 direction. On 2026-11-04 the user explicitly extended frosted glass across modules, superseding the earlier near-opaque-content-only rule while preserving the Apple-inspired geometry. Navigation, module panels and knowledge readers use adjustable white/charcoal glass; text stays fully opaque and fields retain their filled grounds. Blue primary capsules, quiet secondary actions, soft selected segments and Chinese system UI typography remain. This does not claim native macOS or a complete Liquid Glass implementation, and copies no Apple logo, SF font file or SF Symbols. Apple principles and the limited MIT Tabler button-alignment reuse are attributed in `docs/OPEN-SKY-UI.md`.

The two skins remain **深空 · 暗色** (`island`, default) and **晴空 · 亮色** (`observatory`); the stored identifiers stay compatible. The light skin retains locally rendered blue sky/clouds, the dark skin locally rendered particle stars. The knowledge 3D viewport keeps a deep-space ground in both skins; its surrounding toolbar, reader and library follow the skin and glass controls. Settings → 外观与动态 → 玻璃质感 exposes native keyboard-operable ranges for transparency 0–65% (default 36%) and blur 0–40px (default 20px), visible values, immediate preview and automatic local persistence. Reset changes only glass, retaining skin/particles. The existing `lifeatlas-appearance-v1` key and version-2 data remain compatible; missing glass values receive defaults. Surface CSS uses dynamic alpha (`1 - transparency / 100`), never container opacity. Live changes and cross-window/frame sync preserve inputs, notes and the mounted 3D graph. Reduced transparency forces alpha 1/blur 0 while retaining stored choices and explaining the override. Unsupported filtering uses the source .97-alpha near-solid fallback, including basic-environment entry buttons with distinct hover/selected cues. Dynamics can be stopped and pause during editing, backgrounding and reduced motion.

The user selected **Aurora Nebula / 极光星云** for the application icon: an original flowing mint/pearl/violet folded ribbon, open center and small guiding star on a midnight tile. `public/brand/lifeatlas-app-icon.svg` is the sole geometry source and `public/brand/app-icon-provenance.json` records its origin; the original outlined LifeAtlas wordmark remains separate. Asset-local colors do not change UI tokens. Current visual primitives are recorded together in `DESIGN.md` and `.impeccable/design.json`; local composition and evidence are in `.impeccable/surfaces/local-workspace-ts.md`, and the selected direction is in `.impeccable/surfaces/open-sky-ui.md`.

## Evidence on Hand

Current v0.6.0 evidence · 2026-11-04: eleven PNGs in `.impeccable/review/glass` and five in `.impeccable/review/growth-basics`, at 1450px desktop, 960px narrow and 390px phone widths. The documenter independently opened nine: glass `light-settings-desktop`, `dark-settings-narrow`, `light-controls-mobile`, `dark-controls-mobile`; basics `basics-dark-desktop`, `basics-dark-mobile`, `national-desktop`, `regional-government-desktop`, `regional-government-mobile`. These show the adjustable material/controls, empty-state entries and policy/government forms; screenshots alone do not prove persistence. All sixteen passed the review evidence gate after dark-controls-mobile was recaptured.

The supplied active-chat `work/glass-growth-tests.txt` records 97 passes; the parent reports successful typecheck/build. `work/glass-ui-qa.txt` and `work/growth-basics-ui-qa.txt` report keyboard/zero/max/reset, fresh-session persistence, cross-window/frame sync, retained drafts/graph, reduction handling, direct entries, explicit saving/reload and immutable history. `work/v060-draft-regression.txt` and `work/v060-inline-regression.txt` report passing existing draft and source-attached AI regressions. The inherited inline log phrase “screenshots captured” is not another evidence set. No real-provider calls occurred.

The initial scoped finish review returned **fix**: F1 was stale design/product documentation; F2 was the missing basic-environment-button solid fallback. This documentation pass addresses F1; the parent corrected F2 in `local/cupertino.css`, preserving hover ink and selected fill/edge. The final reviewer returned **ship**, with **F1 and F2 resolved**, limited to this fix list rather than a renewed whole-surface certification. All sixteen recaptures are valid, with no fix-batch regressions observed. The forced unsupported-filter branch passed with normal/hover .97 alpha and distinct selected/hover cues; this is simulated branch evidence, not exhaustive browser certification. The single glass detector output has 0 primary findings and 46 advisories against older tokens; basics has 0/0. Neither was rerun, and no warning-free or whole-product certification is claimed. Existing Platform prose schema drift remains unchanged. Installation and v0.6.0 public-release verification are separate pending parent work; the files here establish source/documentation and local-test scope only.

### Historical Open Sky evidence · 2026-11-03

The following fourteen-capture set and review verdict belong to v0.5.0; current glass/basic-environment evidence is above.

The current Open Sky evidence is fourteen full-page PNGs in `.impeccable/review/open-sky`, at 1450px desktop, 390px phone and 900px tablet widths. They cover dark Today, Growth, Investment, Mail and Knowledge desktop; dark Settings phone and Tasks tablet; light Today, Settings and Library desktop; and light Growth, Investment, Life and Mail phone. This documentation pass individually opened light Today desktop, dark Investment desktop, light Mail phone, dark Knowledge desktop and light Library desktop, plus the Aurora icon size sheet. It did not independently open every screenshot or repeat the interaction suites. The light Mail capture includes the distinct blue selected-row fill, inset edge and persistent “当前阅读” cue. In stitched full-page images the fixed sky renderer ends at the captured viewport; this is documented capture behavior, not a second content background design.

The parent reports 95 passing function tests and successful typecheck/build. The supplied `work/open-sky-ui-qa.txt`, `work/open-sky-draft-qa.txt` and `work/open-sky-inline-qa.txt` in the active chat workspace report passing isolated production flows, independent connection/draft guards and source-attached AI flows. The inline suite's inherited “screenshots captured” tail is not additional screenshot evidence; the fourteen Open Sky PNGs are the current set. These checks use local simulations and cached fixture mail with zero real-provider or owner-mailbox calls. No model-quality, real-account success or exhaustive keyboard/touch certification is claimed.

The initial independent Open Sky review returned **fix** for F1 (invisible light-mail selection) and F2 (stale design/icon documentation). F1 has been corrected in source and recaptured; this documentation replacement addresses F2. The follow-up reviewer returned **ship**, with F1 and F2 both **resolved**. That verdict scores those two fixes only, not a renewed whole-product certification. Prior `production`, `inline-ai` and `v020` screenshots, scoped review verdicts and counts are historical increments rather than the current replacement verdict.

The supplied single `work/open-sky-detect.json` has zero primary findings and 57 advisories measured against the older system. No detector rerun, warning-free claim or automatic acceptance of every advisory is made. Current tokens were extracted from the implemented final layers, not invented to suppress findings. Existing Platform prose schema drift is reported and left unchanged.

The icon evidence in the active chat's `work/icon-aurora` records ten decoded ICO sizes, transparent corners, and an extracted native EXE 32px frame that matches the ICO frame pixel for pixel. The documenter inspected the light/dark size sheet and read `icon-check.json` and `native-check.json`. This verifies the asset and native resource; Windows shortcut installation and release publication require separate checks of the installed BUILD-INFO/shortcut targets and the public GitHub release; they are not established by these asset files.

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

> Historical record: earlier scope and approvals are preserved below. Current local-runtime, capability and appearance authority is the 2026-11-04 record above and docs/LOCAL-WORKSPACE.md. Cloud storage, demo-only investment/life modules, one Gmail account, no model calls, white sheets and two night palettes describe dated increments, not the current local release.

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
