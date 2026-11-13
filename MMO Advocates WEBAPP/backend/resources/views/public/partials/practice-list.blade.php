<ul class="practice-list" aria-label="Our practice areas">
@foreach (['Conveyancing (land matters)', 'Criminal', 'Environmental and land matters', 'Succession', 'Civil litigation', 'Small claims', 'Divorce', 'Child custody'] as $index => $service)
<li><a href="/contact" aria-label="{{ 'Contact us about ' . $service }}"><span class="practice-number" aria-hidden="true">{{ str_pad((string) ($index + 1), 2, '0', STR_PAD_LEFT) }}</span><span class="practice-name">{{ $service }}</span><span class="arrow" aria-hidden="true">↗</span></a></li>
@endforeach
</ul>
