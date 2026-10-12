# MMO Advocates LLP website and case-management application

The Laravel 13 React/Inertia application lives in the existing `backend/` directory. See the [verified project state](docs/PROJECT_STATE.md), [implementation plan](docs/IMPLEMENTATION_PLAN.md), and [task board](TASK_BOARD.md).

## Local development

PHP and Composer run in the project-local Docker environment; Node.js/npm run natively. Follow [backend setup and commands](backend/README.md). Composer and npm lockfiles make dependency installation reproducible. The local MySQL database and web server bind to loopback, and `.env.example` contains local placeholders only.

From `backend/`, routine commands are:

```powershell
docker compose up -d db app
npm ci
npm run build
docker compose run --rm app php artisan migrate --force
docker compose run --rm app php artisan test
docker compose stop
```

The application responds at `http://localhost:8000`; MySQL is available to host tools at `127.0.0.1:3307`. Tests use synthetic data. Do not use production credentials or client data here.

## Product boundaries

- Visitors use public pages only and cannot register.
- Admins can access all cases and manage staff accounts; Associates can access assigned cases; Staff have no access to case records or user administration.
- Server-side authorization is enforced in Laravel.
- Production deployment, client portal, booking, payments, document uploads, SMS reminders, and production client data are outside this bootstrap.
