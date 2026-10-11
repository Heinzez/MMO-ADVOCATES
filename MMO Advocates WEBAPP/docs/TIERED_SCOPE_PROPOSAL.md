# MMO Advocates — draft tiered scope proposal

> Status update, 11 October 2026: this remains a commercial discussion draft, not an engineering scope authority. The user has authorized implementation of the PRD backend. Package A's public-only restriction and Package B's optional/deferred wording do not apply to the current engineering task. Do not implement booking, client accounts, payments, uploads, reminders, or other features excluded by the PRD.

Date: 10 October 2026
Status: Draft for discussion; not a signed quote, delivery guarantee or implementation authorization.
Commercial reference: provisional 70k; currency, final ceiling, tax treatment and scope allocation unconfirmed. Prices remain TBD. Firm pays domain/hosting and maintenance separately. Neither domain nor hosting is purchased. No spending now.

## Product approach

Deliver a public website first, built on a Laravel foundation that can support separately commissioned React/Inertia modules. Public pages use Blade. Do not develop hidden staff/client/booking functionality without funding and approval. Backend access, routes and permissions must enforce the purchased edition; hiding navigation alone is not sufficient.

This public-only base is smaller than the original staff-system PRD. Future staff-package acceptance should refer to that PRD and approved workflow decisions. A public-only handover must not be described as completion of all original PRD requirements.

Use one maintainable product/repository with modular additions rather than separate divergent copies. Future upgrades require development, testing, data migration where applicable and an agreed quote. Avoid speculative infrastructure and schemas during the base build.

## Package A — professional public website (first delivery)

Price: TBD after currency and agreed content/design scope.

Included:
- Home, Services, About and Contact pages.
- Approved logo, firm introduction, partner biographies/qualifications and practice areas supplied/approved by the firm.
- Clear phone and email links, office information and responsive navigation.
- Consistent professional design, accessible forms/navigation where applicable, and phone/tablet/desktop layouts.
- Basic public search metadata and sitemap/indexing configuration.
- Deployment preparation and one agreed production handover/deployment once the firm funds suitable hosting and separately authorizes deployment.
- Simple content maintained through agreed source/configuration by the maintainer. A staff-editable CMS is not assumed.

Excluded:
- Staff login, case management, editor dashboard/CMS, appointment form/booking, client accounts, payment processing, document uploads, live chat, reminders, external calendar synchronization and submitted enquiry forms.
- Copywriting, professional photography, branding redesign, unlimited revisions and recurring maintenance unless explicitly priced.
- Hosting/domain/email subscriptions, paid templates and third-party service charges.

Acceptance:
- All four pages contain approved accurate information, and phone/email links work.
- Agreed responsive layouts work on phone/tablet/desktop; keyboard navigation, labels, focus and contrast are reviewed.
- No broken internal links or unapproved placeholder copy.
- Public HTML is rendered server-side and metadata is appropriate; no promise of search ranking.
- HTTPS and safe document root are verified during approved deployment; no exposed secrets.
- Build/run/deploy instructions work; final firm content/design approval is recorded.
- No private system or uncommissioned interaction is presented as working.

Design direction, content revision allowance, target browsers and any performance targets should be agreed before a fixed quote. Do not guarantee traffic or client acquisition.

## Package B — website plus private staff system

Price: TBD; quoted as an upgrade to A or a combined delivery.

Included:
- Package A.
- Staff login/logout/password reset; active/inactive account controls.
- Admin, Associate and Content Editor boundaries following the approved matrix.
- Cases with agreed fields, assignments, list/search/filters and detail/history.
- Case notes/follow-ups and today's/overdue dashboard in Africa/Nairobi time.
- Audit actor/timestamp for agreed changes; admin-only recoverable case deletion.
- Admin staff management and public content editing/preview/publishing under agreed approval rules.
- Staff onboarding and operational/security acceptance checks.

Excluded:
- Client logins, booking, payments, uploads, automatic follow-up reminders, live chat, integrations and optional 2FA unless explicitly included.
- Migration/cleansing of old records unless separately assessed.

Acceptance:
- Approved workflows work end-to-end using synthetic fixtures.
- Associates cannot read/change unassigned cases through direct requests, lists, search, nested resources or history.
- Content Editors cannot access case/user management; anonymous/inactive users cannot access private functions.
- Audit/recovery, reset-token lifecycle and Nairobi boundary tests pass.
- Published-only content appears publicly; confidential records do not enter public props/pages/cache/logs.
- Staging, automatic backups and an isolated restore are verified before production use.
- Firm approves account/workflow rules and staff training/handover.

