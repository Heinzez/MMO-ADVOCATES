# Project state

**Verified:** 11 October 2026 (Africa/Nairobi)  
**Source of requirements:** `MMO_Advocates_PRD-1.docx`

## Repository and technology

- Git root: `C:\Users\AMREF\Projects\codex-test`; current branch: `main`; no commits yet. `git status --short --branch` reports `?? "MMO Advocates WEBAPP/"`.
- Project folder contains the PRD, `LOGO MMO.docx`, and Markdown planning/scaffold documents. `LOGO MMO.docx` contains embedded EMF artwork; a reviewed web export is still required.
- **Selected technology direction:** Laravel with React/Inertia for interactive staff pages, Blade for public pages, Tailwind visual system. TypeScript is a recommended frontend default. Exact Laravel/PHP versions and the database engine are not pinned. MySQL is recommended, subject to HostAfrica verification. No dependency manifest exists yet.
- **Local tools:** Python 3.11.9, Node.js 24.13.0 and npm 11.21.0 are present. PHP, Composer, MySQL CLI and MariaDB CLI are absent from PATH. Docker CLI 29.1.3 is installed; normal-sandbox Docker engine access was denied, while elevated `docker info` succeeded. WSL access is denied. The selected Laravel project cannot run in the ordinary local shell until its PHP/Composer environment is made available.
- **Application entry point: none.** There are no source files, route handlers, executable scripts, or app configuration.
- **Run/test commands: none.** There are no manifests/scripts or test files from which valid commands can be given. The application cannot currently be run or tested.
- **Architecture: selected direction, not implemented.** The stack decision specifies a single Laravel application with Blade public pages and React/Inertia staff pages; no executable application architecture exists yet.
- **Database: MySQL recommended but hosting fit not confirmed.** No schema, migration, seed, or database configuration exists.
- **Project instructions:** no `AGENTS.md`, `CLAUDE.md`, or contributor instructions were found in the inspected repository.
- **Tests and CI:** absent. No tests were run; there is no application implementation to verify.

The Git repository is the parent folder. The complete application folder remains untracked and there are no commits, so the current files are not yet captured in repository history.

## Implementation inventory

| Area | Verified implementation | State |
|---|---|---|
| Public website | Requirements and proposed directory names only | Missing |
| Staff portal | Requirements and proposed directory names only | Missing |
| Backend/API | Responsibility/architecture notes only; no Laravel application, API or business logic | Missing |
| Authentication/RBAC | PRD and planning notes only | Missing |
| Database | Empty planned folders; MySQL is recommended but no schema/migrations/config exist | Missing |
| Connectors | Empty planned folders; no adapter code or vendor choices | Missing |
| Assets | Word logo source only; no web-ready export | Partial source supplied; unusable as final web asset until converted/reviewed |
| Documentation | PRD and Markdown scaffold/planning docs | Present, with decisions still open |
| Deployment | HostAfrica named as target only; plan/runtime capabilities unverified, no deployment config | Missing/blocking for release |
| Tests/automation | No test files, test command, or CI configuration | Missing |

## V1 requirement traceability

Every application behavior below is currently **not implemented**. The directory scaffold and documentation do not count as working functionality.

