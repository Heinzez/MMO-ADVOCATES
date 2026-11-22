@extends('layouts.public')

@php
    $publicTitle = data_get($publishedContent ?? [], 'title');
    $publicBody = data_get($publishedContent ?? [], 'body');
    $phoneLink = 'tel:'.config('firm.phone_link');
    $mapUrl = 'https://www.google.com/maps/search/?api=1&query='.urlencode(config('firm.map_query'));
@endphp

@section('title'){{ $publicTitle ?: 'Contact us' }}@endsection
@section('description', 'Call or email MMO Advocates LLP, or visit our office at Kimathi House, Suite 807, Kimathi Street, Nairobi, Kenya.')

@section('content')

@include('public.partials.hero', [
    'eyebrow' => 'Start a conversation',
    'title' => $publicTitle ?: "Let's discuss",
    'accent' => $publicTitle ? null : 'how we can help.',
    'lead' => $publicBody ?: 'Reach out to our office directly by telephone or email. There is no online booking; we prefer to speak with you.',
    'primaryLabel' => 'Call '.config('firm.phone_display'),
    'primaryHref' => $phoneLink,
    'secondaryLabel' => 'Email us instead',
    'secondaryHref' => 'mailto:'.config('firm.email'),
    'note' => 'We answer the telephone during office hours',
])

{{-- Contact details --}}
<section class="section sec-cream">
    <div class="wrap">
        <p class="eyebrow">Call us</p>
        <div class="split">
            <div>
                <h2>{{ config('firm.phone_display') }}</h2>
                <p class="body-copy copy-top">The fastest way to reach us is by telephone during office hours. Tell us briefly what the matter concerns and we will direct you to the right person.</p>
                <div class="actions-row">
                    <a class="btn btn-navy" href="{{ $phoneLink }}">Call our office <span class="ar" aria-hidden="true">&#8599;</span></a>
                    <a class="tlink" href="mailto:{{ config('firm.email') }}">Email us instead <span class="ar" aria-hidden="true">&rarr;</span></a>
                </div>
            </div>

            <div class="details-col">
                <dl class="details">
                    <div class="detail">
                        <dt>Phone</dt>
                        <dd><a href="{{ $phoneLink }}">{{ config('firm.phone_display') }}</a></dd>
                    </div>
                    <div class="detail">
                        <dt>Email</dt>
                        <dd><a href="mailto:{{ config('firm.email') }}">{{ config('firm.email') }}</a></dd>
                    </div>
                    <div class="detail">
                        <dt>Physical address</dt>
                        <dd>
                            <address>
                                @foreach (config('firm.address_lines') as $line){{ $line }}<br>@endforeach
                            </address>
                        </dd>
                    </div>
                    <div class="detail">
                        <dt>Postal address</dt>
                        <dd><address>{{ config('firm.postal_address') }}</address></dd>
                    </div>
                </dl>
            </div>
        </div>
    </div>
</section>

{{-- Office --}}
<section class="section sec-dark approach">
    <div class="wrap">
        <p class="eyebrow">Visit our office</p>
        <div class="split">
            <h2>Kimathi House, <span class="accent">Suite 807.</span></h2>
            <div>
                <p class="body-copy">Our office is on Kimathi Street in central Nairobi. Suite 807 is on the eighth floor of Kimathi House.</p>
                <a class="tlink" href="{{ $mapUrl }}" target="_blank" rel="noopener noreferrer">Open Kimathi House in Maps <span class="ar" aria-hidden="true">&#8599;</span></a>
            </div>
        </div>
    </div>
</section>

@endsection
