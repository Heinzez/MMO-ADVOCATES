# Project state

**Verified:** 12 October 2026 (Africa/Nairobi)
**Requirements:** `MMO_Advocates_PRD-1.docx`
**Git:** root `C:\Users\AMREF\Projects\codex-test`, branch `main`, no commits. The project and planning files are untracked/modified in this parent worktree. No production data or credentials are included.

## Stack and application layout

- The application remains in the existing `backend/` directory. It is Laravel Framework 13.35.0 from the official React/Inertia starter kit, PHP requirement `^8.3`, Composer 2.10.3, React 19, TypeScript, Tailwind CSS 4, Vite 8, Fortify, Inertia 3, and Laravel Wayfinder.
- Exact Composer dependencies are in `backend/composer.lock`; exact npm dependencies are in `backend/package-lock.json`. The starter also contains `pnpm-workspace.yaml`; no pnpm lockfile is used by the documented npm workflow.
- Host tools: Node.js 24.13.0/npm 11.21.0. PHP and Composer are unavailable natively. Project-local Docker uses pinned Composer and MySQL image digests. PHP 8.5.11 and Composer 2.10.3 were verified in the container, with PDO MySQL, PDO SQLite, mbstring, cURL, DOM/XML, fileinfo, OpenSSL, tokenizer, zip, and pcntl extensions.
- Web entry: `backend/public/index.php`; CLI: `backend/artisan`; HTTP routes: `backend/routes/web.php`; React entry: `backend/resources/js/app.tsx`; Vite config: `backend/vite.config.ts`.
- Laravel conventions are authoritative (`app/`, `routes/`, `resources/`, `database/`). Pre-existing scaffold directories `frontend/`, `backend/api/`, `backend/application/`, and `backend/domain/` overlap that layout and remain in place. No production deployment configuration is present.

## Verified local setup

Run setup and routine commands from [backend local development](../backend/README.md). The Compose file is `backend/compose.yaml`; it provides PHP/Composer/Artisan and MySQL 8.4. App and database ports bind to loopback. `.env.example` contains placeholders only; `.env` is ignored. The MySQL volume persists between `docker compose down` and restarts.

Verified commands/results:

- `docker compose build app` — passed; PHP 8.5.11 image includes `pdo_mysql` and `pcntl`.
- `docker compose run --rm app composer install --no-interaction --prefer-dist` — passed from `composer.lock`.
- `docker compose run --rm app php artisan key:generate` — passed for the ignored local `.env` only.
- `docker compose run --rm app php artisan migrate --force` — passed against MySQL 8.4.11; all framework and application migrations applied.
- `npm ci --no-audit --no-fund` — passed from `package-lock.json` (242 packages installed).
- `npm run build` — passed; Vite generated the production manifest, CSS, JavaScript, and font assets under `public/build/`. Wayfinder calls Artisan inside the project PHP container because PHP is unavailable on the host.
- `docker compose run --rm app php artisan test` — passed, 48 tests and 173 assertions. Tests use synthetic factories and SQLite memory; they do not contain client records.
- `docker compose up -d app` — passed. Windows host requests to `http://127.0.0.1:8000/up` and `/` returned HTTP 200; the rendered home HTML references compiled `/build/assets/` files.

Use `docker compose stop` to stop services while preserving data, or `docker compose down` to remove containers/network while keeping named volumes. Do not use client or production data locally.

## Architecture and implementation state

The backend is one Laravel application. Public pages use Blade-capable Laravel routes; the staff interface is configured for React/Inertia. MySQL 8.4 is the verified local development database. There is no separate API service or production database connection.

Implemented foundations:

- Fortify login/logout, password reset, email verification endpoints, optional two-factor support, active-account login checks, and an interactive first-admin provisioning command. Public self-registration is disabled. Profile editing/deletion and passkey UI/routes are excluded. Email delivery is not configured beyond the local log mailer; dashboard access does not require verified email until staff delivery/provisioning is configured.
- User role (`admin`, `associate`, `staff`) and active status; case records with recoverable soft deletion; follow-ups and audit event tables, models, factories, and migrations.
- Server-side case, follow-up and user policies; authenticated active-account middleware; protected case, follow-up, dashboard and user-management endpoints; associate assignment scoping; staff denial from case records and user administration; audit writes on case and user mutations. Initial feature and policy tests cover these boundaries.

Partially implemented or missing:

- Public home, services, about, contact, partner profiles and qualifications still use starter content or are missing.
- Staff case APIs and data access are implemented and tested, but a complete staff-facing case-management UI, content editing/publishing workflow, and content audit flow are missing.
- Password-reset delivery, staff account email onboarding, production database/email/hosting, HTTPS, backup/restore, CI, and deployment procedures are not configured or verified.

## PRD coverage

| Requirement | State |
|---|---|
| Public home, services, about, contact, partners and qualifications | Missing; current page is Laravel starter content. |
| Visitors cannot register | Implemented; Fortify registration is disabled and a regression test passes. |
| Staff authentication and password reset | Fortify flows and account-status checks implemented; delivery configuration remains. |
| Admin/Associate/Staff case and user boundaries | Server-side policies/routes and feature tests implemented for case and account operations. Staff public-content editing remains missing. |
| Case records, filters, assigned-case scoping and recoverable deletion | Backend foundation and protected endpoints implemented; full staff UI/history remains. |
| Follow-ups and Nairobi calendar dashboard data | Backend endpoints and timezone/date-boundary tests implemented; staff UI remains. |
| Admin user creation, deactivation and assignment controls | Account APIs and tests implemented; first-admin local provisioning exists. Onboarding mail is not verified. |
| Staff public-content editing, preview, publication and history | Missing. |
| Synthetic acceptance/security testing | 48 tests / 173 assertions pass; fixtures use synthetic data. |
| Production hosting, email, HTTPS, backups, privacy operations | Not configured; deployment blockers. |

See [implementation plan](IMPLEMENTATION_PLAN.md), [task board](../TASK_BOARD.md), and BOOT-01 in [the bootstrap decision record](decisions/BOOTSTRAP_DECISION.md).
