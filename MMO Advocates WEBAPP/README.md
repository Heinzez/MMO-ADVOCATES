# MMO Advocates LLP web application

## Current status

This repository is currently a documentation and directory scaffold. It has no application source, dependency manifests, executable entry point, tests, database schema/migrations, or deployment configuration. The selected direction is Laravel with React/Inertia for staff application screens, Blade for public pages, and Tailwind. MySQL is the recommended database pending HostAfrica capability verification. The current user request authorizes the primary engineer to implement the PRD backend; no code has been created yet. The folder names below remain planned ownership boundaries.

Git is currently on `main`, has no commits, and reports the entire `MMO Advocates WEBAPP/` folder and root `TASK_BOARD.md` as untracked. Node.js/npm are available, but PHP/Composer are not. Docker CLI is installed; access to its engine required elevation. The application is not runnable yet.

```text
frontend/
  public-site/       Home, Services, About, Contact, public content and components
  staff-portal/      Login, dashboard, cases, follow-ups, admin user management
  shared/            UI used by both frontends
backend/
  api/               Routes, authentication middleware and authorization policies
  application/       Case, follow-up, account, content and audit services/validation
  domain/            Roles and core case-management rules
  database/          Schema, migrations and development seed data
connectors/
  authentication/    Staff login, logout, reset and optional 2FA adapter
  database/          Persistence adapter
  email/             Password reset only in v1
  storage/            Public assets and private backups
  hosting/            HostAfrica deployment adapter/notes
shared/               API contracts and safe shared configuration
assets/                Brand source, web-ready logo export and public media
docs/                  Requirements, architecture and security/privacy notes
infrastructure/        Deployment configuration
```

## Boundaries from the PRD

- Public pages are read-only for visitors. Staff can preview and publish approved content.
- Staff portal is private. The backend enforces Admin, Associate (assigned cases only), and Content Editor (public content only) permissions on every request.
- Track actor and timestamp for case, follow-up, and content changes. Cases deleted by mistake must be recoverable by an admin.
- Follow-up deadlines use Africa/Nairobi time. Backups need a retention period and restore checks.
- Booking, client accounts, payments, document uploads, and reminders are outside version 1.

The PRD remains the V1 behavior baseline. Confirm exact framework/database versions and HostAfrica deployment compatibility before release. See [project state](docs/PROJECT_STATE.md), [implementation plan](docs/IMPLEMENTATION_PLAN.md), [task board](../TASK_BOARD.md), [stack decision](docs/STACK_DECISION_AND_COMPARISON.md), and [requirements checklist](docs/requirements.md).
