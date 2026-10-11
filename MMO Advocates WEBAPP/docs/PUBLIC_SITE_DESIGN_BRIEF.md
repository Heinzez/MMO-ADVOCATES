# Public-first website design brief

Date: 10 October 2026
Status: Planning only; no mockup/application implementation or agent launch authorized.

## Objective

Present MMO Advocates professionally, help prospective clients understand the firm's services, and make phone/email contact easy. Deliver the public-only edition first, not the full staff-system PRD. Preserve a clean Laravel foundation for separately commissioned React/Inertia staff, booking and client modules.

## Design direction — proposed, requires firm approval

Restrained, credible and contemporary rather than ornate. Generous spacing, readable text, clear hierarchy, consistent buttons and simple navigation. Proposed palette: deep navy/charcoal with warm neutral backgrounds and a restrained accent drawn from the approved logo. Do not finalize brand colors until the logo is reviewed. Consider a refined heading typeface with a highly readable body face; choose properly licensed fonts and avoid unnecessary external loading.

Use authentic approved partner portraits or office imagery if supplied and licensed. Do not invent partners, credentials, awards, testimonials, outcomes, statistics or client relationships. Avoid stock imagery that suggests endorsement or actual staff. No autoplay media, distracting motion or fake trust badges. Respect reduced-motion preferences.

Shared design tokens for typography, spacing, colors, radii and states should later support Blade and React. They are visual conventions, not an instruction to install speculative React modules now.

## Information architecture

Public routes proposed: /, /services, /about, /contact. Shared header with logo, four-page navigation and phone action; footer with verified contact details, navigation and approved legal/privacy information. Mobile navigation must remain keyboard accessible. No booking/client/staff links until the corresponding module is funded and implemented.

## Page content checklist

### Home

- Approved legal/display firm name and reviewed web-ready logo.
- Short, accurate introduction and positioning approved by the firm.
- Prominent call action and secondary Services link.
- Scannable practice-area summary linking to Services.
- Brief approved firm/partner introduction linking to About.
- Verified office/location summary and contact action.
- No promises of results, unverifiable claims or fabricated social proof.

### Services

PRD-derived candidate practice areas: conveyancing; criminal; environmental/land; succession; civil litigation; small claims; divorce; child custody. Verify that all remain current before publishing.

- Approved service labels and short plain-language descriptions.
- Explain how to contact the firm without collecting confidential facts online.
- Distinguish general information from advice where firm-approved wording requires it.
- Consistent navigation back to Contact; no unsupported online-service claims.

### About

- Approved firm background and legal identity.
- Partner names, roles, qualifications and biographies mapped to the correct person.
- Approved areas of work: litigation, conveyancing, drafting, mediation and research, subject to current confirmation.
- Portrait permission/credits where supplied.
- Values/approach only as approved text, not inferred claims.

### Contact

- Verified public phone number with tel link; approved email with mailto link.
- Verified office address, opening hours and visitor instructions if supplied.
- Optional external map link; do not embed a third-party tracking map by default.
- Brief reminder not to send sensitive information through unapproved channels, if the firm approves it.
- No submitted contact form, booking widget or live chat in base scope.

### Shared/public metadata

- Page titles/descriptions, canonical URLs after domain selection and sitemap.
- Proper heading hierarchy, descriptive links and meaningful image alt text.
- Approved footer/privacy wording. No promise of search rank or automatic legal compliance.
- No analytics, advertising scripts or nonessential trackers by default. If introduced later, review consent/privacy requirements and costs explicitly.

## Content approval workflow

Maintain an approval checklist with field/page, content owner, supplied text/source, reviewer, approval date and outstanding questions. No fabricated values. Development placeholders must be marked and cannot reach production.

Firm must confirm its content approver, public details, partner qualifications and final logo export. Existing Word/EMF branding is source material, not yet an approved web asset. A staff-editable CMS is excluded; base content changes use the agreed maintainer/source workflow.

## Responsive and accessibility acceptance

Proposed review widths: 360px phone, 768px tablet and 1440px desktop, plus testing between them. Agree browser/device matrix before implementation; proposed current Chrome, Firefox, Edge and Safari coverage is not an assertion those tests have run.

- No horizontal page overflow at agreed widths, including long names/contact text.
- Navigation works with keyboard and touch; focus is visible, mobile menu has correct state/labels, and focus is not trapped.
- Text remains usable at 200% zoom; layout tolerates long content.
- Contrast target: WCAG AA ratios for text and interactive controls; verify during implementation rather than claim certification.
- Images have correct alt treatment; heading order and landmark structure are meaningful.
- Tap targets are comfortably usable, with a proposed 44px sizing target for main controls.
- Reduced-motion settings are respected; no essential information depends on animation.

## Functional acceptance

- Four pages and internal navigation work; unknown URLs show a useful 404 response.
- Phone/email actions point to firm-approved destinations; visible contact data matches links.
- Approved public text is present in server-rendered Blade HTML without requiring JavaScript.
- Mobile navigation works; critical content/contact access remains usable when enhancement scripts fail.
- No broken images, development placeholders, nonworking action buttons or links to uncommissioned modules.
- No submitted form/chat/booking/customer login in public-only scope.

## Performance and search acceptance

- Optimize image format/dimensions and avoid unnecessary frontend dependencies or third-party scripts.
- Load only needed assets/fonts; respect licensing and avoid layout jumps from images/fonts.
- Verify titles/descriptions, sitemap, canonical domain, production indexing and 404 behavior.
- Keep staging access-controlled and non-indexed. robots directives alone are not protection.
- Measure representative pages under recorded conditions; agree numeric budgets after prototype/hosting evidence. No current score or speed guarantee is claimed.

## Hosting/security release acceptance

- Compatible Laravel/PHP runtime and safe public-only document root verified.
- HTTPS/renewal and domain/DNS ownership confirmed; debug disabled in production.
- No .env, source archives, keys, logs or private files publicly downloadable.
- Dependencies locked and reviewed; no unapproved third-party scripts or paid services.
- Clean install/build and deployment/rollback commands verified and documented once the app exists.
- Site backup/recovery arrangements defined even if the base edition has no business database.
- Firm-owned accounts with delegated, revocable maintainer access. No hidden developer backdoor.

## Upgrade seams

- Keep public Blade layouts/components and approved content separate from later private module views/data.
- Share visual tokens/assets with React/Inertia without sharing confidential view models.
- Use future Laravel services/policies for staff/booking/client business rules; no direct database access from public UI.
- Add migrations, auth routes and feature access only when the module is commissioned.
- Reserve sensible route namespaces in architecture documentation only; no exposed placeholder endpoints required.
- Later staff content publishing can replace the base source-maintenance flow without redesigning public page templates.
- Do not add speculative tables, queues, websocket servers, API services or client accounts merely for flexibility.

## Open planning decisions

Content approver and final brand/style approval; supplied copy/assets; revision allowance; target browser matrix; final scope price/currency; domain and compatible HostAfrica plan; ownership/support terms. Remote developer access is planned through SSH/SFTP or VS Code Remote SSH, as described in REMOTE_DEVELOPER_ACCESS_PLAN.md; host compatibility and delegated access approval remain unresolved. It is separate from public website scope.

## Completion evidence for future delivery

Record approved content, screenshots at agreed widths, accessibility checks, link checks, actual build/test results, server-rendered output verification, hosting/TLS/security checks and firm acceptance. This document defines future checks; none are claimed as executed now.
