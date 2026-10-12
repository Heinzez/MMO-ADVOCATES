# MMO Advocates LLP task board

Current state: Laravel 13 React/Inertia backend is bootstrapped in the existing `backend/`. Local Docker/MySQL, lockfile installs, migrations, 48 automated tests, production asset compilation, and host HTTP access are verified. Public website and content workflow remain unimplemented. See [project state](docs/PROJECT_STATE.md) and [implementation plan](docs/IMPLEMENTATION_PLAN.md).

| ID | Status | Task | Acceptance criteria |
|---|---|---|---|
| AUDIT-01 | Done | Inspect repository, PRD, instructions, Git, manifests, app entry points, schema, tests and deployment config | Verified inventory and PRD map documented; starter/default scope distinguished from working product behavior |
| BOOT-01 | Done | Verify local development setup and commands | Pinned Docker PHP/MySQL; Composer/npm lock installs, MySQL migrations, 48 tests, Vite production build, and host `/up` + home HTTP 200 verified |
| AUTH-01 | Done | Disable self-registration and retain staff authentication/account provisioning | Registration and uncommissioned account routes are unavailable; login/logout/reset, active-account checks, and initial admin provisioning are present; production mail remains a release task |
| DATA-01 | Done | Define PRD domain schema and synthetic factories | Role/case/follow-up/audit migrations and synthetic factories install on MySQL; tests use synthetic data |
| ACL-01 | Done | Implement server-side authorization and scoped queries | Case/follow-up/user policies, associate assignment scoping, staff denials and admin restrictions pass feature tests |
| CASE-01 | Done | Implement case/follow-up workflow and dashboard data | Protected APIs support case operations/filtering, follow-up lifecycle, recoverable admin deletion, audit entries and Nairobi dashboard boundary; staff UI remains separate work |
| ADMIN-01 | Done | Implement admin user and assignment management | Active admins provision/deactivate accounts and case assignment operations enforce role rules; regression tests pass |
| CONTENT-01 | Backlog | Implement staff content editing, preview/publication and history | Staff can edit public content; visitors receive published content only; every change records actor/time |
| VERIFY-01 | In progress | Complete release readiness and hosting review | Local app/tests/assets pass; production email, hosting runtime, TLS, backup/restore and privacy operations remain unverified; no production deploy |
