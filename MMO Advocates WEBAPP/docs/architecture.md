# Current application architecture

The active application is a single Laravel 13 codebase in `backend/`. The `frontend/`, `backend/api/`, `backend/application/`, and `backend/domain/` directories are retained planning scaffold; they are not separate applications or the active route/controller/model layout.

```text
Browser
  ├─ public routes ── Blade / Inertia public page components
  └─ authenticated staff routes ── active-account middleware
                                  ├─ policies and scoped queries
                                  ├─ case/follow-up/dashboard/user controllers
                                  └─ Eloquent models ── MySQL (local Compose)

Authentication: Laravel Fortify ── session/password-reset foundations
Frontend build: native Node/npm ── Vite / React / Inertia / Tailwind 4 assets
Wayfinder generation: npm build ── Docker PHP/Artisan
```

The repository has role and active-account fields, case, follow-up and audit models/migrations, server-side case/follow-up/user policies, protected endpoints, associate assignment scoping, and synthetic feature tests. The local app and MySQL services bind to loopback using pinned Docker image digests. Tests use SQLite memory; local interactive use uses MySQL 8.4.

The public marketing pages and content management workflow are not implemented. There is not yet a full staff UI for the backend endpoints. Production hosting and MySQL/email/backup configuration remain decisions to verify against the firm's actual environment. No production deployment has occurred.

See [project state](PROJECT_STATE.md), [implementation plan](IMPLEMENTATION_PLAN.md), [bootstrap decision](decisions/BOOTSTRAP_DECISION.md), and [local development commands](../backend/README.md).
