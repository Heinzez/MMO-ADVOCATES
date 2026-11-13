@extends('layouts.public')
@php
    $publicTitle = data_get($publishedContent ?? [], 'title');
    $publicBody = data_get($publishedContent ?? [], 'body');
@endphp
@section('title'){{ $publicTitle ?: 'Our services' }}@endsection
@section('description', 'Explore our eight legal practice areas at MMO Advocates LLP, Nairobi.')
@section('content')
<section class="page-intro"><div class="wrap intro-grid"><div><p class="eyebrow">Our practice</p><h1>{{ $publicTitle ?: 'What we provide.' }}</h1></div><p class="lead">{{ $publicBody ?: 'Our legal services cover the following eight practice areas. For enquiries, call or email us directly.' }}</p></div></section>
<section class="section"><div class="wrap">@include('public.partials.practice-list')<div class="practice-note"><span>We also work in legal drafting, mediation and research.</span><a class="text-link" href="tel:+254725144472">Talk to us: 0725 144 472 <span aria-hidden="true">↗</span></a></div></div></section>
@endsection
