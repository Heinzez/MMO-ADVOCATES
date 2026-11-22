@extends('layouts.public')

@php
    $publicTitle = data_get($publishedContent ?? [], 'title');
    $publicBody = data_get($publishedContent ?? [], 'body');
    $phoneLink = 'tel:'.config('firm.phone_link');
@endphp

@section('title'){{ $publicTitle ?: 'Home' }}@endsection
@section('description', 'MMO Advocates LLP is a law firm at Kimathi House in Nairobi, Kenya. See our practice areas and call our office directly.')

@section('content')

@include('public.partials.hero', [
    'eyebrow' => 'Advocates · '.config('firm.city'),
    'title' => $publicTitle ?: 'Clarity in counsel.',
    'accent' => $publicTitle ? null : 'Confidence in every step.',
    'lead' => $publicBody ?: 'Practical legal guidance, thoughtful representation and a commitment to protecting what matters to you.',
    'primaryLabel' => 'Get in touch',
    'primaryHref' => $phoneLink,
    'secondaryLabel' => 'Explore our services',
    'secondaryHref' => url('/services'),
    'note' => 'Trusted legal counsel with a personal approach',
])

{{-- Introduction --}}
<section class="section sec-cream">
    <div class="wrap">
        <p class="eyebrow">Welcome to MMO Advocates</p>
        <div class="split">
            <h2>Legal experience. <span class="accent">Human understanding.</span></h2>
            <div>
                <p class="lede">At MMO Advocates LLP, we believe that good legal representation begins with listening.</p>
                <p class="body-copy">We work with individuals and businesses to navigate legal matters with care, diligence and clear communication. Our approach is grounded in integrity, practical thinking and a commitment to the interests of our clients.</p>
                <a class="tlink tlink-rule" href="{{ url('/about') }}">Connect with our team <span class="ar" aria-hidden="true">&rarr;</span></a>
            </div>
        </div>
    </div>
</section>

{{-- Practice areas --}}
<section class="section sec-dark">
    <div class="wrap">
        <p class="eyebrow">How we can help</p>
        <div class="sec-head">
            <h2>Our legal <span class="accent-inline">services</span></h2>
            <p>Focused legal support across a range of matters, delivered with professionalism and attention to detail.</p>
        </div>
        @include('public.partials.service-cards')
    </div>
</section>

{{-- Approach --}}
<section class="section sec-dark approach">
    <div class="wrap">
        <p class="eyebrow">Our approach</p>
        <div class="split">
            <h2>Professional service. <span class="accent">Personal commitment.</span></h2>
            <ol class="values">
                <li>
                    <span class="value-num" aria-hidden="true">01</span>
                    <div>
                        <p class="value-name">Integrity</p>
                        <p class="value-note">Honest, principled legal guidance.</p>
                    </div>
                </li>
                <li>
                    <span class="value-num" aria-hidden="true">02</span>
                    <div>
                        <p class="value-name">Diligence</p>
                        <p class="value-note">Careful attention to every matter.</p>
                    </div>
                </li>
                <li>
                    <span class="value-num" aria-hidden="true">03</span>
                    <div>
                        <p class="value-name">Clarity</p>
                        <p class="value-note">Communication you can understand.</p>
                    </div>
                </li>
            </ol>
        </div>
    </div>
</section>

@include('public.partials.contact-cta')

@endsection
