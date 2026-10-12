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
            ->assertHeader('Cache-Control', 'public, max-age=60');

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
        $this->getJson('/staff/cases')->assertForbidden();
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
}
