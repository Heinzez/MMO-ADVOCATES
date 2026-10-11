# MMO Advocates LLP — task board

Current state: documentation scaffold only. Laravel + React/Inertia, Blade public pages, and Tailwind are selected; MySQL is recommended pending HostAfrica verification. The current user authorizes implementation of the PRD backend. PHP/Composer are absent locally; Docker works only with elevated access. See [verified project state](MMO%20Advocates%20WEBAPP/docs/PROJECT_STATE.md) and [implementation plan](MMO%20Advocates%20WEBAPP/docs/IMPLEMENTATION_PLAN.md).

| ID | Status | Task | Acceptance criteria / dependency |
|---|---|---|---|
| AUDIT-01 | Done | Inspect repository, project docs, PRD, Git, manifests, entry points, tests, schema, and deployment files | Findings in `docs/PROJECT_STATE.md`; no functionality claimed without source evidence |
| AUDIT-02 | Done | Reconcile stack/scope notes with the latest user authorization | Laravel/Inertia direction recorded; older public-only deferral and “not authorized” wording marked superseded |
| ENV-01 | In progress | Bootstrap the selected PHP/Laravel stack using the available Composer/PHP container | Laravel 13 app runs locally through the container; no stack replacement; ordinary host PHP remains optional |
| ARCH-01 | Next | Pin exact Laravel/PHP dependencies and verify HostAfrica runtime/database fit | Laravel/PHP dependency constraints recorded; MySQL/hosting remains conditional until actual plan capabilities are confirmed |
| REQ-01 | Next | Resolve V1 open decisions needed for backend behavior | Initial case statuses, assignment cardinality, follow-up date semantics, content publish rights, deletion/audit retention recorded; public-content and backup decisions tracked |
| BOOT-01 | Next | Create first executable foundation in existing `backend/` after ENV-01 | One manifest/lockfile and entry point; documented local run/test commands; clean startup and empty-database migrations; no secrets or real client data committed |
| AUTH-01 | Backlog | Implement staff authentication, reset, roles and server policies | Admin/Associate/Staff/Visitor boundaries enforced and tested on direct requests, including inactive accounts and unassigned case IDs |
| CASE-01 | Backlog | Implement cases, follow-ups, dashboard, user administration, audit and recovery | PRD fields/workflows pass automated tests using synthetic fixtures; no cross-assignment access |
| PUB-01 | Backlog | Implement public content editing/preview and public reads | Published content only is public; editor preview/publish is permissioned and audited; no case fields leak |
| OPS-01 | Backlog | Verify staging, backups and HostAfrica deployment readiness | Capability evidence, TLS/configuration, retention and isolated restore recorded; no production deployment |
