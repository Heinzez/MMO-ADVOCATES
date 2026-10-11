> Current planning decision, 10 October 2026: user selected Laravel + React/Inertia, with Blade public pages, and a public-website-first delivery. See STACK_DECISION_AND_COMPARISON.md and TIERED_SCOPE_PROPOSAL.md. Older Blade-only and full-staff-first proposals below are superseded where they conflict. No implementation or agent launch is authorized.

# Multi-agent handoff plan

Date: 10 October 2026
Status: Proposed; no agents launched. Implementation remains gated.
Read first: PROJECT_ASSESSMENT.md, PROPOSED_ARCHITECTURE.md, requirements.md and security-and-privacy.md. Original PRD reconciliation remains incomplete.

## Goal and guardrails

Deliver the public firm website and a private staff case-management portal. Exclude booking, client accounts, payments, document uploads and reminders. Preserve server-enforced Admin/Associate/Content Editor boundaries, audit history, recoverable case deletion and Nairobi-time follow-ups.

This plan uses the proposed Laravel conventional layout. Until its approval, paths below are proposed ownership boundaries, not instructions to reorganize the scaffold. No remote repository, deployment, invitations or purchases are authorized by this document.

## Blocker register

| ID | Decision/evidence missing | Blocks | Proposed resolver |
|---|---|---|---|
| B01 | Original Word PRD reconciled with Markdown | Requirements baseline/sign-off | Lead with firm owner |
| B02 | Stack and conventional folder mapping approved | Application scaffold | User/technical lead |
| B03 | HostAfrica plan, runtime and access confirmed | Deployment design; may affect stack | Account owner + operations |
| B04 | Repository destination/access, Git parent context, CI provider | Worktrees and collaboration | User + lead |
| B05 | Case fields/statuses/transitions and assignment multiplicity | Schema and case contracts | Firm process owner |
| B06 | Per-role create/edit/delete/restore/reassign permissions | Authorization contracts | Firm process owner + security |
| B07 | Deadline date/datetime and completion semantics | Follow-up implementation | Firm process owner |
| B08 | Publishing approval authority and preview behavior | Content workflow | Firm content owner |
| B09 | Recovery retention, related-record behavior and audit retention | Deletion/recovery implementation | Firm owner + security |
| B10 | Approved logo, copy, contacts and partner qualifications | Public-content release | Firm content owner |
| B11 | Backup owner, retention, RPO/RTO and provider terms/location | Production launch | Firm owner + operations |
| B12 | Session expiry, 2FA requirement, reset policy, concurrency convention | Auth/security contracts | Lead + authorized owner |

Suggested defaults in the architecture are not approvals. Track resolutions with decision, approver, date, evidence and affected contracts.

## Roles and exclusive file ownership

One named integration lead is required. Agent labels below are future task roles, not running agents.

