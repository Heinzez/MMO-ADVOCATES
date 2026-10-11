# Selected stack direction and unimplemented component architecture

```text
Visitor browser -> Public frontend -> Public content API -> Content service -> Database
Staff browser   -> Staff portal    -> Authenticated API -> Policies/services -> Database
                                                |-> Authentication/session connector
                                                |-> Email connector (password reset only)
                                                |-> Storage connector (brand assets/backups)
Deployment -> HostAfrica (target; topology to confirm)
```

The component separation remains conceptual; no code, schema, or deployment topology exists. The selected product stack is one Laravel application, Blade for public pages, React/Inertia for private application pages, and Tailwind. MySQL remains subject to HostAfrica verification. This user request authorizes the primary engineer to implement the complete PRD backend, superseding older notes that implementation was unauthorized or staff features were deferred. The backend must authenticate staff and authorize every private read/write. Associates are limited to assigned cases. Content editors may manage public content but not case records or user administration. Public responses contain approved content only.