Dependencies: case statuses/validation, assignment multiplicity, allowed actions, concurrency rules, reset/session policy, publication authority, retention/privacy and operating owner.

## Add-on C — booking

Price: TBD, separate from A/B. May be added to A without implementing the full case system, but requires a small protected appointment-management workflow.

Recommended first scope:
- Public appointment request with minimal name/contact/preferred date or slot/category fields.
- Explicit notice that a request is not confirmed until staff accept it.
- Restricted staff list/detail with confirm/decline/reschedule status workflow.
- Agreed confirmation mechanism; email included only if scoped and verified.
- Validation, abuse/rate limiting, privacy notice and retention policy.

Avoid requesting confidential case narratives through an open form. Client accounts are not required for this initial version.

Excluded unless upgraded:
- Guaranteed instant calendar reservations, Google/Microsoft calendar synchronization, automated reminders, payments, video meeting provisioning, multi-office availability engines and client portal.

Acceptance:
- Requests are recorded once; duplicate submissions/retries are handled deliberately.
- Staff can securely manage status; public users cannot view other requests.
- Timezone and confirmation wording are accurate; declined/rescheduled states are clear.
- Any promised email delivery is tested; failures are visible to staff and do not falsely claim confirmation.
- Abuse controls and approved privacy/retention behavior are tested.

Full real-time scheduling is a higher-scope variant requiring availability rules, slot conflicts, cancellation rules and concurrency tests. Quote it separately.

## Add-on D — client portal

Price: TBD. For case-linked information, depends on B or an explicitly scoped alternative backend record model. Booking-only account access is a different, narrower module.

Recommended first scope:
- Verified invited client accounts, login/reset and revocation.
- Client-to-case access mapping approved by staff.
- Only explicitly approved client-facing updates/status and upcoming appointments.
- Staff publication of client-visible updates, separate from internal notes.
- Client onboarding and access-event/audit behavior agreed with the firm.

Excluded:
- Internal case notes/history, automatic unrestricted case records, other clients' details, documents/uploads/downloads, messaging/live chat, payments and legal self-service workflows unless separately commissioned.

Acceptance:
- Direct identifier substitution cannot reveal another client's case or appointment.
- Unpublished/internal notes and fields are never sent to the client browser.
- Invitation/reset/revocation and account-to-case linkage are tested.
- Staff can preview approved client-visible information without bypassing access boundaries.
- Firm approves identity verification, data visibility and privacy/retention rules.

## Later modules — not included now

Live chat, reminders, calendar integrations, payments, document workflows and mobile/API access can be added through separate change requests. Each requires a scope, price, privacy/security review, recurring-cost assessment, tests and hosting reassessment. 'Flexible foundation' is not a promise that all future features are free or require no architectural work.

## Handover for the contracted edition

- Firm-owned domain, hosting and essential service accounts, with delegated developer access.
- Source code and agreed repository/license ownership; disclose third-party licenses.
- Dependency locks, environment template without secrets, build/deploy/run instructions.
- Configuration/account inventory and secure credential handover outside chat/documents.
- Approved assets/content and explanation of how updates are made.
- Database schema/migrations and backup/restore runbook where the edition uses a database.
- Deployment rollback instructions and known limitations.
- Training for commissioned staff/editor/client-administration functions.
- Recorded acceptance, support contact and responsibility matrix.

Source ownership/payment milestones, support window and final deployment count need contract agreement. No deployment is authorized by this proposal.

## Separately paid hosting and maintenance

Firm pays: domain registration/renewal, hosting, applicable business email/SMTP, backup storage, paid provider services and approved recurring features.

Maintenance scope/price TBD: security/dependency updates, monitoring, backup checks/restore rehearsals, minor content changes allowance and incident response. New features, major redesign and bulk data cleanup are separate work.

State who patches the operating system, handles incidents, maintains DNS/certificates, rotates secrets and performs restores. Provider management is not the same as application maintenance. Define support hours, response targets and an agreed post-acceptance defect period; do not promise indefinite support.

## Commercial decisions before final quote

1. Currency and confirmed budget ceiling.
2. Package A only now versus a funded combination/add-on.
3. Approved design/content deliverables and revision allowance.
4. Firm sign-off authority, milestones and acceptance/payment terms.
5. Deployment/handover inclusion, maintenance scope and defect-support period.
6. HostAfrica plan evidence and operating responsibilities.

No numeric package prices are assigned until those inputs support a realistic estimate. Confidential-data systems must not be under-scoped simply to fit an arbitrary price.
