# MMO Advocates LLP — Design System & Visual Specification

**Version:** 1.0.0  
**Status:** Approved Visual Specification (Task DES-01)  
**Date:** October 2026  
**Audience:** Frontend Engineers (Blade Public Site & React Staff Portal), QA Engineers, Content Editors  
**Authoritative Stylesheet:** `backend/resources/css/app.css` (Tailwind CSS 4 CSS-First `@theme`)

---

## 1. Visual Direction & Brand Philosophy

MMO Advocates LLP is an established, reputable legal practice located at Kimathi House in Nairobi, Kenya. The digital presence across both the public-facing website and the private staff case-management dashboard must convey:

* **Stature & Dignity:** The visual tone reflects the seriousness, authority, and discretion of the legal profession.
* **Editorial Clarity:** Content is structured with generous whitespace, deliberate typographic scale, and disciplined layout rhythm. Legal information is organized for scanning and reading without distraction.
* **Warmth & Grounded Authority:** Rooted in deep navy and charcoal foundations balanced by warm neutral surfaces (creams and soft parchment) and an authentic warm amber gold accent drawn directly from the firm's official logo.
* **Strict Anti-Patterns:**
  * **No generic SaaS tropes:** Avoid bubbly pill badges, glossy neon gradients, dark glassmorphism, floating blur orbs, and playful micro-animations.
  * **No deceptive social proof:** Absolutely zero fake testimonials, simulated client reviews, fabricated statistics, artificial win rates, or generic stock photos depicting pretend lawyers.

---

## 2. Official Brand Assets & Logo Specification

### A. Asset Inventory & Locations

| Asset | File Path | Format / Dimensions | Purpose |
| :--- | :--- | :--- | :--- |
| **Official Brand Logo** | `backend/public/images/brand/logo.png` | PNG (RGBA Transparent, 624×492 @ High-DPI) | Master brand logo for header, footer, print, and splash screens. |
| **Vector Container** | `backend/public/images/brand/logo.svg` | SVG (`viewBox="0 0 624 492"`) | Standard SVG asset embedding the authentic master artwork for high-DPI scalability. |
| **Favicon** | `backend/public/favicon.svg` | SVG | Browser tab icon and mobile shortcut icon. |

### B. Logo Composition & Authentic Heraldry
Derived directly from the source document `LOGO MMO.docx` (GDI Metafile `word/media/image1.emf`):
1. **Laurel Wreath:** Symmetrical twin laurel branches enveloping the mark in Royal Sapphire Blue (`#1c66ab`), symbolizing victory, justice, and honor.
2. **Ionic Column & Arches:** A classical Greek column with an ionic volute capital and twin arches in Deep Navy (`#0f294a`), representing institutional stability.
3. **Scales of Justice:** Suspended scale pans and finial flame rendered in Warm Amber Gold (`#d97706` / `#fab53b`), representing balanced fairness and precision.
4. **Firm Wordmark:** "MMO ADVOCATES LLP" in bold, high-contrast Navy, underlined by a crisp Amber Gold rule.

### C. Technical Vector Limitations & Preservation Notice
The original source artwork in `LOGO MMO.docx` was authored as a Windows Enhanced Metafile (EMF) composed of 100 sliced GDI DIB bitmap records with clipping paths rather than pure Bezier vector paths. In accordance with strict integrity instructions, no speculative redrawing or lossy vector tracing was invented. The authentic, high-resolution master raster was composited and preserved with alpha transparency.

---

## 3. Brand Color Palette & Semantic Tokens

All tokens are defined in `backend/resources/css/app.css` using Tailwind CSS v4's CSS-first `@theme` and semantic CSS variables.

### A. Core Palette Table

