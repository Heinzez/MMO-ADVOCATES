<?php

namespace Tests\Feature;

use App\Models\AuditEvent;
use App\Models\PublicContentItem;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PublicContentAccessTest extends TestCase
{
    use RefreshDatabase;

    public function test_staff_can_preview_and_publish_content_with_audit_and_public_allowlist(): void
    {
        $staff = User::factory()->create();
        $this->actingAs($staff)->postJson('/staff/content', [
            'slug' => 'contact', 'title' => 'Contact us', 'body' => 'Initial synthetic content',
        ])->assertCreated()->assertJsonPath('status', 'draft');

        $item = PublicContentItem::where('slug', 'contact')->firstOrFail();
        $this->getJson('/public-content/contact')->assertNotFound();
        $this->actingAs($staff)->postJson('/staff/content/'.$item->id.'/preview')
            ->assertOk()->assertJsonPath('preview', true)->assertJsonPath('body', 'Initial synthetic content');
        $this->actingAs($staff)->postJson('/staff/content/'.$item->id.'/publish')
            ->assertOk()->assertJsonPath('published_title', 'Contact us');

        $this->actingAs($staff)->patchJson('/staff/content/'.$item->id, [
            'title' => 'Unpublished revision', 'body' => 'Draft synthetic revision',
        ])->assertOk();

        $this->getJson('/public-content/contact')->assertOk()
            ->assertJsonPath('slug', 'contact')
            ->assertJsonPath('title', 'Contact us')
            ->assertJsonPath('body', 'Initial synthetic content')
            ->assertJsonStructure(['slug', 'title', 'body', 'published_at'])
            ->assertJsonMissingPath('updated_by')
            ->assertHeader('Cache-Control', 'max-age=60, public');

        $this->assertDatabaseHas('audit_events', ['actor_id' => $staff->id, 'event' => 'content.created', 'subject_id' => $item->id]);
        $this->assertDatabaseHas('audit_events', ['actor_id' => $staff->id, 'event' => 'content.published', 'subject_id' => $item->id]);
        $this->assertDatabaseHas('audit_events', ['actor_id' => $staff->id, 'event' => 'content.updated', 'subject_id' => $item->id]);
        $this->assertGreaterThanOrEqual(3, AuditEvent::where('subject_id', $item->id)->count());
    }

    public function test_only_admin_and_staff_can_edit_public_content(): void
    {
        $associate = User::factory()->associate()->create();
        $this->actingAs($associate)->getJson('/staff/content')->assertForbidden();
        $this->actingAs($associate)->postJson('/staff/content', [
            'slug' => 'services', 'title' => 'Services', 'body' => 'Synthetic',
        ])->assertForbidden();
        $this->actingAs(User::factory()->create())->getJson('/staff/cases')->assertForbidden();
        $this->getJson('/staff/users')->assertForbidden();

        $admin = User::factory()->admin()->create();
        $this->actingAs($admin)->postJson('/staff/content', [
            'slug' => 'services', 'title' => 'Services', 'body' => 'Synthetic',
        ])->assertCreated();
    }

    public function test_visitors_can_only_read_published_content(): void
    {
        $staff = User::factory()->create();
        PublicContentItem::create([
            'slug' => 'about', 'title' => 'Draft', 'body' => 'Private draft', 'status' => 'draft', 'updated_by' => $staff->id,
        ]);

        $this->getJson('/public-content/about')->assertNotFound();
        $this->getJson('/staff/content')->assertUnauthorized();
    }

    public function test_public_blade_pages_render_without_private_data(): void
    {
        $this->get('/')->assertOk()->assertViewIs('public.home')->assertSee('Legal services');
        $this->get('/services')->assertOk()->assertViewIs('public.services')->assertSee('Conveyancing');
        $this->get('/about')->assertOk()->assertViewIs('public.about')->assertSee('MMO Advocates LLP');
        $this->get('/contact')->assertOk()->assertViewIs('public.contact')->assertSee('0725 144 472');
    }

    public function test_inactive_editor_and_associate_cannot_reach_content_management_urls(): void
    {
        $item = PublicContentItem::create([
            'slug' => 'private-draft', 'title' => 'Draft', 'body' => 'Synthetic draft',
            'status' => 'draft', 'updated_by' => User::factory()->create()->id,
        ]);

        $this->getJson('/staff/content')->assertUnauthorized();
        $this->actingAs(User::factory()->create(['is_active' => false]))
            ->getJson('/staff/content')->assertForbidden();
        $this->actingAs(User::factory()->associate()->create())
            ->postJson('/staff/content/'.$item->id.'/publish')->assertForbidden();
        $this->getJson('/public-content/private-draft')->assertNotFound();
    }

    public function test_untrusted_content_is_not_rendered_as_markup_in_public_pages(): void
    {
        $staff = User::factory()->create();
        $markup = '<script>synthetic-xss()</script>';
        $item = PublicContentItem::create([
            'slug' => 'xss-check', 'title' => 'Synthetic title', 'body' => $markup,
            'status' => 'draft', 'updated_by' => $staff->id,
        ]);
        $this->actingAs($staff)->postJson('/staff/content/'.$item->id.'/publish')->assertOk();

        $this->getJson('/public-content/xss-check')
            ->assertOk()
            ->assertHeader('Content-Type', 'application/json')
            ->assertJsonPath('body', $markup);
        $this->get('/')->assertOk()->assertDontSee('synthetic-xss()', false);
    }
}
