> Historical proposal. Its Laravel recommendation is superseded by the selected Laravel + React/Inertia direction in STACK_DECISION_AND_COMPARISON.md. Its statement that implementation was unauthorized and its public-only scope are superseded by the user's 11 October 2026 instruction to implement the full PRD backend. MySQL/hosting/version recommendations here remain proposals until locally verified. No production deployment is authorized.

# Proposed stack and architecture

Date: 10 October 2026
Status: Proposal only. Not approved for implementation or purchase.
Basis: PROJECT_ASSESSMENT.md and existing scaffold Markdown. Original Word PRD reconciliation remains incomplete. No agents launched.

## Recommendation

Build one modular Laravel/PHP application, with Blade server-rendered views, Tailwind CSS, minimal Alpine.js for local interactions, and MySQL. Use Laravel's maintained authentication/session/password-reset facilities with a deliberately selected authentication scaffold; do not build custom password cryptography or reset-token handling. Use framework policies plus scoped queries for record authorization.

Choose supported stable Laravel/PHP/MySQL versions together at foundation time, confirm compatibility and support windows, and pin exact dependency versions in lockfiles. Do not infer version support from a hosting page saying 'latest'.

Use database-backed sessions and cache initially, an SMTP service for password reset, PHPUnit/Pest-compatible feature and unit tests (select one convention), and Playwright for browser acceptance tests. Build frontend assets using Vite in CI; production serves compiled assets and does not need a persistent Node service. CI provider is proposed as GitHub Actions if a GitHub repository is chosen; repository destination remains undecided.

No Redis, separate API service, microservices, persistent queue workers, Docker production requirement, or external search service in v1. Add them only for a measured need. If password-reset delivery is synchronous initially, use timeouts and safe failure handling; if queued later, specify worker supervision, retries and monitoring before enabling it.

## Why this stack

The application is predominantly forms, authenticated CRUD, role/record permissions and public content. A single framework reduces integration seams and lets the database transaction cover a business change and its audit event. Server-rendered screens reduce the need to maintain a separate client state model and API.

Trade-offs:
- Laravel/Blade: smaller operational surface and unified auth/validation, but requires PHP expertise and disciplined module boundaries; complex interactive screens may need additional UI work.
- Separate React/Next.js plus API: useful for a highly interactive product or multiple clients, but adds contract synchronization, client state, deployment and authentication complexity. Not recommended for current v1 scope.
- Django: a credible alternative if the team already has stronger Python skills; hosting/runtime support still needs confirmation. There is no established team-language preference in the inspected files.
- MySQL: proposed as a conventional relational fit, not a verified entitlement on the purchased host. PostgreSQL is also suitable, especially if the team prefers it; do not maintain dual-database compatibility in v1. Run CI against the selected production engine, not SQLite alone.
- Shared hosting: potentially lower operational burden, but only acceptable if the exact plan meets the application and recovery requirements below.
- VPS: greater runtime control, but more operational responsibility and cost. Do not select an unmanaged VPS without an accountable operator.

## Deployment decision

First verify the actual purchased/intended HostAfrica product. If shared hosting meets every required capability, deploy there with a safe release process. Otherwise use a managed or responsibly operated Linux VPS. This is one application in either case, not two deployments for public and staff views.

A self-operated VPS could use a supported Linux distribution, Nginx, PHP-FPM and MySQL with the database accessible only privately. An existing managed control panel may use a different supported web server; Nginx is not mandatory. Database isolation and least privilege remain mandatory. Initial capacity is provisional and must be measured; do not purchase a plan based on this document alone.

## Logical architecture

```text
Browser
  /, /services, /about, /contact     public views
  /staff/*                         private staff views
             |
          HTTPS
             |
      Laravel routing/middleware
       | public published-content reads
       | active staff session + CSRF + rate limits
             |
      policies + scoped queries + validated inputs
             |
      application services / transactions
       | cases, assignments, notes, follow-ups
       | staff lifecycle, content publication
       | audit events and recoverable deletion
             |
           MySQL

Password reset -> SMTP adapter
Private backups -> restricted independent backup destination
CI -> compiled assets + tested release -> staging -> approved production deployment
```

