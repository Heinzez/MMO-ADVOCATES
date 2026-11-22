# Deploying the public website to Vercel

This deploys **only the public website** — Home, Services, About and Contact.
Authentication and the staff case-management area are not exposed. Client case
records stay on the firm's own hosting, as the PRD requires.

Verified locally on 23 November 2026: the image builds, the four public pages
return 200, and `/login`, `/dashboard`, `/staff/*`, `/settings/*`, `/user/*` and
`/public-content/*` all return 404 before PHP is reached.

## Why a container, and not the usual Laravel-on-Vercel recipe

Most "Laravel on Vercel" guides use the `vercel-php` community runtime. Do not
use it. That repository was **archived by its owner on 29 October 2026** and is
read-only; its own README now says it "is not supported by Vercel" and directs
new projects to a container runtime instead.

That matters because of PHP's *php2shell* advisory (CVE-2026-109618 and
CVE-2026-109619, disclosed 21 October 2026): two critical remote-code-execution
flaws with working public exploits, fixed only by patching the PHP runtime.
An unmaintained runtime cannot deliver that patch.

This deployment therefore uses Vercel's supported container runtime with
FrankenPHP. **Note that the Container Runtime is in beta.**

## Files

| File | Purpose |
|---|---|
| `backend/Dockerfile.vercel` | FrankenPHP image, PHP 8.4, Composer production install |
| `backend/Caddyfile` | Serves the public paths only; everything else returns 404 |
| `backend/vercel.json` | Declares the container service and routes traffic to it |

`backend/Dockerfile` is the local development image and is not used here.

## One-time setup

1. Install the CLI and sign in. Both steps are interactive, so run them
   yourself:

   ```bash
   npm i -g vercel
   vercel login
   ```

2. Link the project from the repository root:

   ```bash
   vercel link
   ```

   When asked for the **Root Directory**, answer `MMO Advocates WEBAPP/backend`.
   `vercel.json` lives there, not at the repository root.

3. Generate an application key and add it. Laravel needs it to encrypt the
   session cookie; the site will not boot without one.

   ```bash
   cd "MMO Advocates WEBAPP/backend"
   docker compose run --rm --no-deps app php artisan key:generate --show
   vercel env add APP_KEY production
   ```

   Paste the printed `base64:...` value. Use a different key for Preview than
   for Production. Never reuse the key from the staff application.

## Environment variables

Only `APP_KEY` must be set in the Vercel dashboard. The image already sets:

| Variable | Value | Why |
|---|---|---|
| `APP_ENV` / `APP_DEBUG` | `production` / `false` | Never show stack traces publicly |
| `LOG_CHANNEL` | `stderr` | Sends logs to Vercel runtime logs |
| `SESSION_DRIVER` | `cookie` | No database or shared session store needed |
| `CACHE_STORE` / `QUEUE_CONNECTION` | `array` / `sync` | No Redis, no queue worker |
| `PUBLIC_CONTENT_OVERRIDES` | `false` | Skips the published-content lookup entirely |

Set `APP_URL` to the final domain once it is assigned.

## Deploy

```bash
cd "MMO Advocates WEBAPP/backend"
vercel deploy          # preview
vercel deploy --prod   # production
```

To test the exact image before deploying:

```bash
docker build -f Dockerfile.vercel -t mmo-public-site .
docker run --rm -p 8099:8080 -e APP_KEY="base64:..." mmo-public-site
```

## What this deployment deliberately cannot do

- **No database.** The four pages carry their own copy, so none is rented and
  no client data is stored at Vercel. The website-content module's published
  overrides are therefore not applied here; edits made in the staff CMS will
  not appear on this deployment.
- **No staff access.** The allowlist in `Caddyfile` refuses every private path
  before PHP runs, so an application routing mistake cannot expose a private
  page from this deployment.
- **No scheduler or queue workers**, and the container filesystem is not
  durable. Nothing on the public site needs either.

### Turning published content on later

Only if the firm accepts a hosted database: attach a managed MySQL, set the
`DB_*` variables and `PUBLIC_CONTENT_OVERRIDES=true`. The `pdo_mysql` extension
is already installed in the image. Run migrations as a separate step —
never at container startup.

## Keeping it patched

The base image tag floats to the newest PHP 8.4 patch, so **a rebuild picks up
PHP security fixes**. Redeploy after any PHP security release; application code
changes cannot fix a runtime vulnerability.

## Rollback

Promote the previous deployment from the Vercel dashboard, or
`vercel rollback`. Deployments are immutable, so rolling back cannot lose data —
this deployment holds none.

## Still required for the full system

The staff case-management system, its MySQL database, backups and SMTP for
password resets remain to be deployed on HostAfrica per the PRD. This Vercel
deployment does not replace that work.
