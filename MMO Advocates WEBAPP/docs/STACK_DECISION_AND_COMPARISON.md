# Stack decision and comparison

Date: 10 October 2026; authority reconciled 12 October 2026
Status: Laravel 13 React/Inertia with Blade public pages is implemented in the existing `backend/`. Local MySQL 8.4, Docker PHP 8.5.11/Composer 2.10.3, and native Node/npm are verified. Production hosting/database remain unverified. No production deployment, purchase, or remote repository action is authorized.

## Selected direction

Laravel with React/Inertia for interactive application modules; server-rendered Blade for public pages; Tailwind for a shared visual system. The official starter provides TypeScript and Tailwind 4. MySQL 8.4 is the verified local development database; the actual production database remains subject to hosting confirmation. No separate frontend service or standalone public API in the initial scope.

The earlier public-website-first tiering is superseded for the current engineering task: the user explicitly assigned backend implementation for database/migrations, authentication/reset, server authorization, roles, cases, follow-ups, dashboard data, user management, audit logging, integration and automated tests. The supplied PRD remains the V1 requirements source. Booking and client accounts/portal remain out of scope.

React/Inertia is part of the staff-application direction authorized for this backend task; public pages remain Blade-rendered. Use one Laravel application and avoid a separate frontend service. The current machine lacks host PHP/Composer, so the verified local development route is the approved Composer/PHP container rather than silently switching stacks.

## Livewire versus React/Inertia for MMO

| Dimension | Laravel + Livewire | Laravel + React/Inertia |
|---|---|---|
| Public marketing pages | Blade fits naturally | Blade still fits; no reason to make every page React |
| Staff tables/forms | Strong fit; server-managed component behavior | Strong fit; flexible client-side composition and state |
| Rich interactions | Suitable for many interactive workflows; complex client state needs deliberate JS integration | Better match for the user's preference for rich interfaces and future interactive modules |
| Coordination | PHP-centric team can keep most work in one ecosystem; component boundaries still need ownership | Clear backend/frontend boundaries; route props, validation and TypeScript contracts need coordination |
| Hosting | PHP/database plus compiled assets; no separate Node service required by baseline | Same baseline when Inertia SSR is not enabled; compiled React assets served with Laravel |
| Maintenance | Fewer language/tool boundaries for a PHP-focused maintainer | PHP plus React/TypeScript expertise; more frontend dependencies and state conventions |
| Booking/portal | Both feasible; complexity comes from business rules and access control | Both feasible; reusable React components useful for calendars, appointment workflows and client dashboards |
| Future live chat | Requires an explicit transport/provider, authorization and operations plan | Same; React does not supply a chat backend by itself |

Recommendation: React/Inertia is the selected fit because interface flexibility and future application modules matter to the user. Livewire is a valid simpler alternative, not inherently less professional. Avoid mixing Livewire and React to control the same screens without a concrete reason.

## How the baseline works

Public request -> Laravel route -> published content -> Blade HTML -> browser.
Staff/client module request -> Laravel auth/policies/controller -> Inertia page props -> React screen.
Mutations -> Laravel validation/authorization/service -> database transaction -> appropriate response.

One application deployment, one backend permission model. Blade and React share design tokens and approved assets, not confidential payloads. Inertia props sent to a browser are visible to that browser; never put secrets or unrestricted records there. React visibility checks do not replace Laravel policies.

## Separate frontend server and API, explained

A separate frontend service hosts a React/Next.js application independently. It may serve compiled static files, or execute server-side rendering and frontend-specific request handling. A static React frontend does not necessarily need a running Node process; a server-rendered Next.js deployment generally introduces its own runtime requirements.

An API backend exposes endpoints for data and business actions: authentication/account flows, authorized case queries, booking submission, updates and so on. The frontend communicates using an agreed request/response contract. The same API can also support a mobile app or external integrations if intentionally designed for them.

Benefits: independent frontend releases/scaling, clearer reusable API boundaries, support for multiple consumer apps and highly frontend-specific rendering needs.

Costs: two release pipelines and potentially two runtime services; API versioning; validation/error contract duplication; client state management; network failure handling; authentication/CSRF/CORS decisions; additional monitoring. Separate services may still share an origin behind a proxy, so CORS is not inevitably required. JWT is not inevitably required either. Database/business rules remain backend responsibilities.

For MMO, independent services are not needed merely to make the UI interactive. React/Inertia supplies that flexibility while retaining one deployment. Consider a separate API later only for a concrete mobile/integration or scaling requirement. It is possible to add bounded API endpoints to the Laravel app without rewriting the entire system.

## Future live chat and other modules

Yes, live chat, notifications, calendar integrations and document workflows can be added later. They are separately scoped, funded and reviewed—not guaranteed free plug-ins.

A simple staff-approved contact widget may be cheaper than custom chat, but external widgets introduce privacy/vendor/recurring-cost questions. Custom real-time chat may need a hosted realtime provider or a managed websocket service, persistent workers, message storage, staff availability, abuse controls and retention rules. An authenticated client conversation requires client-to-case access checks; public chat must not expose case information. Define response expectations and never present unattended chat as an emergency channel.

Future modules should reuse Laravel services/policies and the shared visual system. Add only the schema needed by the current module. Avoid speculative chat/payment/upload tables now. Upgrade deployment capacity and operational dependencies when evidence shows a need.

## AGENTS.md location and contents

Put the MMO-specific AGENTS.md at the project root:
C:\Users\AMREF\Projects\codex-test\MMO Advocates WEBAPP\AGENTS.md

The reported Git root is its parent, codex-test. Parent-wide instructions belong at that repository root only if they apply to every project there and edits are authorized. Do not initialize a nested Git repository. Verify live Git status before branches/worktrees.

All tools must be configured or prompted to read the project instructions; the filename alone is not a guarantee that every agent platform loads it automatically. An optional CLAUDE.md can point to AGENTS.md and contain tool-specific details. Avoid conflicting duplicate instruction documents.

Suggested contents:
1. Product goal and authorized V1 scope: public website and PRD staff case-management system; booking, client accounts, payments, uploads and reminders remain out of scope.
2. Selected stack, project layout and links to architecture/requirements/decision records.
3. Setup/build/test/lint commands after they exist and are verified; do not invent commands now.
4. File ownership, one integration owner, branch/worktree rules and shared contract change protocol.
5. Dependency/config/migration ownership; no competing lockfile edits.
6. Security boundaries: no secrets/real case data, server-side permissions, public/private separation.
7. Quality requirements: responsive/accessibility checks, independent authorization tests for private modules, no claims unsupported by test evidence.
8. Stop conditions: unclear requirements, conflicting instructions, unexpected concurrent edits or unsafe deployment assumptions.
9. Prohibited actions without separate authorization: deploy, purchase, send messages, change permissions, destructive migration or production data access.
10. Handoff format: changed files, contract revision, tests/results, gaps and dependencies.

This document describes AGENTS.md; it does not create executable agent instructions. The current user explicitly authorized the primary engineer to implement the PRD backend; delegation remains unrequested.

## Prior plans

This decision supersedes the Blade/minimal-Alpine-only recommendation in PROPOSED_ARCHITECTURE.md. The existing handoff plan remains a useful template, with frontend ownership under `backend/resources/js/`. The current implementation status and acceptance plan are in `PROJECT_STATE.md` and `IMPLEMENTATION_PLAN.md`; the primary engineer has explicit authorization to proceed within the supplied PRD.
