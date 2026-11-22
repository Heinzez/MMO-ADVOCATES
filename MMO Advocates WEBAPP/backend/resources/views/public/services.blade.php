@extends('layouts.public')

@php
    $publicTitle = data_get($publishedContent ?? [], 'title');
    $publicBody = data_get($publishedContent ?? [], 'body');
    $phoneLink = 'tel:'.config('firm.phone_link');
@endphp

@section('title'){{ $publicTitle ?: 'Our services' }}@endsection
@section('description', 'The eight practice areas of MMO Advocates LLP, Nairobi: conveyancing, criminal law, environmental and land, succession, civil litigation, small claims, divorce and child custody.')

@section('content')

@include('public.partials.hero', [
    'eyebrow' => 'Our practice',
    'title' => $publicTitle ?: 'Our legal services.',
    'accent' => $publicTitle ? null : 'Eight areas of focus.',
    'lead' => $publicBody ?: 'Focused legal support across land, family, civil and criminal matters. To discuss a matter, call our office directly.',
    'primaryLabel' => 'Call our office',
    'primaryHref' => $phoneLink,
    'secondaryLabel' => 'See what each covers',
    'secondaryHref' => '#services-detail',
    'note' => 'Eight practice areas across one Nairobi practice',
])

{{-- Overview grid --}}
<section class="section sec-dark">
    <div class="wrap">
        <p class="eyebrow">How we can help</p>
        <div class="sec-head">
            <h2>What we <span class="accent-inline">provide</span></h2>
            <p>Select an area to read what it covers, or call our office to discuss your enquiry.</p>
        </div>
        @include('public.partials.service-cards', ['cardHref' => '#services-detail'])
    </div>
</section>

{{-- Detailed descriptions --}}
<section class="section sec-cream" id="services-detail">
    <div class="wrap">
        <p class="eyebrow">In detail</p>
        <div class="sec-head">
            <h2>What each <span class="accent-inline">service covers</span></h2>
            <p>A closer look at the matters we handle in each practice area.</p>
        </div>

        <div class="svc-detail-grid">
            @foreach (config('firm.services') as $index => $service)
                <article class="svc-detail" id="{{ $service['slug'] }}">
                    <div class="svc-detail-head">
                        <span class="svc-num">{{ str_pad((string) ($index + 1), 2, '0', STR_PAD_LEFT) }}</span>
                        <span class="svc-icon">@include('public.partials.icon', ['name' => $service['icon']])</span>
                    </div>
                    <h3>{{ $service['name'] }}</h3>
                    <p>{{ $service['detail'] }}</p>
                    <p class="svc-matters-label">Matters we handle</p>
                    <ul class="svc-matters">
                        @foreach ($service['examples'] as $example)
                            <li>{{ $example }}</li>
                        @endforeach
                    </ul>
                    <a class="tlink" href="{{ $phoneLink }}">Call us about {{ strtolower($service['name']) }} <span class="ar" aria-hidden="true">&#8599;</span></a>
                </article>
            @endforeach
        </div>
    </div>
</section>

{{-- Other areas of work --}}
<section class="section sec-dark approach">
    <div class="wrap">
        <p class="eyebrow">Beyond these areas</p>
        <div class="split">
            <h2>Not sure where your <span class="accent">enquiry fits?</span></h2>
            <div>
                <p class="body-copy">We also work in legal drafting, mediation and legal research. If your matter is not listed here, call our office and we will tell you whether we can assist.</p>
                <ul class="pills">
                    @foreach (config('firm.areas_of_work') as $area)
                        <li>{{ $area }}</li>
                    @endforeach
                </ul>
            </div>
        </div>
    </div>
</section>

@include('public.partials.contact-cta', [
    'ctaTitle' => 'Discuss your matter',
    'ctaAccent' => 'with our office.',
    'ctaCopy' => 'Tell us briefly what your enquiry concerns and we will let you know how we can help.',
])

@endsection
