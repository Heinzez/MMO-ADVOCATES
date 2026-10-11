# Four-day implementation plan

This is an aggressive MVP sequence, not a delivery guarantee. The selected stack direction is Laravel + React/Inertia, Blade public pages and Tailwind; the current user has authorized backend implementation. No production deployment is authorized. Use synthetic development/test data only. Exact framework versions, MySQL/HostAfrica fit and operational retention decisions still require verification.

## Day 1 — choose and bootstrap

- Bootstrap Laravel inside the existing `backend/` folder using an isolated local PHP/Composer environment; pin supported versions and retain the existing directory scaffold.
- Verify the intended HostAfrica plan's Laravel/PHP/MySQL capabilities, TLS, persistent storage, scheduled backups, and staging options before recording production compatibility.
- Decide session/password-reset approach, initial case statuses, qualification mapping, logo export, backup owner/retention, and content publish permissions.
- Record exact runtime/dependency/database choices; create app/dependency manifests, local setup, an environment example without secrets, and initial migrations for users/roles, cases, assignments, follow-ups, public content, and audit events.
- Acceptance: clean checkout can install and start a minimal health-check app locally; migrations apply to an empty disposable database; no real client information or production secrets are committed.

## Day 2 — public site and content controls

- Implement responsive Home, Services, About, Contact pages and approved copy/assets.
- Implement the content editor's required public-content changes, preview/publish behavior, and actor/time audit trail.
- Acceptance: all required public details are present and scannable on phone/tablet/desktop; only published content is public; editor changes are attributed; no booking/client/payment flow exists.

## Day 3 — private access and case workflows

- Implement staff login/logout/password reset, role checks, admin user activation, case assignment, case list/search/filters, case details, follow-up timeline, and assigned-case associate operations.
- Implement dashboard today/overdue behavior in Africa/Nairobi time, case/follow-up audit, and admin recovery for accidental deletion.
- Acceptance: Admin, Associate, and Content Editor permissions match the PRD on every backend operation; an associate cannot view or change an unassigned case; content editors cannot access cases/users; synthetic records demonstrate the complete case/follow-up flow.

## Day 4 — verification and deployment readiness (not production deployment)

- Exercise public/private access boundaries, password-reset lifecycle, role restrictions, case recovery, Nairobi date boundaries, responsive behavior, and migration from a clean database.
- Configure and verify TLS/staging assumptions, backup retention and an isolated restore procedure against the chosen hosting setup; document run/test/rollback commands.
- Acceptance: all planned acceptance checks pass; a backup restores in an isolated environment; private data is not exposed via public routes; documented commands work from a clean checkout. Production deployment remains a separate authorized task.

## Schedule risks

Four days is tight for a new case-management system handling confidential client records. Host incompatibility, unresolved requirements, or security defects should extend the schedule rather than be waived. Two-factor authentication is optional in the PRD; decide explicitly whether it is included in the MVP. Avoid unapproved features and real client data throughout development.