Routes show proposed structure, not approved endpoints. Public pages and private staff pages share a runtime but not authorization or serializers. No external JSON API is required by v1. JSON endpoints used for screen interactions must be explicitly contracted and receive the same permission checks.

## Scaffold mapping — do not reorganize yet

Laravel conventions are preferable to forcing the framework into the current empty folders. Proposed mapping after approval:
- backend/ becomes the Laravel application root: app/, routes/, database/, config/, tests/, bootstrap/, public/, storage/ and dependency manifests.
- frontend/public-site/ maps to backend/resources/views/public/.
- frontend/staff-portal/ maps to backend/resources/views/staff/.
- frontend/shared/ maps to backend/resources/views/components/ and shared frontend assets under backend/resources/.
- backend/application/ and backend/domain/ map to app/Services/ and focused app/Domain/ modules only where useful; do not add layers solely to fill folders.
- shared/contracts/ remains the authoritative interface/permission documentation.
- connectors/ retains adapter documentation; actual PHP adapters live under backend/app/Integrations/.
- infrastructure/ owns deployment scripts/configuration and operations runbooks.
- assets/ retains approved source assets; public exports are copied into application build assets deliberately.

Record this mapping in an approved decision before moving or creating application files. The plan does not authorize deleting existing folders or documents.

## Data model sketch — not a migration specification

Proposed entities: users, cases, case_assignments, case_notes, follow_ups, content_pages/content_revisions, audit_events, sessions and password-reset storage. Avoid database reserved-word ambiguity in names when finalizing schema.

Assignments are shown as a separate entity to allow a clean boundary; whether a case has one or multiple associates is unresolved. Required case fields, statuses, transitions, ownership and note-edit rules are unresolved. Content revision structure depends on the approval workflow. No client accounts or document upload tables in v1.

Use foreign keys, explicit indexes for case assignment/status and follow-up due/completion queries, and transactionally consistent writes. Use optimistic concurrency/version checks for edits where overwriting another staff member's changes would lose work. Decide public case identifiers deliberately; non-sequential IDs do not replace authorization.

## Security and workflow contracts

- Admin: all authorized staff management and case workflows. Associate: assigned-case workflows only. Content Editor: public content workflows only. Specify allowed actions in a matrix; do not assume all modifications from a role name.
- Scope list/search/count/history/follow-up queries before returning records. Authorize mutations against the same assignment rules; nested IDs must belong to the authorized parent case.
- Use secure HttpOnly session cookies, CSRF protection and session rotation on login. Define session expiry and enforce account deactivation on requests and session invalidation.
- Rate-limit login and reset requests; avoid account enumeration. Define reset-token expiry, single use and revocation behavior.
- Apply no-store to sensitive staff responses and restrict CDN caching to deliberately public/static resources. robots directives are not access control.
- Persist actor/time/action/entity for audit events; redact confidential bodies and secrets. Define approved audit detail, reader permissions and retention. Application workflows cannot edit audit events; stronger tamper evidence is a separate operational decision.
- Soft-delete cases and recover in an admin-only transaction; specify behavior for assignments, notes and follow-ups, including reassigned/deactivated users.
- Store event timestamps in UTC; display Africa/Nairobi. Decide whether follow-up deadlines are local dates or instants before implementing today's/overdue logic.
- Public reads use published content only. Define approval authority and safe preview access. Sanitize any rich-text content; publishing must not expose private fields.
- Keep backups outside public web roots; encrypt and restrict access. Define application-level database backups in addition to any provider snapshots.
- Do not use real case records in fixtures, agent context, development or staging.

## HostAfrica capability verification checklist

A quick sweep reached the official Linux VPS product page. It describes root/SSH access, unmanaged service by default, and backup add-ons rather than included automated backups. It also lists multiple hosting locations and contains older OS references. These product-level statements do not confirm the user's subscription or provisioning location. [1]

The Kenya shared-hosting page failed extraction. Search snippets are not treated as verified support for PHP, cron, databases or plan features. No pricing or retention guarantee is assumed.

Ask the account owner/support to confirm and record:

