<?php

namespace App\Http\Controllers;

use App\Models\PublicContentItem;
use Illuminate\Database\QueryException;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Log;
use PDOException;

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
        /*
         * Every public page carries complete static copy, and a published
         * content item only overrides its heading and body. A database that is
         * unreachable must therefore degrade to that static copy rather than
         * return an error page to a visitor.
         */
        $item = null;

        if (config('firm.content_overrides')) {
            try {
                $item = PublicContentItem::query()
                    ->where('status', 'published')
                    ->where('published_slug', $slug)
                    ->first();
            } catch (QueryException|PDOException $exception) {
                // A warning, not a reported exception: a stack trace on every
                // request would bury the real signal in the runtime logs.
                Log::warning('Published content unavailable; serving static page copy.', [
                    'slug' => $slug,
                    'reason' => $exception->getMessage(),
                ]);
            }
        }

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