| Role | Owns after layout approval | Must not edit independently |
|---|---|---|
| L — lead/integration | Root README/agent rules; shared/contracts/**; docs/decisions/**; backend/composer.json, composer.lock, package.json, package lock; backend bootstrap/config/test harness; CI workflows | Domain implementations without owner coordination |
| B — backend/domain | backend/app/Models/**, Policies/**, Services/**, Domain/**, Integrations/**; backend/app/Http/**; backend/routes/**; backend/database/**; backend/tests/Unit/**, Feature/** | Shared contracts, root manifests/config, frontend views, QA tests |
| F — frontend/public + staff | backend/resources/views/**, css/**, js/**; assets/** approved exports; frontend documentation | Routes/controllers/policies/migrations/config/dependency files |
| Q — independent QA/security | backend/tests/Security/**; tests/e2e/**; docs/qa/** | Production implementation, backend-owned tests or lockfiles |
| O — operations/deployment | infrastructure/**; docs/operations/**; connectors/hosting/** and connectors/storage/** operational notes | App config/secrets/manifests, database migrations, PHP integration adapters |

Backend owns all schema migrations and PHP adapters, including SMTP and backup-related application adapters if needed. Operations requests configuration changes from L and application adapter changes from B. L owns test discovery/config and ensures Q's tests run. No catch-all shared ownership.

Start with B and F in parallel only after foundations; Q and O can be bounded reviewers/tasks rather than permanent agents. Agent count is not a success metric.

## Dependency graph and staged dispatch

### Gate 0 — decision pack (lead, read-only preparation)

May prepare now: requirements reconciliation, hosting questions, draft role/action matrix, schema sketches and acceptance scenarios. Do not invent user-owned facts. Resolve B01–B04 before executable scaffold work. Resolve B05–B09 and B12 before their affected contracts.

Acceptance: written baseline with explicit exclusions, approved stack/layout, hosting evidence or documented conditional topology, repository ownership and decision register.

### Gate 1 — executable foundation (lead, sequential)

Create approved application scaffold and isolated local/test setup; pin dependencies; establish environment template without secrets; contracts; commands; CI; branch/worktree method. Confirm parent Git context before initialization. No remote creation or push without authorization.

Acceptance: clean checkout installs/builds/tests; production-engine test database is disposable; no secrets tracked; migrations run from empty database; ownership and CI discovery are explicit.

### Gate 2 — minimal vertical slice (B + F coordinated; Q reviews)

Implement secure login/logout and an assigned-case list/detail slice with synthetic fixtures. F consumes frozen routes/view-model contracts. Include Admin, assigned Associate, unassigned Associate, Content Editor, anonymous and inactive-user scenarios.

Acceptance: direct-request authorization tests pass; public output has no private fields; UI and backend agree; session/CSRF controls work. L integrates and freezes initial contracts before expanding scope.

### Gate 3 — parallel feature work

B: case lifecycle, assignments, notes, follow-ups, audit, recovery, reset and public-content publication.
F: public pages and staff screens over agreed view models, including errors, empty/loading states and conflict handling.
Q: independent permission, reset, privacy, concurrency, timezone and workflow abuse tests.
O: staging/deployment/backup runbooks and scripts against confirmed hosting; no production deployment.

Dependencies: follow-ups depend on B07; content depends on B08; recovery depends on B09; final public copy depends on B10; operational topology depends on B03/B11. F may use explicit synthetic/mock fixtures but must not label mocked behavior complete.

Acceptance: work-package criteria below; no unresolved contract changes; CI evidence attached to each merge request.

### Gate 4 — staging and release review

Integrate, migrate staging, test SMTP/reset, restore a backup into an isolated environment, rehearse rollback, verify content and privacy controls. Resolve all release blockers. Obtain authorized release decision before touching production.

Acceptance: release checklist, independent QA results, known-risk disposition, restore evidence, operator assignment and final content approval. This plan does not grant deployment authorization.

## Shared-interface rules

1. L owns shared/contracts/permissions.md, data-model.md, routes-and-view-models.md and errors.md. Proposed names are future deliverables, not existing files.
2. Prefer server-rendered route/view-model contracts. Only introduce JSON endpoints when a screen needs them; specify method/path/auth/input/output/errors/pagination and permission rules.
3. Define IDs, nullability, enums, date formats, timezone conventions and forbidden public fields. Do not expose ORM models directly as public payloads.
4. Define 401/403/404 behavior, validation errors and conflict responses consistently; specify non-disclosure behavior for unauthorized record IDs. No silent authorization bypass to satisfy UI tests.
5. Freeze an initial contract revision before parallel consumption. Changes require owner request, impact analysis, coordinated producer/consumer/test changes and lead approval.
6. B authors migrations; L reviews ordering; O applies only reviewed releases. Never rewrite applied production migrations or reset a non-disposable database.
7. L makes dependency/lockfile/config changes. Agents propose needs with rationale instead of independently installing conflicting packages.
8. Audit event names, transaction semantics and recovery behavior are part of contracts, not implementation guesses.
9. Frontend roles control presentation only. Backend permission tests determine access behavior.
10. Use synthetic fixtures shared through documented contracts; private data and credentials must not enter prompts, fixtures, screenshots or commits.

## Work-package acceptance criteria

### Backend

- Role and assignment checks cover list/search/count/detail/history/notes/follow-ups and every mutation.
- Nested resources belong to the authorized case; stale assignments cannot bypass checks.
- Invalid inputs cause no partial changes. Business changes and required audit records are atomic.
- Admin recovery restores valid relationships under the approved policy; associates cannot recover deleted cases.
- Today/overdue logic passes Nairobi boundary cases; completed follow-ups are not incorrectly overdue.
- Reset flow is rate limited, non-enumerating, expiring and single use; deactivated accounts are blocked according to contract.
- Draft content is not public; publication and preview obey the approved authority model.
- Concurrent changes cannot silently destroy another user's work under the selected conflict policy.

### Frontend

- Home/Services/About/Contact use approved copy/assets and a working phone action.
- Public/private layouts are responsive and keyboard usable; forms have labels and accessible error feedback.
- Staff screens implement authorized actions, search/filtering, details/history, today's/overdue follow-ups and approved content workflows.
- Errors, empty states, validation and edit conflicts are visible and actionable; no fabricated successful save.
- Views receive only allowed fields; confidential values never enter public markup or assets.

### Independent QA/security

- Tests include unauthenticated, inactive, all roles and at least two associates with disjoint assignments.
- Direct requests and identifier substitution test horizontal/vertical privilege escalation.
- Reset/session/CSRF, publication leaks, deleted records, timezone boundaries and concurrency are tested.
- Tests run against the chosen production database engine in an isolated environment.
- Test reports identify what ran, results and untested areas; no 'secure' claim based only on green unit tests.

### Operations

- Document runtime/CLI compatibility, only-public document root, TLS renewal, private database access and least privilege.
- Separate staging secrets/database and access controls; real client data excluded.
- SMTP delivery verified without logging tokens.
- Backup schedule, retention, encryption/access, independent destination and RPO/RTO recorded; restore actually rehearsed.
- Release/migration/rollback steps tested. Distinguish code rollback from irreversible data migration; use expand/contract migrations where needed.
- Patching/monitoring/incident owner is named. Application-aware database backups are not replaced by an untested VPS snapshot promise.

## Branch/worktree and review protocol

After repository approval, each dispatched task uses a distinct branch and worktree. Branches alone in one shared working directory are not isolation. Keep worktrees outside the main checkout and grant access only as needed.

Task branch naming: agent/<role>/<bounded-task>. Small changes; no mass formatting outside owned paths. L merges in dependency order and runs integration checks. Q reviews auth/privacy changes; O reviews deploy-sensitive changes. The author does not alone approve security-sensitive completion.

Every handoff contains: commit/branch, files changed, contract revision, tests and commands/results, migrations, configuration needs, known gaps and next dependencies. A passing test command is not proof of full release readiness.

## Future dispatch brief template

Role/task:
Goal and excluded scope:
Approved decisions and contract revision:
Owned paths and prohibited edits:
Dependencies already merged:
Synthetic fixtures and test environment:
Acceptance scenarios:
Required test evidence:
Blockers — stop and report rather than guess:
Output: bounded changes plus handoff; no push/deploy/send/purchase unless separately authorized.

## Current state

No agents running. No scaffold implementation, file moves, Git initialization, repository creation, purchases or deployment performed. Next action is resolving foundation decisions and verifying hosting, not launching all roles simultaneously.

## Final reconciliation with concurrent project audit

A final read discovered PROJECT_STATE.md and IMPLEMENTATION_PLAN.md added during this planning pass. PROJECT_STATE.md reports a verified parent Git repository at C:\Users\AMREF\Projects\codex-test, on main with no commits, and a PRD-derived traceability map. Treat that as the current inventory; PROJECT_ASSESSMENT.md is now only its index. Do not initialize a nested repository. Before worktrees, the lead must verify the live Git state and establish an approved initial commit and repository boundary. Repository destination/access/CI remain unresolved.

The new audit supplies case fields (client name/contact, type, number, court, status, assigned lawyer, opening date) and follow-up fields (date, note, pending/done status, assignee). These are now baseline requirements, not unknown fields; exact validation, statuses, date semantics, assignment multiplicity and permissions still need contracts. Associates adding/editing assigned cases is recorded in that traceability map and must be carried into the permission matrix.

The earlier original-PRD gap/B01 is narrowed: a PRD-derived audit is available, although this planning pass did not independently read the Word document. Review and approve that traceability baseline rather than duplicate the extraction by default. The logo is reported as embedded EMF; an approved web export remains needed.

IMPLEMENTATION_PLAN.md is an aggressive four-day MVP proposal, not an approved deadline. This handoff plan adds dependency and review gates without promising that schedule. Keep TASK_BOARD.md at the parent Git root as the task-status authority; the lead should link work packages there when authorized rather than create a competing task board. These reconciliation notes supersede earlier references to an absent/unknown Git context and wholly unavailable PRD traceability.