| Capability | Evidence needed | Consequence if absent |
|---|---|---|
| Exact plan/control panel | Product name, limits, access level | Cannot finalize deployment topology |
| Supported PHP + extensions | Web and CLI versions; required Laravel extensions | Change plan/runtime, not silent dependency downgrade |
| Database | MySQL/MariaDB engine/version, limits, access and backup tools | Choose supported engine or alternate hosting |
| Release access | SSH/SFTP, Composer or safe CI-built vendor deployment; configurable document root pointing only at public/ | No launch if secrets/application files are exposed |
| Routing/filesystem | Rewrite support, storage permissions, symlinks if needed, persistent private storage | Adapt safely or choose different host |
| TLS/domain | Certificate issue/renewal, HTTPS redirects, DNS ownership | Production blocked |
| Cron | Scheduler/backup execution and frequency limits | Provide verified external scheduler or different plan |
| SMTP | Outbound ports, limits, provider authentication, SPF/DKIM/DMARC control | Password reset cannot be accepted as working |
| Resources | CPU/RAM/process/database/storage limits and alerts | Load test and size before release |
| Environment/secrets | Secure configuration, deploy-user permissions, secret rotation | Production blocked |
| Staging | Separate database, secrets, non-indexed/access-controlled environment | No safe deployment rehearsal |
| Backups | Inclusion/add-on, frequency, retention, encryption, location, restore scope, cost and restore access | Define independent backups; recovery release gate remains blocked |
| Operations | Patching, monitoring, incident handling and support responsibility | Name an accountable operator; unmanaged VPS not a default shortcut |
| Data location/privacy | Actual region, backup region, terms, processors/subprocessors and firm approval | Legal/organizational review before real case data |
| Rollback | Release switching, migration strategy and recovery permissions | Production blocked |

Root access allows configuring software; it is not proof that the stack is installed, managed, hardened or backed up.

## Open decisions and gates

Block architecture foundation: stack acceptance, hosting capability evidence, repository destination/ownership, original PRD reconciliation and folder-mapping approval.
Block schema/contracts: case fields/statuses, assignment multiplicity, action permissions, follow-up semantics, content approval, concurrency and deletion/recovery behavior.
Block release: approved branding/copy/contact details, backup owner/retention/recovery objectives, privacy review, operator responsibility, verified staging/restore/TLS/email and independent security acceptance.

Do not treat proposals as user approvals. The accompanying MULTI_AGENT_HANDOFF_PLAN.md specifies what work can begin after each gate.

## Sources

[1] HostAfrica Linux VPS product page, reached 10 October 2026: https://www.hostafrica.com/servers/linux-vps-servers/
Shared-hosting page attempted but not successfully read: https://www.hostafrica.ke/hosting/web-hosting

## Final reconciliation with concurrent project audit

A final read discovered PROJECT_STATE.md and IMPLEMENTATION_PLAN.md added during this planning pass. PROJECT_STATE.md reports a verified parent Git repository at C:\Users\AMREF\Projects\codex-test, on main with no commits, and a PRD-derived traceability map. Treat that as the current inventory; PROJECT_ASSESSMENT.md is now only its index. Do not initialize a nested repository. Before worktrees, the lead must verify the live Git state and establish an approved initial commit and repository boundary. Repository destination/access/CI remain unresolved.

The new audit supplies case fields (client name/contact, type, number, court, status, assigned lawyer, opening date) and follow-up fields (date, note, pending/done status, assignee). These are now baseline requirements, not unknown fields; exact validation, statuses, date semantics, assignment multiplicity and permissions still need contracts. Associates adding/editing assigned cases is recorded in that traceability map and must be carried into the permission matrix.

The earlier original-PRD gap/B01 is narrowed: a PRD-derived audit is available, although this planning pass did not independently read the Word document. Review and approve that traceability baseline rather than duplicate the extraction by default. The logo is reported as embedded EMF; an approved web export remains needed.

IMPLEMENTATION_PLAN.md is an aggressive four-day MVP proposal, not an approved deadline. This handoff plan adds dependency and review gates without promising that schedule. Keep TASK_BOARD.md at the parent Git root as the task-status authority; the lead should link work packages there when authorized rather than create a competing task board. These reconciliation notes supersede earlier references to an absent/unknown Git context and wholly unavailable PRD traceability.
