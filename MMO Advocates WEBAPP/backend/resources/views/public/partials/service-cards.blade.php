{{--
    Practice-area card grid.

    Reads the eight services from config/firm.php so the home and services
    pages never drift apart. Optional variable: $cardHref (where each card
    points; defaults to the services page).
--}}
@php $cardHref = $cardHref ?? url('/services'); @endphp
<div class="svc-grid">
    @foreach (config('firm.services') as $index => $service)
        <a class="svc" href="{{ $cardHref }}" aria-label="{{ $service['name'] }} — see our services">
            <span class="svc-num">{{ str_pad((string) ($index + 1), 2, '0', STR_PAD_LEFT) }}</span>
            <span class="svc-icon">@include('public.partials.icon', ['name' => $service['icon']])</span>
            <h3>{{ $service['name'] }}</h3>
            <p>{{ $service['summary'] }}</p>
            <span class="ar" aria-hidden="true">&#8599;</span>
        </a>
    @endforeach
</div>
