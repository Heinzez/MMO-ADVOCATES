@extends('layouts.public')

@php
    $publicTitle = data_get($publishedContent ?? [], 'title');
    $publicBody = data_get($publishedContent ?? [], 'body');
    $phoneLink = 'tel:'.config('firm.phone_link');
@endphp

@section('title'){{ $publicTitle ?: 'About us' }}@endsection
@section('description', 'About MMO Advocates LLP, a law firm at Kimathi House in Nairobi, Kenya, working in litigation, conveyancing, legal drafting, mediation and research.')

@section('content')

@include('public.partials.hero', [
    'eyebrow' => 'About us',
    'title' => $publicTitle ?: 'A Nairobi practice.',
    'accent' => $publicTitle ? null : 'A personal approach.',
    'lead' => $publicBody ?: 'We are MMO Advocates LLP, a law firm at Kimathi House built on careful preparation, straight answers and steady representation.',
    'primaryLabel' => 'Speak to our office',
    'primaryHref' => $phoneLink,
    'secondaryLabel' => 'See our practice areas',
    'secondaryHref' => url('/services'),
    'note' => 'Acting for individuals and businesses in Nairobi',
])

{{-- Who we are --}}
<section class="section sec-cream">
    <div class="wrap">
        <p class="eyebrow">Who we are</p>
        <div class="split">
            <h2>Legal experience. <span class="accent">Human understanding.</span></h2>
            <div>
                <p class="lede">We are a law firm based at Kimathi House in Nairobi, acting for individuals and businesses across a range of legal matters.</p>
                <p class="body-copy">Our work begins with understanding the situation in front of us before advising on it. We explain the options plainly, set out what each one is likely to involve, and then do the preparation that the matter requires. Where a dispute can be resolved without litigation, we say so.</p>
                <a class="tlink tlink-rule" href="{{ url('/services') }}">See our practice areas <span class="ar" aria-hidden="true">&rarr;</span></a>
            </div>
        </div>
    </div>
</section>

{{-- Mission and vision --}}
<section class="section sec-dark">
    <div class="wrap">
        <p class="eyebrow">Mission and vision</p>
        <div class="split">
            <div>
                <h3 class="label">Our mission</h3>
                <p class="body-copy">To provide legal representation that is thorough, accessible and honest, so that every client understands their position and the steps being taken on their behalf.</p>
            </div>
            <div>
                <h3 class="label">Our vision</h3>
                <p class="body-copy">To be a Nairobi practice known for integrity and careful work, trusted by clients to handle matters that affect their property, their livelihoods and their families.</p>
            </div>
        </div>
    </div>
</section>

{{-- Areas of work --}}
<section class="section sec-cream">
    <div class="wrap">
        <p class="eyebrow">Areas of work</p>
        <div class="split">
            <h2>Where we <span class="accent">practise.</span></h2>
            <div>
                <p class="body-copy">Our areas of work are litigation, conveyancing, legal drafting, mediation and legal research. Within these, our practice areas run from land and succession matters to criminal defence, family matters and civil claims.</p>
                <ul class="pills">
                    @foreach (config('firm.areas_of_work') as $area)
                        <li>{{ $area }}</li>
                    @endforeach
                </ul>
            </div>
        </div>
    </div>
</section>

{{-- Professional values --}}
<section class="section sec-dark approach">
    <div class="wrap">
        <p class="eyebrow">Professional values</p>
        <div class="split">
            <h2>Professional service. <span class="accent">Personal commitment.</span></h2>
            <ol class="values">
                <li>
                    <span class="value-num" aria-hidden="true">01</span>
                    <div>
                        <p class="value-name">Integrity</p>
                        <p class="value-note">Honest, principled legal guidance, including when the answer is not the one a client hoped for.</p>
                    </div>
                </li>
                <li>
                    <span class="value-num" aria-hidden="true">02</span>
                    <div>
                        <p class="value-name">Diligence</p>
                        <p class="value-note">Careful attention to every matter, with deadlines and filings tracked rather than remembered.</p>
                    </div>
                </li>
                <li>
                    <span class="value-num" aria-hidden="true">03</span>
                    <div>
                        <p class="value-name">Clarity</p>
                        <p class="value-note">Communication you can understand, free of unnecessary legal language.</p>
                    </div>
                </li>
                <li>
                    <span class="value-num" aria-hidden="true">04</span>
                    <div>
                        <p class="value-name">Confidentiality</p>
                        <p class="value-note">Client information handled with the care the law and our professional duties require.</p>
                    </div>
                </li>
            </ol>
        </div>
    </div>
</section>

@include('public.partials.contact-cta', [
    'ctaTitle' => 'Come and see us',
    'ctaAccent' => 'at Kimathi House.',
    'ctaCopy' => 'Our office is on Kimathi Street in central Nairobi. To discuss a matter, call us directly.',
])

@endsection
