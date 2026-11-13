# Implementation plan

The project now has a Laravel 13/React starter in `backend/`; retain it and deliver the PRD in small stages. Use synthetic fixtures only. Do not deploy or introduce actual client data. The prior public-only planning scope is superseded by the current user authorization to implement the PRD backend.

## Progress at bootstrap verification

BOOT-01 is complete. The Laravel 13.35.0 application, Composer/npm lockfiles, pinned Docker PHP/MySQL environment, MySQL migrations, native frontend build, complete 48-test suite, and Windows host HTTP access have been verified. See `PROJECT_STATE.md` and the BOOT-01 addendum in `decisions/BOOTSTRAP_DECISION.md` for commands and transient failures resolved. Backend case, follow-up, dashboard, account APIs and their server-side tests are present; the public site, full staff UI, content workflow and production deployment requirements remain open.

## Four-day sequence

### Day 1 — Verify foundation and close visitor access

- Pin and document the scaffold baseline; verify clean install, migration, HTTP boot and frontend build using the available Docker/Node runtimes.
- Remove public self-registration and unsupported starter screens/routes; keep only authentication flows required by the PRD.
- Define a role enum/value set (`admin`, `associate`, `staff`), admin-provisioned accounts, deactivation behavior and middleware/policy test conventions.
- Acceptance: anonymous visitor cannot register or reach private screens; synthetic staff login/logout and reset request work in a configured local environment; no case feature claimed yet.

### Day 2 — Data model and server authorization

- Add migrations/models/factories for users/roles, cases, follow-ups and audit events using PRD fields. Use soft deletion for case recovery. Avoid inventing status enumerations beyond PRD values.
- Implement policies and server-side scoped queries: admins all records and user administration; associates assigned cases only; staff public content only; visitors public routes only.
- Acceptance: feature tests cover each role's allowed and denied case, follow-up and user operations, including guessed IDs; no sensitive case data appears in staff/visitor responses.

### Day 3 — Case workflow and dashboard data

- Implement admin case creation/assignment, associate access and edits for assigned cases, follow-up creation/update, filters/search and dashboard's due-today/overdue data.
- Record actor/time for case/follow-up creation and changes without copying sensitive notes into logs.
- Acceptance: synthetic end-to-end feature tests prove assignment changes scope, follow-ups transition pending/done, dashboard dates use Africa/Nairobi, and case deletion is recoverable.

### Day 4 — Staff users, public content and hardening

- Implement admin user creation/deactivation and staff-only public-content editing with preview/publication; implement access-audited content history per PRD.
- Run focused unit/feature tests, frontend checks/build, migration rollback/replay and security review. Record unresolved hosting/email/database decisions.
- Acceptance: user administration rejects non-admins; staff cannot query cases/users; visitor sees published public content only; full relevant suite passes on a repeatable setup.

## Decisions to confirm before production

- Confirm the HostAfrica plan, PHP version/extensions and database engine. Local PHP 8.5.11/PDO MySQL and MySQL 8.4.11 are verified in Docker; that does not confirm the production host.
- Outbound email service/configuration and verified password reset delivery.
- Optional two-factor remains available in the starter; registration, passkey UI/routes, and profile edit/delete are disabled. Confirm any production authentication requirements before release.
- Final approved public copy and partner-to-qualification mapping.
- Any case-status values not explicitly enumerated in the PRD. Until approved, validate a bounded text field without imposing a fabricated workflow.

No production deployment, real case data, spending or secrets are part of this plan.
