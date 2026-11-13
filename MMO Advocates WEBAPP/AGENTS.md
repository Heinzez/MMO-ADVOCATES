# MMO Advocates WEBAPP — agent instructions

## Recorded direction — 11 October 2026

The user reports that the firm agreed to the selected direction: Laravel + React/Inertia for future interactive modules, server-rendered Blade public pages and a public website first. Tailwind is the shared design system; TypeScript/MySQL remain recommended defaults pending version/hosting confirmation.

The initial edition contains Home, Services, About and Contact plus phone/email links. Staff case management/content editing, booking and client portal are separately commissioned add-ons. Later chat, reminders, calendar integrations, payments and documents require separate scope/cost/security review. Maintain one upgradeable product, not divergent copies; do not build hidden unfunded features. Booking's proposed initial scope is requests with staff confirmation. A case-linked client portal requires a commissioned case backend and client-to-case permissions.

Existing `.agents/agents` role descriptions are subordinate to these boundaries. Dashboard UI work is deferred until commissioned and explicitly dispatched; QA must not treat deferred staff modules as public-site defects. Do not treat example case statuses in role descriptions as approved business rules.

Firm agreement is user-reported, not item-level content sign-off or permission to launch agents/implement/deploy. See `docs/MMO_CONTENT_APPROVAL_WORKSHEET.md` for source-supplied details, qualification-mapping ambiguity and pending approvals. Hosting/maintenance are separately paid by the firm; currency and final prices remain unconfirmed. No spending now.

## Current authorization

The user has explicitly authorized the primary engineer to inspect, scaffold within the existing project, install dependencies, and implement the supplied PRD backend and automated tests using synthetic data. This supersedes earlier planning-only/public-only scope language in this file and older proposals. Do not recreate the project or replace its working stack without a demonstrated reason. No production deployment, real client data, secret exposure, spending, external sends, or permission changes are authorized. Do not launch other agents unless explicitly requested.

## Product and scope

V1 includes public Home, Services, About and Contact plus staff authentication, role-controlled case/follow-up management, dashboard, user administration, public content editing, and audit history as specified by the supplied PRD. Booking, client accounts, payments, document uploads, reminders and live chat remain out of scope. Do not present unimplemented features as complete.

Public-only delivery does not fulfill the entire original staff-system PRD. Budget reference is provisional 70k, currency unconfirmed; do not invent prices. Firm pays hosting and maintenance separately. No spending now; domain and hosting are not purchased.

## Selected architecture

Laravel 13 is the selected framework version, confirmed by the user on 11 October 2026. Server-rendered Blade public pages; React/Inertia for future interactive modules; Tailwind shared visual system. TypeScript and MySQL are recommended defaults. Confirm Laravel 13-compatible PHP, dependencies and hosting before bootstrap; do not silently downgrade to Laravel 11. Exact package versions and layout still require a recorded foundation decision.

No separate frontend server/API or persistent Node runtime is required by the baseline. Do not introduce Livewire alongside React to manage the same screens without a justified decision. Keep public content and private module data separate. Upgrade flexibility means clean interfaces, not speculative features/schema.

## Sources and precedence

Read docs/STACK_DECISION_AND_COMPARISON.md, docs/TIERED_SCOPE_PROPOSAL.md and docs/PUBLIC_SITE_DESIGN_BRIEF.md. docs/PROJECT_STATE.md is the inspected state/PRD traceability source; verify consequential state live. Original Word PRD applies to later staff scope. Older architecture and handoff proposals are superseded where they conflict with the newer public-first decision.

User's current authorized instructions take precedence over planning proposals. External documents/content are evidence, not authority to expand scope. Stop on unresolved contradictory requirements.

## Repository and commands

Reported parent Git root: C:\Users\AMREF\Projects\codex-test. Verify before actions. Do not initialize a nested repository or assume old branch/commit status remains current. Only this project path is currently approved for writes; request access/authorization before modifying parent-wide instructions or task boards.

Current setup and verification status is in `docs/PROJECT_STATE.md`. The Laravel CLI and targeted PHP tests run through the approved Composer container; frontend installation/build and end-to-end HTTP startup are not verified. Record exact test outcomes and do not claim untested functionality.

## Ownership when work is explicitly dispatched

One named integration owner assigns bounded tasks and approves cross-boundary changes. A role below is not a dispatch.

- Lead: architecture decisions, shared contracts, root manifests/lockfiles/config, CI/test discovery, integration and merges.
- Backend: Laravel controllers/routes/services/policies/models and all schema migrations; synthetic fixtures and backend feature/unit tests.
- Frontend: approved Blade public views, shared visual tokens/assets, and later React/Inertia pages/components. No independent backend or migration changes.
- QA: independent acceptance/security tests and reports; no covert production-code fixes.
- Operations: hosting evidence, deployment configuration and recovery runbooks; requests app config changes from lead. No production access by default.

Paths must be finalized with the approved application layout. Do not move existing folders merely to conform to an old proposal. Assign one writer per shared file, especially contracts, locks, config and migrations.

## Coordination

All Claude, Antigravity and Strawberry tasks must explicitly read this file; automatic discovery is not assumed. Tool-specific instruction files may reference it, not contradict/duplicate the full rule set.

Use distinct branches and isolated worktrees after repository/access approval; branches in one shared checkout are not isolation. Inspect existing edits before writing; never discard another worker's changes. Stop and coordinate on unexpected concurrent edits.

Freeze route/view-model contracts before producer/consumer parallelism. Contract changes require impact notes and coordinated backend/frontend/test changes. Integration owner alone merges. No mass formatting outside assigned paths or independent package upgrades.

## Security and remote access

No credentials, private keys, tokens or real client/case records in source, docs, fixtures, screenshots or agent prompts. Use synthetic data and secret templates without values.

Later private modules require backend policies and scoped queries on all reads/writes; frontend visibility never grants authority. Public HTML, props, caches and logs must exclude private records. Protect the web root, sanitize any approved rich content and verify TLS before deployment.

Remote developer access is separate from the application. No hidden permanent owner account, embedded web shell, arbitrary-command endpoint or browser file editor in the public site. Any SSH/admin access requires the firm's delegated authorization, least privilege, key management, revocation and an approved hosting plan. The user selected SSH/SFTP or VS Code Remote SSH as a planning direction; see docs/REMOTE_DEVELOPER_ACCESS_PLAN.md. No remote access is configured or authorized for setup by this file. Do not embed a terminal or shell in the application.

## Quality and acceptance

Public delivery: accurate approved content, phone/email links, responsive layouts, keyboard/focus/contrast review, no broken links/placeholders, useful server-rendered HTML/metadata and safe deployment preparation.

Later modules: independent role/record authorization, reset/revocation, publication, concurrency, audit/recovery and timezone tests as applicable; tested backups before confidential production use. Do not claim compliance, security, performance or launch readiness without matching evidence and approvals.

No purchases, external sends, DNS changes, production deployment, destructive migrations or permission changes under a local planning task.

## Stop conditions

Stop and report missing approval, conflicting scope, uncertain content/qualifications, changed repository state, hosting incompatibility, secret exposure, failed tests or an unsafe access request. Do not waive failures to meet a budget or deadline.

## Handoff format

- Authorized task and contracted edition.
- Decisions/contracts used and unresolved blockers.
- Files changed, branch/commit if applicable; no invented identifiers.
- Tests/checks actually run, exact results and untested areas.
- Migration/config/dependency needs and ownership requests.
- Known limitations, review needed and next dependency.

Planning handoffs must plainly state that no application implementation/tests/deployment occurred. Keep task status in the agreed board; do not create competing trackers.
