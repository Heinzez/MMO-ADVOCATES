@extends('layouts.public')
@php
    $publicTitle = data_get($publishedContent ?? [], 'title');
    $publicBody = data_get($publishedContent ?? [], 'body');
@endphp
@section('title'){{ $publicTitle ?: 'About us' }}@endsection
@section('description', 'Learn about our areas of work and our Nairobi practice.')
@section('content')
<section class="page-intro"><div class="wrap intro-grid"><div><p class="eyebrow">About us</p><h1>{{ $publicTitle ?: 'We are MMO Advocates LLP.' }}</h1></div><p class="lead">{{ $publicBody ?: 'We are a law firm based at Kimathi House in Nairobi, Kenya.' }}</p></div></section>
<section class="section"><div class="wrap about-grid"><div class="reading"><p>Our areas of work include litigation, conveyancing, legal drafting, mediation and research.</p><p>Our practice areas span land matters, criminal matters, succession, civil litigation, small claims, divorce and child custody. You can explore the complete list of our services or reach out to us directly.</p><a class="text-link" href="/services">Explore our practice areas <span aria-hidden="true">↗</span></a></div><aside class="side-note"><p class="eyebrow">Our Nairobi office</p><h2 style="font-size:30px">Kimathi House,<br>Suite 807.</h2><p>Kimathi Street,<br>P.O. Box 2046-00200,<br>Nairobi, Kenya.</p><a class="text-link" href="/contact">Get in touch with us <span aria-hidden="true">↗</span></a></aside></div></section>
@endsection
