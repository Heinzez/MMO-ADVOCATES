{{--
    Firm logo component.

    Renders the temporary text monogram specified in the brand brief. When the
    firm supplies the official logo as PNG, JPG or SVG, replace ONLY the
    <span class="brand-mark"> element below with, for example:

        <img class="brand-mark brand-mark-image"
             src="{{ asset('images/brand/logo.svg') }}" alt="" width="52" height="52">

    and add `.brand-mark-image { border: 0; object-fit: contain; }` to the
    stylesheet. No other file needs to change.

    Optional variables: $href (link target), $compact (smaller monogram).
--}}
<a class="brand{{ ($compact ?? false) ? ' brand-compact' : '' }}" href="{{ $href ?? url('/') }}" aria-label="{{ config('firm.name') }}, home">
    <span class="brand-mark" aria-hidden="true">{{ config('firm.monogram') }}</span>
    <span class="brand-text">
        <span class="brand-name">{{ config('firm.name') }}</span>
        <span class="brand-tag">{{ config('firm.tagline') }}</span>
    </span>
</a>
