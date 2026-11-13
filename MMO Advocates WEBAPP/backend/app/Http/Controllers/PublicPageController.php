<?php

namespace App\Http\Controllers;

use App\Models\PublicContentItem;
use Illuminate\Http\Response;

class PublicPageController extends Controller
{
    public function home(): Response
    {
        return $this->page('public.home', 'home');
    }

    public function services(): Response
    {
        return $this->page('public.services', 'services');
    }

    public function about(): Response
    {
        return $this->page('public.about', 'about');
    }

    public function contact(): Response
    {
        return $this->page('public.contact', 'contact');
    }

    private function page(string $view, string $slug): Response
    {
        $item = PublicContentItem::query()
            ->where('status', 'published')
            ->where('published_slug', $slug)
            ->first();

        $publishedContent = $item === null ? null : [
            'slug' => $item->published_slug,
            'title' => $item->published_title,
            'body' => $item->published_body,
            'published_at' => $item->published_at?->toISOString(),
        ];

        $response = response()->view($view, compact('publishedContent'));

        if ($publishedContent !== null) {
            $originalView = $response->original;
            $content = '<section class="section section-light" aria-label="Published page content"><div class="shell">'
                .'<h2 class="section-title">'.e($publishedContent['title']).'</h2>'
                .'<div class="about-copy">'.nl2br(e($publishedContent['body']), false).'</div>'
                .'</div></section>';

            $response->setContent(str_replace('</main>', $content.'</main>', $response->getContent()));
            $response->original = $originalView;
        }

        return $response;
    }
}
