@extends('layouts.public')
@php
    $publicTitle = data_get($publishedContent ?? [], 'title');
    $publicBody = data_get($publishedContent ?? [], 'body');
@endphp
@section('title'){{ $publicTitle ?: 'Home' }}@endsection
@section('description', 'Explore our legal services and reach out to us at our Nairobi office.')
@section('content')
<section class="hero"><div class="hero-copy"><p class="eyebrow">Legal services · Nairobi, Kenya</p><h1>@if($publicTitle){{ $publicTitle }}@else A Nairobi practice.<br>A direct conversation.@endif</h1><p class="lead">{{ $publicBody ?: 'We work in litigation, conveyancing, legal drafting, mediation and research. Explore our practice areas, then reach out to us about your enquiry.' }}</p><div class="actions"><a class="button button-light" href="tel:+254725144472">Call us: 0725 144 472 <span aria-hidden="true">↗</span></a><a class="text-link" href="/services">Explore our services</a></div></div><div class="hero-brand"><img src="{{ asset('images/brand/logo.png') }}" width="624" height="492" alt="MMO Advocates LLP official logo"><div class="location-line"><span>Kimathi House · Suite 807</span><span>Nairobi</span></div></div></section>
<section class="section"><div class="wrap"><div class="section-head"><div><p class="eyebrow">Our practice areas</p><h2>What we provide.</h2></div><p>Our practice covers the eight areas below. Select an area to reach our contact details.</p></div>@include('public.partials.practice-list')<div class="practice-note"><span>Not sure where your enquiry fits? Reach out to us directly.</span><a class="text-link" href="/contact">Start a conversation with us <span aria-hidden="true">↗</span></a></div></div></section>
<section class="section office-band"><div class="wrap office-grid"><div><p class="eyebrow">Find us in Nairobi</p><h2>Our office.<br>Your point of contact.</h2></div><div class="office-detail"><p>Kimathi House, Suite 807, Kimathi Street,<br>P.O. Box 2046-00200, Nairobi, Kenya.</p><a class="text-link" href="/contact">Our contact details <span aria-hidden="true">↗</span></a></div></div></section>
@endsection
