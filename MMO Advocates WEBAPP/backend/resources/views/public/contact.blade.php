@extends('layouts.public')
@php
    $publicTitle = data_get($publishedContent ?? [], 'title');
    $publicBody = data_get($publishedContent ?? [], 'body');
@endphp
@section('title'){{ $publicTitle ?: 'Contact us' }}@endsection
@section('description', 'Reach out to us by telephone or email, or find our Nairobi office.')
@section('content')
<section class="page-intro"><div class="wrap intro-grid"><div><p class="eyebrow">Contact us</p><h1>{{ $publicTitle ?: 'Reach out to us.' }}</h1></div><p class="lead">{{ $publicBody ?: 'Call us, email us, or find us at our Nairobi office. Our contact details are below.' }}</p></div></section>
<section class="section"><div class="wrap contact-grid"><dl class="contact-list"><div class="contact-row"><dt>Call us</dt><dd><a href="tel:+254725144472">0725 144 472 <span class="arrow" aria-hidden="true">↗</span></a></dd></div><div class="contact-row"><dt>Email us</dt><dd><a href="mailto:mmoadvocatellp@gmail.com">mmoadvocatellp@gmail.com</a></dd></div><div class="contact-row"><dt>Find us</dt><dd><address style="font-style:normal">Kimathi House, Suite 807, Kimathi Street,<br>P.O. Box 2046-00200, Nairobi, Kenya.</address></dd></div></dl><aside class="contact-aside"><p class="eyebrow" style="color:#f8c678">Our practice</p><h2>Start with a conversation.</h2><p>For enquiries about our services, reach out to us using the telephone number or email address on this page.</p><a class="text-link" href="/services">See what we provide <span aria-hidden="true">↗</span></a></aside></div></section>
@endsection