| PRD requirement | Planned area | Current state |
|---|---|---|
| Public Home page: firm name, logo, introduction, call to phone | `frontend/public-site` | Missing |
| Services page listing conveyancing, criminal, environmental/land, succession, civil litigation, small claims, divorce, child custody | `frontend/public-site` | Missing |
| About/areas of work: litigation, conveyancing, drafting, mediation, research | `frontend/public-site` | Missing |
| About page lists partners and qualifications | `frontend/public-site`, approved content | Missing; partner-to-qualification mapping needs confirmation |
| Contact page: phone, email, office address | `frontend/public-site` | Missing |
| Public site is read-only to visitors; no booking, client accounts, or payments | `frontend/public-site`, backend public routes | Missing |
| Content editor can edit public services/contact/text | Staff portal, backend content service | Missing |
| Content changes are logged | Backend audit service/database | Missing |
| Content preview before publishing (clarification in scaffold docs) | Staff portal, backend content service | Missing; confirm approval/publish responsibilities |
| Secure staff login and logout | Auth connector, backend API, staff portal | Missing |
| Password reset | Auth and email connector | Missing |
| Optional two-factor authentication | Auth connector | Missing (optional PRD item) |
| Case list with search and status/type/next-follow-up filters | Staff portal, case API/database | Missing |
| Case record fields: client name/contact, type, number, court, status, assigned lawyer, opening date | Domain/database, case API/UI | Missing |
| Follow-up fields: date, note, pending/done status, assignee | Domain/database, follow-up API/UI | Missing |
| Dashboard for today's and overdue follow-ups | Staff portal, follow-up service | Missing |
| Admin creates/deactivates accounts and assigns cases | User/case administration API and UI | Missing |
| Admin sees all cases/follow-ups and manages users | Backend policies/API and staff portal | Missing |
| Associate sees only assigned cases; can add/edit assigned cases and follow-ups | Backend policies/API and staff portal | Missing |
| Content editor can edit public content but cannot access cases or user management | Backend policies/API and staff portal | Missing |
| Admin can delete cases; accidental deletion is recoverable per scaffold clarification | Case service/database/admin UI | Missing |
| Case/follow-up create and change history identifies actor and time (scaffold clarification) | Audit service/database | Missing |
| Public pages: Home, Services, About, Contact | Frontend | Missing |
| Private pages: Login, Dashboard, Cases, Case detail/timeline, Add/Edit case, Follow-ups, admin User management | Staff portal | Missing |
| HTTPS and hashed passwords | Deployment/authentication | Missing |
| Case pages private and excluded from search indexing | Backend, frontend, deployment | Missing |
| Regular automatic database backups | Hosting/storage operations | Missing |
| Phone, tablet, desktop compatibility | Frontend | Missing |
| Handle client data in line with Kenya Data Protection Act | Whole system and operations | Missing; requirement only, not evidence of compliance |
| HostAfrica hosting target | Deployment | Not configured; provider capabilities/topology unverified |
| Success metrics: visitors find services/phone quickly; no missed follow-ups; cases found under 10 seconds | UX and operational acceptance | Not measurable until implemented and evaluated |
| Risks: shared-host confidentiality, data loss, content-editor misuse | Architecture, access controls, backups, audit | Unmitigated in software; documentation only |

### Explicit V1 exclusions

Booking/appointments, client portal/accounts, online payments, document uploads, and SMS/email follow-up reminders are not to be implemented in V1. Password-reset email is distinct and remains required.

## Conflicts, overlaps, and deployment blockers

- The scaffold has both `frontend/shared/` and root `shared/`; Laravel's conventional `resources/` layout may make both redundant. The later stack decision describes a mapping, but no move is authorized or needed for the first backend slice.
- `connectors/hosting/` and `infrastructure/deployment/` overlap by name. Keep provider integration notes/adapters under connectors and actual deploy/runtime configuration under infrastructure, or remove the redundant folder.
- The logo source remains at project root, while `assets/brand/source/` is empty. Move/copy only after deciding the canonical asset location; do not mistake the Word/EMF source for a web-ready logo.
- No source code, package manifests, tests, schema, migrations, or deployment config exists. Therefore there is currently no command to start, build, test, or deploy.
- PHP and Composer are missing locally. The Docker engine requires elevated access. This blocks a verified Laravel install/run in the ordinary shell, but the elevated Docker route can support local implementation if approved for dependency pulls and container mounts.
- HostAfrica's supported runtime, database, TLS, scheduled backups, persistent storage, and staging capabilities have not been verified. This blocks stack/deployment selection.
- HostAfrica's actual plan, supported PHP/extensions/MySQL, document-root controls, cron, SMTP, storage, staging and backup/restore capability remains unverified and blocks deployment design, not local backend work.
- The exact Laravel/PHP dependency versions and MySQL confirmation remain to be pinned. The initial case-status list, partner qualification mapping, backup owner/retention, content preview/publish approval responsibilities and logo export remain open decisions.
- Older `TIERED_SCOPE_PROPOSAL.md` public-only scope and older “implementation not authorized” statements are superseded for this engineering task by the user's 11 October instruction to implement the PRD backend. Booking, client accounts, payments, uploads and reminder products remain out of scope.

## Documentation index

- `docs/IMPLEMENTATION_PLAN.md`: four-day minimum sequence and dependencies.
- [`TASK_BOARD.md`](../../TASK_BOARD.md) at the Git root: current tasks and acceptance criteria.
- `docs/PROJECT_ASSESSMENT.md`: short index to this verified current state; do not maintain a second inventory there.
- `docs/STACK_DECISION_AND_COMPARISON.md`: selected stack direction; MySQL/versions/hosting remain conditional.
