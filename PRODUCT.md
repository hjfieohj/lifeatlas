# LifeAtlas Reimagined

<!-- impeccable:product-schema 1 -->

## Platform
web

## Stack
Delegated by the user on 2026-10-17: TypeScript Web application. The initial browser-local Vite prototype is now hosted in the supplied Sites Vinext/Cloudflare server starter. Existing UI is preserved; Sites supplies app identity and D1 supplies encrypted connection persistence. Google OAuth configuration and real-account validation remain pending. Jobs and real write actions remain separate gated work.

## Users
The owner is the first real tester, reviewing a daily brief and organizing one personal Gmail account. Later recruitment is unvalidated.

## Product Purpose
Turn scattered information into reviewable actions and reduce everyday administrative burden. The primary loop is brief → email suggestions → explicit selection and confirmation → archive results → restore when needed.

## Operating Context
Chinese interface, responsive desktop-first web. Quiet daily use, not a feed for maximizing engagement. One personal mailbox; default scan scope 7 days / 100 inbox messages. Local prototype uses fictional, explicitly labeled mail only.

## Capabilities and Constraints
v0.1 scope: daily brief, protected mail, suggestions, confirmed archive, itemized results, recovery, history and preferences. These daily/archive actions remain demonstrative. An independent real Gmail readonly flow is implemented server-side; it is disabled until the owner configures Google credentials and encryption. No send, unsubscribe, trash, payment, travel booking, health or family permissions. No real model processing. Only readonly scope is requested; app reads remain bounded by server policy. Real email never enters demo localStorage.

## Brand Commitments
LifeAtlas Reimagined / 生活全图. Existing planning document uses deep green and warm amber; preserve those as a tentative continuity choice, not a user-approved permanent brand system. Plain Chinese, calm and concrete, no inflated claims.

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
