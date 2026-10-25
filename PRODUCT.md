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

2026-10-25: environmental awareness joins the growth loop. Each topic can maintain a dated description of family, colleagues/organization, locality, policy/social conditions, and customs/culture, plus supports, constraints, sources and uncertainty. Each experience may explicitly retain its own applicable environment and observed influence. Later environmental updates preserve prior snapshots. These are user-authored observations, without automatic collection or inferred regional traits; global cross-topic sharing remains outside this increment.
Chinese interface, responsive desktop-first web. Quiet daily use, not a feed for maximizing engagement. One personal mailbox; default scan scope 7 days / 100 inbox messages. Local prototype uses fictional, explicitly labeled mail only.

## Capabilities and Constraints
v0.1 scope: daily brief, protected mail, suggestions, confirmed archive, itemized results, recovery, history and preferences. These daily/archive actions remain demonstrative. An independent real Gmail readonly flow is implemented server-side; it is disabled until the owner configures Google credentials and encryption. No send, unsubscribe, trash, payment, travel booking, health or family permissions. No real model processing. Only readonly scope is requested; app reads remain bounded by server policy. Real email never enters demo localStorage.

Personal growth is an independent implemented extension: real user-authored topics and observations persist in D1 by Sites user ID without Google setup. Dates of occurrence and recording are distinct. Topic/moment edits retain text versions and use optimistic concurrency; archive is reversible. Timeline and version history paginate; topic JSON export includes archived records and versions. Cloud storage is stated explicitly; no journal content in localStorage, AI calls, automatic psychological inference, scoring, reminders or streaks. Storage is server-side, not end-to-end encrypted. A maximum of 100 topics per account includes archived topics; individual topics can carry ongoing records across years. Full account erasure and import remain later work.

## Brand Commitments

2026-10-19 growth refinement: explicit feedback-to-attempt links with server-validated frozen source versions; period reviews with selected, frozen record excerpts; owner-scoped keyword/date search across paginated history. Prior records retain empty context rather than inferred relationships. Recent attempt counts describe linked feedback only. Manual saving remains necessary; durable drafts and automatic conclusions are outside this increment. See docs/GROWTH-RESEARCH.md.
LifeAtlas Reimagined / 生活全图. On 2026-10-17 the owner rejected the earlier three-skin system, reviewed three full image concepts, and explicitly approved concepts 1 and 2 to replace all previous skins. 光屿工作台 / Island is the default: cool white/blue, a morning-lake header, vertical desktop navigation, chronological reading and a next-experiment sidebar. 对页观察室 / Observatory uses a charcoal horizontal desktop header, porcelain reading surfaces, warm/cool paired records and a lake vignette in the topic context. Approved composition references are .impeccable/mocks/approved/01-light-island.png and 02-facing-pages.png. All core copy/controls are semantic; imagined lake scenery is a separate generated decorative asset. Preserve actual records and capabilities; do not import mockup photos, personal categories, counts or AI interpretations. Plain Chinese, calm and concrete, no inflated claims. Particles remain subtle, independently switchable and paused during typing, hidden tabs or reduced-motion preferences.

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
