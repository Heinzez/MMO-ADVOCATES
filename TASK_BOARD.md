# MMO Advocates LLP — task board

Current state: BOOT-01 is verified complete; BACK-01 implementation is present but runtime migration/test verification is blocked because Docker Desktop's Linux engine is unavailable in this session. Laravel + React/Inertia, Blade public pages, and Tailwind are selected; local MySQL was verified during BOOT-01, while HostAfrica details remain unconfirmed. See [verified project state](MMO%20Advocates%20WEBAPP/docs/PROJECT_STATE.md) and [implementation plan](MMO%20Advocates%20WEBAPP/docs/IMPLEMENTATION_PLAN.md).

| ID | Status | Task | Acceptance criteria / dependency |
|---|---|---|---|
| AUDIT-01 | Done | Inspect repository, project docs, PRD, Git, manifests, entry points, tests, schema, and deployment files | Findings in `docs/PROJECT_STATE.md`; no functionality claimed without source evidence |
| AUDIT-02 | Done | Reconcile stack/scope notes with the latest user authorization | Laravel/Inertia direction recorded; older public-only deferral and “not authorized” wording marked superseded |
| ENV-01 | Done | Bootstrap the selected PHP/Laravel stack using the available Composer/PHP container | Laravel 13 app runs locally through the container; verified in BOOT-01 report |
| ARCH-01 | In progress | Pin exact Laravel/PHP dependencies and verify HostAfrica runtime/database fit | Dependencies/runtime pinned locally; HostAfrica plan remains unconfirmed |
| REQ-01 | In progress | Resolve V1 open decisions needed for backend behavior | Existing PRD supplies scope; initial case-status list and production backup ownership remain unresolved |
| BOOT-01 | Done | Create first executable foundation in existing `backend/` | Laravel 13 foundation, MySQL migrations, build, HTTP startup, and 48 tests verified; see BOOT-01 report |
| AUTH-01 | Done | Implement staff authentication, roles and server policies | Existing Fortify foundation and role policies inspected; account and role boundaries feature-tested |
| BACK-01 | In progress | Implement and verify the V1 case-management domain and public-content contracts | Source inspection confirms case/follow-up/dashboard/user APIs, role policies, audit writes and Nairobi date logic; added public content draft/publish API and synthetic tests. `git diff --check` passes. Migration and PHPUnit attempts fail before PHP starts because Docker engine pipe is missing. |
| CASE-01 | In progress | Implement cases, follow-ups, dashboard, user administration, audit and recovery | Existing schema/controllers plus newly added direct cross-assignment-ID and associate-delete tests; no runtime test result for this change yet. Open issue: no audit-history read endpoint or full staff UI in this backend dispatch. |
| PUB-01 | In progress | Implement public content editing/preview and public reads | Draft/published snapshots, allowlisted public JSON contract, Staff/Admin policies, editor/timestamp audit events, and tests added. Public templates remain untouched; frontend consumption is pending. |
| OPS-01 | Backlog | Verify staging, backups and HostAfrica deployment readiness | Capability evidence, TLS/configuration, retention and isolated restore recorded; no production deployment |
