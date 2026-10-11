# MMO Advocates LLP — task board

Current state: documentation scaffold only. No application code, selected stack, schema, tests, or deployment configuration. See [verified project state](MMO%20Advocates%20WEBAPP/docs/PROJECT_STATE.md) and [four-day plan](MMO%20Advocates%20WEBAPP/docs/IMPLEMENTATION_PLAN.md).

| ID | Status | Task | Acceptance criteria / dependency |
|---|---|---|---|
| AUDIT-01 | Done | Inspect repository, project docs, PRD, Git, manifests, entry points, tests, schema, and deployment files | Findings in `docs/PROJECT_STATE.md`; no functionality claimed without source evidence |
| ARCH-01 | Next | Confirm stack and HostAfrica capability fit | Written choice of runtime/framework/database/session/deployment topology; hosting supports required app, DB, TLS, storage and backups; decisions recorded before code |
| REQ-01 | Next | Resolve V1 open decisions | Initial case statuses; partner/qualification mapping; approved web logo export; content publish permissions; backup owner/retention documented |
| BOOT-01 | Next | Create the first executable app foundation after ARCH-01 and REQ-01 | One manifest/lockfile and entry point; documented local run/test commands; clean local startup and empty-database migration; no secrets or real client data committed |
| API-01 | Backlog | Define schema, API contracts, and permission matrix | Case/follow-up/user/content/audit schema and route contracts; admin/associate/content-editor permissions cover each operation; reviewed before frontend/backend expansion |
| PUB-01 | Backlog | Implement public pages and content publishing | Home/Services/About/Contact satisfy PRD; only approved published content is public; editor preview/publish and attribution work; responsive acceptance criteria met |
| CASE-01 | Backlog | Implement private case/follow-up workflows | Login/reset, role enforcement, assignment, search/filters, case detail/history, dashboard, user management and admin recovery satisfy PRD using synthetic data |
| OPS-01 | Backlog | Verify security, backups, and staging readiness | Access boundaries and restore procedure verified; TLS and HostAfrica assumptions documented; no production deployment without separate authorization |
