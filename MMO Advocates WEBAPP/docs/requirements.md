# V1 requirements checklist

This is the V1 behavior baseline from the supplied PRD, not evidence that the application exists. Implementation status and requirement-by-requirement traceability are recorded in [PROJECT_STATE.md](PROJECT_STATE.md). The current user request authorizes implementation of the staff case-management backend; older draft tiered-scope notes do not defer it.

## Public site
- Home, Services, About, Contact; clear phone call-to-action.
- Include partners and qualifications after verifying the partner-to-qualification mapping.
- Content editor can preview/publish; log publisher and timestamp.
- No booking, client accounts, or payments.

## Staff case management
- Secure login/logout and password reset; optional two-factor authentication.
- Admin: all cases/follow-ups, assignment, user activation and user management.
- Associate: assigned cases only; notes and follow-ups on assigned cases.
- Content editor: public content only; no case records or user management.
- Case search/filters, case detail/history, today's and overdue follow-ups.
- Follow-up deadlines use Africa/Nairobi time; pending items past due are overdue.
- Track actor/time for case, follow-up, and content changes; admin can recover deleted cases.
- HTTPS, hashed passwords, privacy controls, regular backups with retention and restore checks, responsive layouts, and compliance with the Kenya Data Protection Act.

## Out of scope for v1
Booking/scheduling, client portal, payments, document uploads, SMS/email reminders.

## Decisions before implementation
Language/framework, database, HostAfrica deployment topology, initial case-status list, partner qualification mapping, approved logo export, and backup owner/retention.
