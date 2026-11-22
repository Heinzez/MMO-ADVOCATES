{{--
    Closing contact block.

    Shared by the home, services and about pages so each one ends with the
    same call to telephone the firm, beside the office details. The contact
    page sets these details out in full instead of using this block.

    Optional: $ctaTitle, $ctaAccent, $ctaCopy
--}}
<section class="section sec-cream">
    <div class="wrap">
        <p class="eyebrow">Start a conversation</p>
        <div class="split">
            <div>
                <h2>{{ $ctaTitle ?? "Let's discuss" }} <span class="accent">{{ $ctaAccent ?? 'how we can help.' }}</span></h2>
                <p class="body-copy copy-top">{{ $ctaCopy ?? 'Reach out to our office directly. Our team will be glad to hear from you and to discuss your enquiry.' }}</p>
                <a class="btn btn-navy" href="tel:{{ config('firm.phone_link') }}">Call our office <span class="ar" aria-hidden="true">&#8599;</span></a>
            </div>
            <div class="details-col">
                <dl class="details">
                    <div class="detail">
                        <dt>Phone</dt>
                        <dd><a href="tel:{{ config('firm.phone_link') }}">{{ config('firm.phone_display') }}</a></dd>
                    </div>
                    <div class="detail">
                        <dt>Email</dt>
                        <dd><a href="mailto:{{ config('firm.email') }}">{{ config('firm.email') }}</a></dd>
                    </div>
                    <div class="detail">
                        <dt>Visit our office</dt>
                        <dd>
                            <address>
                                @foreach (config('firm.address_lines') as $line){{ $line }}<br>@endforeach
                                {{ config('firm.postal_address') }}
                            </address>
                        </dd>
                    </div>
                </dl>
            </div>
        </div>
    </div>
</section>
