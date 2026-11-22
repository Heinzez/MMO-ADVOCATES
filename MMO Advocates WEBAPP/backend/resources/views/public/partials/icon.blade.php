{{--
    Inline practice-area icons.

    Drawn inline so the public pages need no icon font, no extra request and no
    third-party script. Each icon inherits the surrounding text colour.

    Usage: @include('public.partials.icon', ['name' => 'scales'])
--}}
@php
    $paths = [
        'home' => '<path d="M3 10.4 12 3.2l9 7.2"/><path d="M5.6 9.4V20.8h12.8V9.4"/>',
        'scales' => '<path d="M12 3.2v17.6"/><path d="M6 6.4h12"/><path d="M6 6.4 2.8 13.4h6.4L6 6.4Z"/><path d="M18 6.4l-3.2 7h6.4l-3.2-7Z"/><path d="M8 20.8h8"/>',
        'leaf' => '<path d="M4.8 19.6c8.4 1.6 14.4-3.2 14.4-12.4 0 0-9.2-1.6-12.4 3.2-2 3.2-2 7.2-2 9.2Z"/><path d="M4.8 19.6c1.6-4.8 4.8-8 8.8-10"/>',
        'sparkle' => '<path d="M12 2.6 14 9.9l7.4 2.1-7.4 2.1-2 7.3-2-7.3L2.6 12 10 9.9 12 2.6Z"/>',
        'columns' => '<path d="M3 9.6 12 4.2l9 5.4"/><path d="M6 10.4v8M10 10.4v8M14 10.4v8M18 10.4v8"/><path d="M3.6 20.8h16.8"/>',
        'receipt' => '<path d="M6 3.2h12v17.6l-2-1.4-2 1.4-2-1.4-2 1.4-2-1.4-2 1.4V3.2Z"/><path d="M9.2 8.4h5.6M9.2 12.4h5.6"/>',
        'rings' => '<path d="m12 3.2 6 6-6 11.6-6-11.6 6-6Z"/><path d="M6 9.2h12"/><path d="m9.6 9.2 2.4 11.6 2.4-11.6"/>',
        'shield' => '<path d="M12 3.2 5.2 6.1v5.9c0 4.4 2.9 7.5 6.8 8.8 3.9-1.3 6.8-4.4 6.8-8.8V6.1L12 3.2Z"/><path d="m9.4 12.1 1.8 1.8 3.4-3.5"/>',
    ];
    $path = $paths[$name] ?? '';
@endphp
@if ($path)
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round" focusable="false" aria-hidden="true">{!! $path !!}</svg>
@endif
