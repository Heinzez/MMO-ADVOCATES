{{--
    Shared page hero.

    Every public page opens with this block so the four pages share one
    treatment: navy field, rotated outline figure, gold eyebrow, a two-line
    display heading whose second line is gold italic, a lead paragraph,
    a gold primary action, an optional text link and an optional side note.

    Required: $eyebrow, $title, $lead, $primaryLabel, $primaryHref
    Optional: $accent, $secondaryLabel, $secondaryHref, $note, $noteNumber
--}}
<section class="hero">
    <div class="hero-figure" aria-hidden="true"></div>
    <div class="wrap hero-wrap">
        <div class="hero-copy">
            <p class="eyebrow">{{ $eyebrow }}</p>
            <h1>{{ $title }}@if (! empty($accent))<span class="accent">{{ $accent }}</span>@endif</h1>
            <p class="hero-lead">{{ $lead }}</p>
            <div class="hero-actions">
                <a class="btn btn-gold" href="{{ $primaryHref }}">{{ $primaryLabel }} <span class="ar" aria-hidden="true">&#8599;</span></a>
                @if (! empty($secondaryLabel))
                    <a class="tlink" href="{{ $secondaryHref }}">{{ $secondaryLabel }} <span class="ar" aria-hidden="true">&rarr;</span></a>
                @endif
            </div>
        </div>
        @if (! empty($note))
            <div class="hero-note">
                <span class="hero-note-num" aria-hidden="true">{{ $noteNumber ?? '01' }}</span>
                <p class="hero-note-text">{{ $note }}</p>
            </div>
        @endif
    </div>
</section>