| Token Name | CSS Variable | Hex / Oklch Value | Role & Usage | WCAG AA Contrast |
| :--- | :--- | :--- | :--- | :--- |
| **Brand Navy** | `--brand-navy` | `#0f294a` | Primary brand color; headings, primary buttons, headers, staff sidebar. | 14.1:1 on White (Pass AAA) |
| **Brand Blue** | `--brand-blue` | `#1c66ab` | Secondary blue (laurel wreath); link highlights, active tabs, focus rings. | 5.8:1 on White (Pass AA) |
| **Brand Gold** | `--brand-gold` | `#d97706` | Accent color (scale pans & rule); key CTA badges, subtle borders, callouts. | 3.2:1 (large text / graphic elements) |
| **Brand Gold Hover**| `--brand-gold-hover`| `#b45309` | Hover/active state for gold interactive elements. | 4.6:1 on White (Pass AA) |
| **Brand Charcoal** | `--brand-charcoal` | `#1e293b` | Dark neutral; primary body copy, high-readability text. | 15.6:1 on Cream (Pass AAA) |
| **Warm Cream** | `--brand-cream` | `#fbfaf8` | Editorial canvas background; soft off-white eliminating stark glare. | Foundation surface |
| **Warm Surface** | `--brand-surface` | `#f4f1ea` | Secondary neutral; card containers, table headers, alternating rows. | Subtle contrast container |
| **Muted Border** | `--border` | `#e2ddd5` | Subtle dividers, card outlines, table gridlines. | Non-distracting separator |

### B. Semantic Theme Pairings (Light Mode)

* **Canvas (`bg-background`):** `#fdfcfb` (Soft editorial white)
* **Text (`text-foreground`):** `#0f172a` (Deep Slate / Charcoal)
* **Primary Interactive (`bg-primary`, `text-primary-foreground`):** `#0f294a` (MMO Navy) with `#ffffff` text.
* **Secondary Surface (`bg-secondary`, `text-secondary-foreground`):** `#f4f1ea` (Warm stone) with `#0f294a` text.
* **Muted Text (`text-muted-foreground`):** `#475569` (Slate 600, contrast 5.3:1 on white).
* **Focus Ring (`ring-ring`):** `#1c66ab` (Sapphire Blue, 2px offset).
* **Destructive (`bg-destructive`, `text-destructive-foreground`):** `#b91c1c` (Deep crimson) with `#ffffff`.

### C. Dark Mode Theme Pairings (Staff Dashboard Night Mode)

* **Canvas (`bg-background`):** `#09131f` (Deepest Midnight Navy)
* **Text (`text-foreground`):** `#f1f5f9` (Crisp Slate 100)
* **Card / Popover (`bg-card`):** `#0d1e33` (Elevated Navy Surface)
* **Primary Interactive (`bg-primary`):** `#38bdf8` (Bright Sky / Legal Blue for high contrast against dark ground).
* **Sidebar (`bg-sidebar`):** `#060e17` (Deepest Obsidian Navy).

---

## 4. Typography System

### A. Font Families

1. **Editorial Serif (`--font-serif`):**
   * CSS Stack: `'Cinzel', 'Playfair Display', Georgia, Cambria, 'Times New Roman', serif`
   * Usage: Public site hero headlines, section titles, practice area showcase titles, partner names.
   * Aesthetic: Dignified, classic legal tradition, timeless typographic presence.
2. **Clean Sans-Serif (`--font-sans`):**
   * CSS Stack: `'Instrument Sans', ui-sans-serif, system-ui, sans-serif`
   * Usage: Body text, navigation links, buttons, form inputs, dashboard data tables, case timeline notes.
   * Aesthetic: Highly legible, open apertures, excellent scannability at 14px–16px.

### B. Type Scale & Hierarchy

