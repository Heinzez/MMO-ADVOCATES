<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="@yield('description', 'MMO Advocates LLP is a law firm in Nairobi, Kenya, working in litigation, conveyancing, legal drafting, mediation and research.')">
    <meta name="theme-color" content="#101C2C">
    <title>@yield('title') | {{ config('firm.name') }}</title>

    {{-- Bunny Fonts serves Playfair Display and DM Sans without tracking cookies or logging visitor IPs for advertising. --}}
    <link rel="preconnect" href="https://fonts.bunny.net" crossorigin>
    <link rel="stylesheet" href="https://fonts.bunny.net/css?family=dm-sans:400,500,600,700|playfair-display:400,400i,500,500i,600,700,700i&display=swap">

    <style>
    /* ---------------------------------------------------------------
       Design tokens — navy and gold corporate identity.
       The public site carries its own stylesheet so these pages render
       correctly without a compiled asset bundle.
       --------------------------------------------------------------- */
    :root {
        --navy: #101C2C;
        --navy-2: #192A40;
        --navy-deep: #0B1522;
        --gold: #C7A45C;
        --gold-light: #DFC58E;
        /* Deeper golds for text on cream: #C7A45C reaches only 2.1:1 there. */
        --gold-ink: #8A6B2E;
        --gold-display: #A07E33;
        --cream: #F7F5F0;
        --ink: #252B35;
        --ink-soft: #555B64;
        --on-navy: #C9D4E0;
        --on-navy-soft: #9FB0C1;
        --line-dark: rgba(255, 255, 255, .10);
        --line-light: rgba(16, 28, 44, .13);
        --serif: "Playfair Display", Georgia, "Times New Roman", serif;
        --sans: "DM Sans", system-ui, -apple-system, "Segoe UI", Arial, sans-serif;
    }

    *, *::before, *::after { box-sizing: border-box; }
    html { -webkit-text-size-adjust: 100%; }

    body {
        margin: 0;
        background: var(--cream);
        color: var(--ink);
        font-family: var(--sans);
        font-size: 16px;
        line-height: 1.7;
        -webkit-font-smoothing: antialiased;
    }

    img, svg { display: block; max-width: 100%; }
    address { font-style: normal; }
    a { color: inherit; }
    :focus-visible { outline: 3px solid var(--gold-ink); outline-offset: 3px; }
    .sec-dark :focus-visible, .hero :focus-visible, .masthead :focus-visible,
    .topbar :focus-visible, .footer :focus-visible { outline-color: var(--gold-light); }

    .wrap { width: min(1160px, calc(100% - 56px)); margin-inline: auto; }

    .skip {
        position: fixed; top: -200px; left: 16px; z-index: 100;
        background: #fff; color: var(--navy); padding: 12px 20px; font-weight: 600;
    }
    .skip:focus { top: 16px; }

    /* --- Typography ------------------------------------------------ */
    h1, h2, h3 {
        margin: 0;
        font-family: var(--serif);
        font-weight: 400;
        color: var(--navy);
        letter-spacing: -.012em;
        text-wrap: balance;
    }
    h1 { font-size: clamp(40px, 5.4vw, 70px); line-height: 1.08; }
    /* Fill lines naturally in display headings rather than balancing them. */
    .hero h1 { text-wrap: pretty; }
    h2 { font-size: clamp(30px, 3.6vw, 46px); line-height: 1.16; }
    h3 { font-size: 20px; line-height: 1.35; }
    .sec-dark h1, .sec-dark h2, .sec-dark h3,
    .hero h1 { color: #fff; }

    .accent { display: block; font-style: italic; color: var(--gold-display); }
    .accent-inline { font-style: italic; color: var(--gold-display); }
    .sec-dark .accent, .sec-dark .accent-inline,
    .hero .accent, .hero .accent-inline { color: var(--gold); }

    .eyebrow {
        display: flex; align-items: center; gap: 14px;
        margin: 0 0 26px;
        font-size: 10.5px; font-weight: 600; letter-spacing: .22em;
        text-transform: uppercase; color: var(--gold-ink);
    }
    .eyebrow::before { content: ""; width: 38px; height: 1px; background: currentColor; flex: none; }
    .sec-dark .eyebrow, .hero .eyebrow { color: var(--gold); }

    .label { margin: 0 0 16px; font-family: var(--sans); font-size: 13px; font-weight: 600;
             letter-spacing: .14em; text-transform: uppercase; color: var(--gold-ink); }
    .sec-dark .label, .hero .label { color: var(--gold); }
    .copy-top { margin-top: 26px; }
    .actions-row { display: flex; flex-wrap: wrap; align-items: center; gap: 18px; }
    .lede { margin: 0 0 22px; font-size: 19px; font-weight: 500; line-height: 1.6; color: var(--navy); }
    .body-copy { margin: 0 0 26px; font-size: 14.5px; line-height: 1.85; color: var(--ink-soft); }
    .sec-dark .body-copy { color: var(--on-navy-soft); }

    /* --- Buttons and links ----------------------------------------- */
    .btn {
        display: inline-flex; align-items: center; gap: 12px;
        min-height: 48px; padding: 13px 26px;
        font-size: 14px; font-weight: 600; text-decoration: none;
        border: 1px solid transparent;
        transition: background-color .25s, color .25s, border-color .25s;
    }
    .btn-gold { background: var(--gold); border-color: var(--gold); color: #16212F; }
    .btn-gold:hover { background: var(--gold-light); border-color: var(--gold-light); }
    .btn-ghost { border-color: rgba(255, 255, 255, .28); color: #fff; }
    .btn-ghost:hover { border-color: var(--gold); color: var(--gold); }
    .btn-navy { background: var(--navy); border-color: var(--navy); color: #fff; }
    .btn-navy:hover { background: var(--navy-2); border-color: var(--navy-2); }

    .tlink {
        display: inline-flex; align-items: center; gap: 10px;
        font-size: 14px; font-weight: 600; text-decoration: none; color: var(--gold-ink);
    }
    .sec-dark .tlink, .hero .tlink { color: #fff; }
    .tlink .ar { transition: transform .25s; }
    .tlink:hover .ar { transform: translateX(4px); }
    .tlink-rule {
        justify-content: space-between; min-width: 190px;
        padding-bottom: 12px; border-bottom: 1px solid var(--line-light);
    }
    .sec-dark .tlink-rule { border-bottom-color: var(--line-dark); }

    /* --- Top bar ---------------------------------------------------- */
    .topbar { background: var(--navy-deep); color: #A9B8C8; font-size: 12.5px; }
    .topbar-inner { display: flex; align-items: center; justify-content: space-between; gap: 16px; min-height: 38px; }
    .topbar a { color: var(--gold-light); text-decoration: none; font-weight: 500; }
    .topbar a:hover { text-decoration: underline; text-underline-offset: 3px; }

    /* --- Masthead --------------------------------------------------- */
    .masthead {
        position: sticky; top: 0; z-index: 40;
        background: var(--navy);
        border-bottom: 1px solid rgba(255, 255, 255, .07);
    }
    .masthead-inner { display: flex; align-items: center; justify-content: space-between; gap: 28px; min-height: 88px; }

    .brand { display: flex; align-items: center; gap: 14px; text-decoration: none; flex-shrink: 0; }
    .brand-mark {
        width: 52px; height: 52px; flex: none;
        display: grid; place-items: center;
        border: 1px solid rgba(199, 164, 92, .55);
        font-family: var(--serif); font-size: 16px; letter-spacing: .05em; color: var(--gold);
    }
    .brand-name { display: block; font-size: 15px; font-weight: 700; letter-spacing: .09em; color: #fff; line-height: 1.2; }
    .brand-tag { display: block; margin-top: 5px; font-size: 9px; font-weight: 500; letter-spacing: .19em; color: var(--gold); }
    .brand-compact .brand-mark { width: 46px; height: 46px; font-size: 14px; }

    .nav { display: flex; align-items: center; gap: 34px; }
    .nav a { position: relative; padding: 6px 0; font-size: 14px; text-decoration: none; color: rgba(255, 255, 255, .84); transition: color .25s; }
    .nav a::after {
        content: ""; position: absolute; left: 0; bottom: 0; width: 100%; height: 1px;
        background: var(--gold); transform: scaleX(0); transform-origin: left; transition: transform .25s;
    }
    .nav a:hover { color: var(--gold-light); }
    .nav a[aria-current="page"] { color: var(--gold); }
    .nav a:hover::after { transform: scaleX(1); }

    .mobile-menu { display: none; position: relative; }
    .mobile-menu summary {
        list-style: none; cursor: pointer;
        min-height: 44px; padding: 11px 16px;
        border: 1px solid rgba(255, 255, 255, .28); color: #fff; font-size: 14px; font-weight: 600;
    }
    .mobile-menu summary::-webkit-details-marker { display: none; }
    .mobile-links {
        position: absolute; right: 0; top: calc(100% + 12px); z-index: 50;
        min-width: 240px; padding: 10px;
        background: var(--navy-2); border: 1px solid var(--line-dark);
        box-shadow: 0 18px 44px rgba(0, 0, 0, .45);
    }
    .mobile-links a { display: block; padding: 12px 14px; color: #fff; text-decoration: none; font-size: 14px; }
    .mobile-links a:hover { background: rgba(255, 255, 255, .06); color: var(--gold-light); }

    /* --- Sections --------------------------------------------------- */
    .section { padding: clamp(64px, 8vw, 112px) 0; }
    .sec-dark { background: var(--navy); color: var(--on-navy); }
    .sec-cream { background: var(--cream); }
    .approach { background: linear-gradient(135deg, #18293F 0%, var(--navy) 58%); }
    .sec-head { display: grid; grid-template-columns: 1.3fr .7fr; gap: 48px; align-items: end; margin-bottom: 48px; }
    .sec-head p { margin: 0; max-width: 340px; font-size: 14px; line-height: 1.8; color: var(--on-navy-soft); }
    .sec-cream .sec-head p { color: var(--ink-soft); }

    /* --- Hero ------------------------------------------------------- */
    .hero {
        position: relative; overflow: hidden;
        padding: clamp(72px, 9vw, 128px) 0 clamp(56px, 6vw, 88px);
        background: radial-gradient(1100px 620px at 16% 42%, #17273D 0%, rgba(16, 28, 44, 0) 68%), var(--navy);
        color: var(--on-navy);
    }
    .hero-figure {
        position: absolute; top: 50%; right: clamp(20px, 5vw, 90px);
        width: min(420px, 34vw); aspect-ratio: 1;
        transform: translateY(-50%) rotate(45deg);
        border: 1px solid rgba(223, 197, 142, .14);
        pointer-events: none;
    }
    .hero-figure::before {
        content: ""; position: absolute; inset: 12%;
        border: 1px solid rgba(223, 197, 142, .07);
    }
    .hero-wrap { position: relative; z-index: 1; display: flex; flex-direction: column; gap: clamp(40px, 6vw, 76px); }
    .hero-copy { max-width: 720px; }
    .hero-lead { margin: 30px 0 0; max-width: 470px; font-size: 16.5px; line-height: 1.8; color: var(--on-navy); }
    .hero-actions { display: flex; flex-wrap: wrap; align-items: center; gap: 26px; margin-top: 42px; }
    .hero-note { align-self: flex-end; display: flex; align-items: flex-start; gap: 16px; }
    .hero-note-num { font-family: var(--serif); font-size: 22px; color: var(--gold); line-height: 1.2; }
    .hero-note-text { max-width: 155px; font-size: 12.5px; line-height: 1.6; color: var(--on-navy-soft); }


    /* --- Two-column copy -------------------------------------------- */
    .split { display: grid; grid-template-columns: 1fr 1fr; gap: clamp(40px, 7vw, 96px); align-items: start; }

    /* --- Service cards ---------------------------------------------- */
    .svc-grid {
        display: grid; grid-template-columns: repeat(4, 1fr);
        border-top: 1px solid var(--line-dark); border-left: 1px solid var(--line-dark);
    }
    .sec-cream .svc-grid { border-top-color: var(--line-light); border-left-color: var(--line-light); }
    .svc {
        position: relative; display: flex; flex-direction: column; gap: 13px;
        min-height: 238px; padding: 30px 26px 26px;
        text-decoration: none;
        border-right: 1px solid var(--line-dark); border-bottom: 1px solid var(--line-dark);
        transition: background-color .25s;
    }
    .sec-cream .svc { border-right-color: var(--line-light); border-bottom-color: var(--line-light); }
    .svc:hover { background: rgba(255, 255, 255, .035); }
    .sec-cream .svc:hover { background: rgba(16, 28, 44, .03); }
    .svc-num { font-size: 10.5px; letter-spacing: .14em; color: var(--gold); }
    .sec-cream .svc-num { color: var(--gold-ink); }
    .svc-icon { color: var(--gold); }
    .sec-cream .svc-icon { color: var(--gold-ink); }
    .svc-icon svg { width: 24px; height: 24px; }
    .svc h3 { font-size: 20px; }
    .svc p { margin: 0; font-size: 13.5px; line-height: 1.7; color: var(--on-navy-soft); }
    .sec-cream .svc p { color: var(--ink-soft); }
    .svc .ar { position: absolute; right: 22px; bottom: 20px; color: var(--gold); opacity: .55; transition: transform .25s, opacity .25s; }
    .sec-cream .svc .ar { color: var(--gold-ink); }
    .svc:hover .ar { opacity: 1; transform: translate(3px, -3px); }

    /* --- Numbered values list --------------------------------------- */
    .values { list-style: none; margin: 0; padding: 0; border-top: 1px solid var(--line-dark); }
    .sec-cream .values { border-top-color: var(--line-light); }
    .values li {
        display: grid; grid-template-columns: 62px 1fr; gap: 10px;
        padding: 22px 0; border-bottom: 1px solid var(--line-dark);
    }
    .sec-cream .values li { border-bottom-color: var(--line-light); }
    .value-num { font-family: var(--serif); font-size: 20px; color: var(--gold); }
    .sec-cream .value-num { color: var(--gold-ink); }
    .value-name { margin: 0 0 5px; font-size: 15px; font-weight: 600; color: #fff; }
    .sec-cream .value-name { color: var(--navy); }
    .value-note { margin: 0; font-size: 13.5px; line-height: 1.7; color: var(--on-navy-soft); }
    .sec-cream .value-note { color: var(--ink-soft); }

    /* --- Contact details -------------------------------------------- */
    .details-col { border-left: 1px solid var(--line-light); padding-left: clamp(24px, 4vw, 56px); }
    .details { margin: 0; }
    .detail { margin-bottom: 30px; }
    .detail:last-child { margin-bottom: 0; }
    .detail dt { margin-bottom: 9px; font-size: 10.5px; font-weight: 600; letter-spacing: .19em; text-transform: uppercase; color: var(--ink-soft); }
    .detail dd { margin: 0; font-size: 17px; line-height: 1.6; color: var(--navy); font-style: normal; overflow-wrap: anywhere; }
    .detail dd a { text-decoration: none; }
    .detail dd a:hover { color: var(--gold-ink); text-decoration: underline; text-underline-offset: 4px; }

    /* --- Service detail entries (services page) ---------------------- */
    .svc-detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: clamp(32px, 4vw, 56px); }
    .svc-detail { padding-top: 28px; border-top: 1px solid var(--line-light); }
    .svc-detail-head { display: flex; align-items: center; gap: 14px; margin-bottom: 14px; }
    .svc-detail-head .svc-icon { color: var(--gold-ink); }
    .svc-detail-head svg { width: 24px; height: 24px; }
    .svc-detail h3 { font-size: 24px; }
    .svc-detail > p { margin: 0 0 20px; font-size: 14.5px; line-height: 1.85; color: var(--ink-soft); }
    .svc-matters { margin: 0 0 22px; padding: 0; list-style: none; }
    .svc-matters-label { margin: 0 0 10px; font-size: 10.5px; font-weight: 600; letter-spacing: .19em; text-transform: uppercase; color: var(--ink-soft); }
    .svc-matters li { position: relative; padding-left: 20px; font-size: 14px; line-height: 1.9; color: var(--ink); }
    .svc-matters li::before { content: ""; position: absolute; left: 0; top: 13px; width: 8px; height: 1px; background: var(--gold-ink); }

    /* --- Pill list (areas of work) ----------------------------------- */
    .pills { display: flex; flex-wrap: wrap; gap: 10px; margin: 0; padding: 0; list-style: none; }
    .pills li { padding: 9px 18px; border: 1px solid var(--line-light); font-size: 13.5px; color: var(--ink); }
    .sec-dark .pills li { border-color: var(--line-dark); color: var(--on-navy); }

    /* --- Footer ------------------------------------------------------ */
    .footer { background: var(--navy); color: var(--on-navy-soft); padding: 66px 0 26px; }
    .footer-top { display: grid; grid-template-columns: 1.1fr 1fr .8fr; gap: 44px; padding-bottom: 44px; }
    .footer-note { margin: 0; font-size: 14px; line-height: 1.75; color: var(--on-navy); }
    .footer-links { display: flex; flex-wrap: wrap; gap: 20px; margin-top: 18px; font-size: 13.5px; }
    .footer-links a { text-decoration: none; }
    .footer-links a:hover { color: var(--gold-light); text-decoration: underline; text-underline-offset: 4px; }
    .footer-contact { display: flex; flex-direction: column; align-items: flex-end; gap: 10px; text-align: right; }
    .footer-phone { display: inline-flex; align-items: center; gap: 8px; font-size: 17px; color: var(--gold); text-decoration: none; }
    .footer-phone:hover { color: var(--gold-light); }
    .footer-email { font-size: 13.5px; text-decoration: none; }
    .footer-email:hover { color: var(--gold-light); text-decoration: underline; text-underline-offset: 4px; }
    .footer-bottom {
        display: flex; justify-content: space-between; flex-wrap: wrap; gap: 14px;
        padding-top: 22px; border-top: 1px solid var(--line-dark);
        font-size: 12px; color: #93A5B6; font-style: normal;
    }

    /* --- Content published through the website content module -------- */
    .section-light { background: var(--cream); padding: clamp(56px, 7vw, 96px) 0; }
    .section-light .shell { width: min(1160px, calc(100% - 56px)); margin-inline: auto; }
    .section-title { margin: 0 0 22px; font-family: var(--serif); font-weight: 400; font-size: clamp(28px, 3.2vw, 40px); color: var(--navy); }
    .about-copy { max-width: 760px; font-size: 16px; line-height: 1.85; color: var(--ink-soft); }

    /* --- Responsive --------------------------------------------------- */
    @media (max-width: 1080px) {
        .nav, .masthead-cta { display: none; }
        .mobile-menu { display: block; }
        .svc-grid { grid-template-columns: repeat(2, 1fr); }
        .sec-head { grid-template-columns: 1fr; align-items: start; gap: 24px; }
    }

    @media (max-width: 760px) {
        .wrap { width: calc(100% - 36px); }
        .topbar-address { display: none; }
        .masthead-inner { min-height: 76px; gap: 12px; }
        .brand-mark { width: 44px; height: 44px; font-size: 13px; }
        .brand-name { font-size: 12px; letter-spacing: .06em; }
        .brand-tag { font-size: 8px; letter-spacing: .14em; }
        .split, .svc-detail-grid, .footer-top { grid-template-columns: 1fr; }
        .svc-grid { grid-template-columns: 1fr; }
        .svc { min-height: 0; }
        .hero-figure { right: -150px; opacity: .55; }
        .hero-note { align-self: flex-start; }
        .hero-actions { gap: 18px; }
        .details-col { border-left: 0; border-top: 1px solid var(--line-light); padding-left: 0; padding-top: 30px; }
        .footer-contact { align-items: flex-start; text-align: left; }
        .footer-bottom { flex-direction: column; gap: 8px; }
    }

    @media (prefers-reduced-motion: reduce) {
        *, *::before, *::after { transition: none !important; animation: none !important; scroll-behavior: auto !important; }
    }
    </style>
</head>
<body>
@php
    $navLinks = ['/' => 'Home', '/about' => 'About', '/services' => 'Our Services', '/contact' => 'Contact'];
    $isCurrent = fn (string $path): bool => request()->is($path === '/' ? '/' : ltrim($path, '/'));
    $phoneLink = 'tel:'.config('firm.phone_link');
@endphp

<a class="skip" href="#main-content">Skip to main content</a>

<div class="topbar">
    <div class="wrap topbar-inner">
        <span class="topbar-address">{{ config('firm.address_lines.0') }} &middot; {{ config('firm.city') }}</span>
        <span>Call us: <a href="{{ $phoneLink }}">{{ config('firm.phone_display') }}</a></span>
    </div>
</div>

<header class="masthead">
    <div class="wrap masthead-inner">
        @include('public.partials.brand-mark', ['href' => route('home')])

        <nav class="nav" aria-label="Main navigation">
            @foreach ($navLinks as $path => $label)
                <a href="{{ url($path) }}" @if ($isCurrent($path)) aria-current="page" @endif>{{ $label }}</a>
            @endforeach
        </nav>

        <a class="btn btn-ghost masthead-cta" href="{{ $phoneLink }}">Speak to us <span class="ar" aria-hidden="true">&#8599;</span></a>

        <details class="mobile-menu">
            <summary>Menu</summary>
            <nav class="mobile-links" aria-label="Mobile navigation">
                @foreach ($navLinks as $path => $label)
                    <a href="{{ url($path) }}" @if ($isCurrent($path)) aria-current="page" @endif>{{ $label }}</a>
                @endforeach
                <a href="{{ $phoneLink }}">Call us: {{ config('firm.phone_display') }}</a>
            </nav>
        </details>
    </div>
</header>

<main id="main-content">@yield('content')</main>

<footer class="footer">
    <div class="wrap">
        <div class="footer-top">
            @include('public.partials.brand-mark', ['href' => route('home'), 'compact' => true])

            <div>
                <p class="footer-note">Committed to thoughtful counsel<br>and practical legal solutions.</p>
                <nav class="footer-links" aria-label="Footer navigation">
                    @foreach ($navLinks as $path => $label)
                        <a href="{{ url($path) }}">{{ $label }}</a>
                    @endforeach
                </nav>
            </div>

            <div class="footer-contact">
                <a class="footer-phone" href="{{ $phoneLink }}">{{ config('firm.phone_display') }} <span class="ar" aria-hidden="true">&#8599;</span></a>
                <a class="footer-email" href="mailto:{{ config('firm.email') }}">{{ config('firm.email') }}</a>
            </div>
        </div>

        <div class="footer-bottom">
            <span>&copy; {{ now()->year }} {{ config('firm.legal_name') }}. All rights reserved.</span>
            <address>{{ implode(', ', config('firm.address_lines')) }} &middot; {{ config('firm.postal_address') }}</address>
        </div>
    </div>
</footer>
</body>
</html>
