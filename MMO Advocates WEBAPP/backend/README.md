# Backend local development

The Laravel 13 application lives here. PHP and Composer run in the project-local Docker development image; Node.js and npm run natively on Windows for Vite asset compilation. Compose exposes the web app at `http://localhost:8000` and MySQL at `127.0.0.1:3307`.

## First-time setup (PowerShell)

Run these commands from this directory:

```powershell
Copy-Item .env.example .env
```

Edit `.env` and replace `DB_PASSWORD` and `DB_ROOT_PASSWORD` with local development-only values. Keep `.env` out of version control. Then run:

```powershell
docker compose build app
docker compose up -d db
docker compose run --rm app composer install --no-interaction --prefer-dist
docker compose run --rm app php artisan key:generate
docker compose run --rm app php artisan migrate --force
npm ci
npm run build
docker compose up -d app
```

The Docker image uses Composer 2.10.3 (PHP 8.5 CLI) with `pdo_mysql` and `pcntl`. MySQL 8.4 and the Composer vendor directory use named Docker volumes. The checked-in `.env.example` contains placeholders, not deployable credentials. There are no preloaded users or client records; tests use synthetic data.

After migrations, the first local administrator can be created deliberately with `docker compose run --rm app php artisan mmo:create-first-admin`. It prompts for the administrator details and password; there is no seeded default account.

## Routine commands

```powershell
# Start the app and database
docker compose up -d db app

# Apply pending migrations
docker compose run --rm app php artisan migrate --force

# Run the Laravel test suite
docker compose run --rm app php artisan test

# Reinstall locked Composer dependencies
docker compose run --rm app composer install --no-interaction --prefer-dist

# Reinstall locked npm dependencies and compile production assets
npm ci
npm run build

# Stop containers while preserving development data
docker compose stop

# Remove containers and network while preserving named volumes
docker compose down
```

The development-only HTTP service binds to loopback at `http://localhost:8000`; MySQL binds to `127.0.0.1:3307`. Do not put real client or production data in this environment.
