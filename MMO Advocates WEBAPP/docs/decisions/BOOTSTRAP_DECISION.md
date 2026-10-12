# Architecture & Bootstrap Decision Record: BOOT-00

**Status:** APPROVED FOR STAGING (Awaiting ENV-01 Execution Method Selection)  
**Date:** 11 October 2026  
**Project:** MMO Advocates LLP Web Application & Case Management System  
**Document:** `docs/decisions/BOOTSTRAP_DECISION.md`

---

## 1. Verified Local Tooling

An empirical inspection of the local environment (`C:\Users\AMREF\Projects\codex-test\MMO Advocates WEBAPP`) was conducted on 11 October 2026.

| Tool | Status | Version / Path | Execution Capabilities & Verification |
| :--- | :--- | :--- | :--- |
| **Node.js** | Available | `v24.13.0` (`C:\nvm4w\nodejs\node.exe`) | Full native execution verified. |
| **npm** | Available | `11.21.0` (`C:\nvm4w\nodejs\npm.ps1`) | Full native execution verified. Uses `package-lock.json`. |
| **PHP** | **Absent on PATH** | None | `Get-Command php` failed. PHP is not installed or configured on the system PATH. |
| **Composer** | **Absent on PATH** | None | `Get-Command composer` failed. Composer is not available natively. |
| **Docker CLI** | Available | `29.1.3, build f52814d` | Client CLI present in `C:\Program Files\Docker\Docker\resources\bin\`. |
| **Docker Engine** | **Active & Verified** | Server `29.1.3` (Docker Desktop, WSL2 Linux 6.6.87.2) | **Verified container execution.** Successfully pulled `alpine:latest` and executed `echo "Container execution verified"` with exit code 0. |
| **Python** | Available | `3.11.9` | Present on system PATH. |

### Tooling Conclusion
Native Windows PATH contains modern Node.js and npm for frontend asset compilation via Vite, but lacks native PHP and Composer. However, Docker Desktop 29.1.3 is active and verified capable of executing containers. Local PHP 8.3+ and Composer commands can be reliably executed via lightweight Docker containers or by provisioning PHP 8.3 onto the Windows host.

---

## 2. HostAfrica Hosting Facts & Unknowns

Researched directly from official HostAfrica documentation (cPanel & Cloud environments):

### A. Verified Facts (Official Documentation)
1. **PHP Versions:** HostAfrica cPanel supports configurable PHP versions via **MultiPHP Manager** and **Select PHP Version**. Supported versions include actively maintained PHP 8.2, 8.3, and 8.4.
2. **PHP Extensions:** Standard required Laravel extensions (`pdo_mysql`, `mbstring`, `openssl`, `tokenizer`, `xml`, `ctype`, `json`, `bcmath`, `fileinfo`, `curl`) are available and togglable in the cPanel PHP selector.
3. **Database Engine:** MySQL 8.0 / MariaDB is supported and managed via the cPanel MySQL Database Wizard and phpMyAdmin.
4. **SSH Access:** SSH key management is available via the cPanel "SSH Access" module, enabling terminal-based administration and execution of `php artisan` commands.
5. **Laravel Public Root:** HostAfrica supports serving Laravel from the `public/` directory by deploying the application core above `public_html` (e.g. `/home/username/laravel_app`) and creating a symbolic link:
   ```bash
   ln -s /home/username/laravel_app/public /home/username/public_html
   ```
   (or using documented `.htaccess` mod_rewrite fallback).
6. **SSL Certificates:** Automated SSL certificates are provided via **AutoSSL** (Let's Encrypt / cPanel SSL) and managed in the SSL/TLS Manager.
7. **Backups & Restoration:** Automated daily backups with point-in-time account, file, and database recovery are provided via **JetBackup 5** in cPanel (typically 7-day daily retention).
8. **Cron / Scheduled Tasks:** Full cron job scheduling is supported in cPanel, enabling Laravel scheduled tasks:
   ```bash
   * * * * * php /home/username/laravel_app/artisan schedule:run >> /dev/null 2>&1
   ```

### B. Explicitly Marked Unknowns (Pending Account Confirmation)
1. **Purchased Plan Tier:** Exact hosting product (e.g., Shared cPanel Starter vs Business vs Cloud Linux VPS) remains unconfirmed by the firm.
2. **SSH Terminal Policy:** Certain low-tier shared hosting plans disable SSH terminal access by default until requested via support ticket.
3. **Default CLI PHP Binary:** The default CLI path in shared SSH sessions can default to system PHP unless explicitly aliased to the selected MultiPHP binary (e.g. `/usr/local/bin/ea-php83` or `/opt/cpanel/ea-php83/root/usr/bin/php`).
4. **Outbound Transactional SMTP:** Confirmation needed on whether external SMTP ports (587/465) are open for third-party transactional email providers (SendGrid, Postmark) or restricted to local cPanel Exim mail.

---

## 3. Selected Framework & Rationale

### Selected: **Laravel 13 with Official React Starter Kit, PHP 8.3+, and Blade Public Pages**

### Rationale & Comparison:
1. **Rejection of Laravel 11 as Default:**  
   Laravel 11 was released in early 2024 and is superseded. Greenfield software built in late 2026 should not default to a legacy framework generation.
2. **Laravel 13 vs Laravel 12:**  
   * **Laravel 12** (released February 2025) requires PHP 8.2+.
   * **Laravel 13** (released March 2026) is the active current release and requires **PHP 8.3+** (fully compatible with PHP 8.3, 8.4, and 8.5).
   * Because HostAfrica natively supports PHP 8.3 in MultiPHP Manager, and our local Docker engine executes PHP 8.3 without restriction, there is no technical barrier or compatibility restriction justifying a downgrade to Laravel 12.
3. **Official React Starter Kit Benefits:**  
   * Pre-configured with **React 19**, **Inertia.js**, and **TypeScript**.
   * Integrates **Tailwind CSS v4** featuring a **CSS-first architecture**: theme tokens are configured directly in `resources/css/app.css` using `@import "tailwindcss";` and `@theme`, completely removing the need for a legacy `tailwind.config.js`.
   * Standardized Vite integration via `@tailwindcss/vite` using `package.json` and `package-lock.json`.
   * Ships complete, security-hardened authentication scaffolding (login, registration, password reset, profile management) with pre-built Inertia layouts and types, eliminating dozens of hours of repetitive boilerplate code.
4. **Hybrid Blade + React Architecture:**  
   * **Public Website (`/`, `/services`, `/about`, `/contact`):** Rendered server-side using Laravel Blade templates sharing the compiled Tailwind CSS bundle. Zero client-side JavaScript hydration bloat, maximum SEO and accessibility, ultra-fast initial paint.
   * **Staff Portal (`/staff/*`):** Rendered via React and Inertia.js components for reactive tables, case filters, activity timelines, and modal dialogs.
   * **Single Deployment:** No persistent Node.js server required in production. Assets are compiled at build time by Vite, and served entirely by PHP/Nginx/Apache.

---

## 4. Required Environment Changes

To execute the Laravel 13 bootstrap without violating system integrity:

* **Primary Recommendation (Containerized Tooling):**  
  Utilize Docker 29.1.3 (already running and verified) to execute Composer and Artisan commands inside a clean `composer:2.8` or `php:8.3-cli` container, while utilizing the native Node.js 24 and npm 11 on the Windows host for fast Vite builds and watch scripts.
* **Alternative (Native Host Provisioning):**  
  If container execution is disliked by the user, install PHP 8.3 (with `pdo_mysql`, `mbstring`, `openssl`, `curl`, `fileinfo`, `xml`) and Composer directly onto the Windows host PATH.

---

## 5. Repository & Git Worktree Layout

### Parent Git Context
* **Git Root:** `C:\Users\AMREF\Projects\codex-test`
* **Application Path:** `C:\Users\AMREF\Projects\codex-test\MMO Advocates WEBAPP`
* **Rule:** Unrelated parent files must be preserved. Never execute indiscriminate `git add .` from the parent root. All commits must isolate the application directory and the shared task board.

### Worktree Structure
To enforce strict boundary isolation and prevent concurrent edit collisions, each specialist agent operates in an isolated worktree with their working directory pointing directly into the application subfolder:

```text
C:\Users\AMREF\Projects\codex-test\                     <-- Git Root (main branch)
├── TASK_BOARD.md
├── MMO Advocates WEBAPP/                               <-- Integrated App Baseline
│   ├── app/
│   ├── bootstrap/
│   ├── config/
│   ├── database/
│   ├── resources/
│   │   ├── css/app.css                                 <-- Tailwind v4 @theme tokens
│   │   ├── views/public/                               <-- Strawberry (Blade)
│   │   └── js/Pages/Staff/                             <-- Dashboard UI (React)
│   ├── routes/
│   ├── composer.json
│   ├── package.json
│   └── package-lock.json
│
└── .worktrees/
    ├── feat-backend/                                   <-- Codex Worktree
    │   └── MMO Advocates WEBAPP/ (Cwd: backend core)
    ├── feat-public-blade/                              <-- Strawberry Worktree
    │   └── MMO Advocates WEBAPP/ (Cwd: public views)
    ├── feat-dashboard-ui/                              <-- Dashboard UI Worktree
    │   └── MMO Advocates WEBAPP/ (Cwd: React staff portal)
    └── test-qa/                                        <-- Browser QA Worktree
        └── MMO Advocates WEBAPP/ (Cwd: E2E test specs)
```

---

## 6. Exact Bootstrap Sequence (When Authorized)

When implementation is explicitly authorized, execute the following commands in order:

### Step 1: Stage Initial Git Baseline on Main
```powershell
cd "C:\Users\AMREF\Projects\codex-test"
git add "TASK_BOARD.md" "MMO Advocates WEBAPP/AGENTS.md" "MMO Advocates WEBAPP/docs" "MMO Advocates WEBAPP/.agents"
git commit -m "chore: establish baseline planning documentation and agent definitions"
```

### Step 2: Initialize Laravel 13 Application Scaffold
```powershell
cd "C:\Users\AMREF\Projects\codex-test\MMO Advocates WEBAPP"
# Pull Laravel 13 via containerized Composer into temporary directory and align structure
docker run --rm -v "${PWD}:/app" -w /app composer:2.8 create-project laravel/laravel:^13.0 .tmp_laravel --prefer-dist --no-install
# Merge scaffold files into application root
Get-ChildItem -Path .tmp_laravel -Force | Move-Item -Destination . -Force
Remove-Item -Recurse -Force .tmp_laravel
# Run composer install with PHP 8.3
docker run --rm -v "${PWD}:/app" -w /app composer:2.8 install
```

### Step 3: Install Official React Starter Kit (with Tailwind v4)
```powershell
docker run --rm -v "${PWD}:/app" -w /app composer:2.8 require laravel/breeze --dev
docker run --rm -v "${PWD}:/app" -w /app php:8.3-cli php artisan breeze:install react --typescript --dark --ssr=no
```

### Step 4: Install Frontend Dependencies & Compile Assets
```powershell
npm install
npm run build
```

### Step 5: Environment Setup & Key Generation
```powershell
Copy-Item .env.example .env
docker run --rm -v "${PWD}:/app" -w /app php:8.3-cli php artisan key:generate
```

---

## 7. Acceptance Tests

The bootstrap will be verified against the following pass/fail criteria:

1. **Framework Verification:**  
   `docker run --rm -v "${PWD}:/app" -w /app php:8.3-cli php artisan --version` outputs `Laravel Framework 13.x.x`.
2. **Frontend Manifest Verification:**  
   `package.json` includes `react` (^19.0), `@inertiajs/react`, `@tailwindcss/vite`, and `tailwindcss` (^4.0). Valid `package-lock.json` is generated.
3. **Tailwind v4 Verification:**  
   `resources/css/app.css` defines `@import "tailwindcss";` and `@theme` directives without requiring `tailwind.config.js`.
4. **Vite Build Verification:**  
   `npm run build` exits with code 0 and populates `public/build/` with compiled CSS and JS assets.
5. **Initial Test Suite:**  
   `docker run --rm -v "${PWD}:/app" -w /app php:8.3-cli php artisan test` passes all default authentication tests cleanly.

---

## 8. Remaining Blockers Before Coding Dispatch

This list predates BOOT-01. ENV-01 is resolved with the project-local Docker PHP/Composer runtime. Remaining pre-release inputs are:

1. **HOST-01:** Firm account owner confirmation of the purchased HostAfrica package name and whether SSH is enabled out of the box.
2. **REQ-01:** Confirmation of partner qualification mapping and official vector logo export from `LOGO MMO.docx`.

---

## 9. BOOT-01 Execution Report (12 October 2026)

The earlier proposed scaffold sequence above is superseded. Inspection found the existing Laravel 13 React starter already in `backend/`; it was preserved and extended in place. The official starter conventions and dependency manifests remain authoritative.

### Verified results

| Check | Actual command/result |
|---|---|
| PHP/Composer runtime | `docker compose exec -T app php artisan --version` → Laravel Framework 13.35.0; `composer --version` → Composer 2.10.3; `php -v` → PHP 8.5.11. |
| Required PHP extensions | `docker compose exec -T app php -m` confirmed `pdo_mysql`, `pdo_sqlite`, `mbstring`, `curl`, `dom`, `fileinfo`, `openssl`, `tokenizer`, `xml`, `zip`, and `pcntl` (plus core extensions). |
| Dependency reproducibility | `docker compose run --rm app composer install --no-interaction --prefer-dist` completed from `composer.lock`; `npm ci --no-audit --no-fund` completed with 242 packages from `package-lock.json`. |
| Database | MySQL 8.4.11 reported by `docker compose exec -T db mysql --version`; `docker compose run --rm app php artisan migrate --force` applied all migrations successfully. |
| Tests | `docker compose run --rm app php artisan test` → 48 passed, 173 assertions. Tests use SQLite memory and synthetic factories. |
| Frontend | `npm run build` (the starter's original `vp build` script) → exit 0; production manifest, CSS, JavaScript and font files were written under `backend/public/build/`. |
| HTTP | `docker compose up -d app` succeeded. Windows host requests to `http://127.0.0.1:8000/up` and `/` both returned 200; the home page referenced compiled `/build/assets/`. |

### Failures found and resolved

- First npm registry requests returned `ENOTFOUND`; retries later succeeded. `npm ci` then completed cleanly from the generated lockfile.
- On first MySQL initialization, the healthcheck retry window expired while MySQL was still initializing. Compose now allows a 180-second startup period; the database becomes healthy and dependent commands pass.
- The first Dockerized test run inherited `APP_ENV=local` through `env_file`, causing CSRF 419s (25 failures in 52 tests). Removing `env_file` lets PHPUnit apply its `testing` environment; the next run had 7 failures from obsolete tests that still expected disabled profile/passkey routes and email-verification gating. Those assertions now reflect the intended staff-only scope; the final run passed all 48 tests / 173 assertions.
- Early build attempts referenced Wayfinder routes/screens that were intentionally disabled along with public registration, profile deletion/edit, appearance and passkeys. Wayfinder now invokes Artisan through the Docker PHP service, and the active Inertia resolver excludes those unused screens. The final `vp build` passes. The build prints a non-blocking notice that optional `fontaine` is absent; font assets still compile successfully.

### Project-local Docker setup

`Dockerfile` pins Composer 2.10.3/PHP 8.5.11 by image digest and installs `pdo_mysql` and `pcntl`. `compose.yaml` pins the verified MySQL 8.4.11 image by digest, persists the database and Composer vendor dependencies in named volumes, and binds service ports only to localhost. `.env.example` contains development placeholders, not real credentials. Copy it to ignored `.env` and set local-only DB passwords before first use. Exact setup/start/stop/test/build commands are in `backend/README.md`.

No production deployment or production credentials/data were used. Production hosting, mail delivery, backups and privacy operations remain release blockers.