| Level | Size (Desktop / Mobile) | Line Height | Tracking | Font Family | Tailwind Utility |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Hero Display** | 44px / 32px | 1.15 | `-0.02em` | Serif | `text-3xl md:text-5xl font-serif tracking-tight font-medium` |
| **Heading 1 (H1)** | 36px / 28px | 1.2 | `-0.015em`| Serif | `text-2xl md:text-4xl font-serif tracking-tight font-medium` |
| **Heading 2 (H2)** | 28px / 22px | 1.25 | `-0.01em` | Serif | `text-xl md:text-3xl font-serif font-medium` |
| **Heading 3 (H3)** | 20px / 18px | 1.35 | `0` | Sans / Serif | `text-lg md:text-xl font-semibold` |
| **Heading 4 (H4)** | 16px / 15px | 1.4 | `0.01em` | Sans (Uppercase) | `text-sm font-semibold uppercase tracking-wider` |
| **Body (Lead)** | 18px / 16px | 1.6 | `0` | Sans | `text-base md:text-lg leading-relaxed text-slate-700` |
| **Body (Default)** | 15px / 14px | 1.55 | `0` | Sans | `text-sm md:text-base leading-normal text-slate-800` |
| **Small / Caption**| 13px / 12px | 1.45 | `0.01em` | Sans | `text-xs text-muted-foreground` |

---

## 5. Spacing, Grid & Layout Conventions

### A. Spacing Scale
Based on an 8-point baseline grid with a 4-point half-step:
* `4px` (`gap-1` / `p-1`): Micro badge padding, inline icon gap.
* `8px` (`gap-2` / `p-2`): Compact form spacing, button icon spacing.
* `12px` (`p-3`): Input field padding, compact table cell padding.
* `16px` (`p-4` / `gap-4`): Default card padding, grid gutter on mobile.
* `24px` (`p-6` / `gap-6`): Desktop card padding, section gap.
* `32px` (`p-8` / `gap-8`): Standard desktop component gap.
* `48px`–`64px` (`py-12`–`py-16`): Public section vertical rhythm.
* `80px`–`96px` (`py-20`–`py-24`): Hero section spacing.

### B. Page Widths & Containers
* **Max Content Width (Public Marketing):** `max-w-7xl` (`1280px`), centered (`mx-auto`).
* **Editorial Reading Width (Text & Biographies):** `max-w-3xl` (`768px`) for optimum 65–75 character line length.
* **Staff Dashboard Container:** `w-full px-4 md:px-8 max-w-7xl mx-auto`.
* **Viewport Gutters:**
  * Mobile (< 640px): `px-4` (`16px`)
  * Tablet (640px–1024px): `px-6` (`24px`)
  * Desktop (>= 1024px): `px-8` (`32px`)

---

## 6. Components & Interactive States

### A. Buttons

1. **Primary Button (Firm Navy):**
   * Base: `bg-brand-navy text-white font-medium px-5 py-2.5 rounded hover:bg-[#16365c] transition-colors focus:ring-2 focus:ring-brand-blue focus:ring-offset-2 min-h-[44px]`
   * Usage: Primary action ("Call Our Office", "Create Case", "Publish Content").
2. **Secondary Button (Warm Neutral Outline):**
   * Base: `bg-white border border-border text-brand-navy font-medium px-5 py-2.5 rounded hover:bg-brand-surface transition-colors focus:ring-2 focus:ring-brand-blue min-h-[44px]`
   * Usage: Secondary actions ("View Services", "Filter Cases", "Cancel").
3. **Accent / Highlight Button (Warm Amber Gold):**
   * Base: `bg-brand-gold text-white font-medium px-5 py-2.5 rounded hover:bg-brand-gold-hover transition-colors focus:ring-2 focus:ring-brand-gold focus:ring-offset-2 min-h-[44px]`
   * Usage: High-priority phone call action or emergency consultation link.
4. **Subtle / Ghost Button:**
   * Base: `text-slate-600 hover:text-brand-navy hover:bg-slate-100 px-3 py-2 rounded transition-colors`

### B. Form Inputs & Controls
* **Input Fields:** `w-full rounded border border-border bg-white px-3.5 py-2.5 text-foreground placeholder:text-slate-400 focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue/20 min-h-[44px]`
* **Validation Error State:** `border-red-600 focus:border-red-600 focus:ring-red-200 text-red-950` with an accompanying accessible error message: `text-xs text-red-600 font-medium mt-1`.
* **Required Field Indicator:** Red asterisk with accessible label: `<span class="text-red-600" aria-hidden="true">*</span>`.

### C. Cards & Containers
* Restrained, crisp borders over heavy drop shadows:
  `bg-white rounded border border-border p-6 shadow-sm`
