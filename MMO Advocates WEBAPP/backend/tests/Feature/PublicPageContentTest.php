<?php

namespace Tests\Feature;

use App\Models\PublicContentItem;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Schema;
use Tests\TestCase;

class PublicPageContentTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_routes_render_their_view_and_keep_static_fallbacks_without_publications(): void
    {
        $pages = [
            '/' => ['public.home', 'Clarity in counsel'],
            '/services' => ['public.services', 'Conveyancing'],
            '/about' => ['public.about', 'MMO Advocates LLP'],
            '/contact' => ['public.contact', '0725 144 472'],
        ];

        foreach ($pages as $path => [$view, $fallback]) {
            $response = $this->get($path);

            $response->assertOk()
                ->assertViewIs($view)
                ->assertViewHas('publishedContent', null)
                ->assertSee($fallback);
        }
    }

    public function test_published_content_is_sent_only_to_its_matching_public_page(): void
    {
        $editor = User::factory()->create();
        $this->publish('home', 'Home title', 'Home body', $editor);

        $home = $this->get('/')->assertOk()->assertViewIs('public.home');
        self::assertSame([
            'slug' => 'home',
            'title' => 'Home title',
            'body' => 'Home body',
            'published_at' => '2026-10-21T12:00:00.000000Z',
        ], $home->viewData('publishedContent'));
        $home->assertSee('Home title')->assertSee('Home body');

        foreach ([
            '/services' => 'public.services',
            '/about' => 'public.about',
            '/contact' => 'public.contact',
        ] as $path => $view) {
            $this->get($path)
                ->assertOk()
                ->assertViewIs($view)
                ->assertViewHas('publishedContent', null)
                ->assertDontSee('Home title')
                ->assertDontSee('Home body');
        }
    }

    public function test_only_published_snapshot_fields_are_passed_and_markup_is_escaped(): void
    {
        $editor = User::factory()->create(['email' => 'private-editor@example.test']);
        $markup = '<script>synthetic-xss()</script>';
        $this->publish('services', 'Safe title', $markup, $editor);

        $response = $this->get('/services')->assertOk()->assertViewIs('public.services');
        self::assertSame(['slug', 'title', 'body', 'published_at'], array_keys($response->viewData('publishedContent')));
        $response->assertSee('Safe title')
            ->assertSee('&lt;script&gt;synthetic-xss()&lt;/script&gt;', false)
            ->assertDontSee('<script>synthetic-xss()</script>', false)
            ->assertDontSee('private-editor@example.test')
            ->assertDontSee('updated_by')
            ->assertDontSee('published_body');
    }

    public function test_draft_content_never_appears_in_public_html_or_view_data(): void
    {
        $editor = User::factory()->create(['email' => 'draft-editor@example.test']);
        PublicContentItem::create([
            'slug' => 'about',
            'title' => 'Draft only title',
            'body' => 'Draft only body',
            'status' => 'draft',
            'updated_by' => $editor->id,
        ]);

        $this->get('/about')
            ->assertOk()
            ->assertViewHas('publishedContent', null)
            ->assertDontSee('Draft only title')
            ->assertDontSee('Draft only body')
            ->assertDontSee('draft-editor@example.test');
    }

    public function test_public_pages_render_static_copy_when_the_content_table_is_unavailable(): void
    {
        Schema::drop('public_content_items');

        $pages = [
            '/' => 'Clarity in counsel.',
            '/services' => 'Conveyancing',
            '/about' => 'MMO Advocates LLP',
            '/contact' => '0725 144 472',
        ];

        foreach ($pages as $path => $copy) {
            $this->get($path)
                ->assertOk()
                ->assertViewHas('publishedContent', null)
                ->assertSee($copy);
        }
    }

    public function test_published_content_is_not_applied_when_overrides_are_disabled(): void
    {
        config(['firm.content_overrides' => false]);
        $this->publish('home', 'Home title', 'Home body', User::factory()->create());

        $this->get('/')
            ->assertOk()
            ->assertViewHas('publishedContent', null)
            ->assertDontSee('Home title')
            ->assertDontSee('Home body')
            ->assertSee('Clarity in counsel.');
    }

    private function publish(string $slug, string $title, string $body, User $editor): void
    {
        $item = PublicContentItem::create([
            'slug' => $slug,
            'title' => $title,
            'body' => $body,
            'status' => 'draft',
            'updated_by' => $editor->id,
        ]);
        $item->forceFill([
            'status' => 'published',
            'published_slug' => $slug,
            'published_title' => $title,
            'published_body' => $body,
            'published_at' => '2026-10-21 12:00:00',
        ])->save();
    }
}