* Never stack multiple heavy drop shadows or rounded pill frames.

---

## 7. Navigation & Footer Conventions

### A. Public Website Header
* **Top Bar / Header:** Fixed or sticky top bar with soft border: `border-b border-border bg-white/95 backdrop-blur-sm`.
* **Branding:** Left-aligned `logo.png` (height 48px–56px) with accessible `alt="MMO Advocates LLP"`.
* **Primary Navigation Links:** Center/Right aligned links: Home, Services, About, Contact (`text-sm font-medium text-slate-700 hover:text-brand-navy px-3 py-2`).
* **Header CTA Action:** Prominent verified phone action:
  `<a href="tel:+254725144472" class="inline-flex items-center gap-2 text-sm font-semibold text-brand-navy bg-brand-surface hover:bg-amber-100/60 px-4 py-2 rounded border border-amber-300/40">📞 0725 144 472</a>`
* **Mobile Drawer:** Accessible hamburger toggle with `aria-expanded` state, rendering full-width menu items with minimum 44px tap targets.

### B. Public Website Footer
* **Layout:** Three or four distinct editorial columns over dark or warm neutral background (`bg-brand-navy text-white` or `bg-brand-surface text-slate-800`).
* **Column 1 — Firm Identity:** Official logo, verified firm name: "MMO Advocates LLP", and professional stature summary.
* **Column 2 — Practice Areas:** Links to the 8 core services (Conveyancing, Civil Litigation, Criminal Defense, Land & Environmental, Succession, Small Claims, Divorce, Child Custody).
* **Column 3 — Verified Contact & Address:**
  * Address: *Kimathi House, Suite 807, Kimathi Street, P.O. Box 2046-00200, Nairobi, Kenya*
  * Phone: *0725 144 472* (`tel:+254725144472`)
  * Email: *mmoadvocatellp@gmail.com* (`mailto:mmoadvocatellp@gmail.com`)
* **Legal Disclaimer / Bottom Bar:**
  "The information on this website is for general informational purposes only and does not constitute formal legal advice. No advocate-client relationship is formed through this website."

---

## 8. Accessibility & Compliance (WCAG 2.1 AA)

1. **Contrast Compliance:**
   * All body text achieves contrast ratios exceeding 4.5:1 against their backgrounds.
   * Deep navy text on white/cream achieves 14:1 (AAA level).
   * Gold accent text is always backed by dark navy or used with dark amber (`#92400e`) on light surfaces.
2. **Touch Targets:**
   * All interactive elements (buttons, nav links, phone actions, form inputs) satisfy the minimum 44×44 pixel touch target rule (`min-h-[44px]`).
3. **Keyboard Usability & Focus Rings:**
   * Interactive elements exhibit a high-contrast 2px focus ring (`focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:outline-none`).
   * No keyboard trap states in mobile menus or modals.
4. **Motion Restraint:**
   * Animation is functional and respects user preferences via `@media (prefers-reduced-motion: reduce)`: transitions degrade gracefully to instant state changes.

---

## 9. Shared Conventions: Public Site vs Staff Dashboard

| Feature / Element | Public Website (Blade) | Private Staff Dashboard (React/Inertia) |
| :--- | :--- | :--- |
| **Rendering Engine** | Server-rendered Blade views (`resources/views/public/*`) | React 19 + Inertia components (`resources/js/Pages/Staff/*`) |
| **Primary Atmosphere** | Welcoming, warm cream/white editorial surfaces with serif titles | Focused, scannable data views with deep navy sidebar (`bg-sidebar`) |
| **Typography Usage** | Serif headlines (`--font-serif`) + Sans body (`--font-sans`) | Sans-serif throughout for maximum density and data table clarity |
| **Navigation Model** | Top public navbar + phone action + editorial footer | Collapsible left-hand staff sidebar + breadcrumb header |
| **Brand Assets** | High-DPI `logo.png` in header and footer | Compact logo mark in sidebar header |
| **Data Boundary** | Public content only; zero client/case data serialized | Role-enforced staff records; strict privacy and CSRF protection |
