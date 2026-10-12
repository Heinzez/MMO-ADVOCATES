<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Tests\TestCase;

class StaffUserManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_only_admin_can_list_and_create_staff_accounts(): void
    {
        Notification::fake();
        $admin = User::factory()->admin()->create();
        $associate = User::factory()->associate()->create();

        $this->actingAs($associate)->getJson('/staff/users')->assertForbidden();

        $this->actingAs($admin)->postJson('/staff/users', [
            'name' => 'Synthetic Staff User',
            'email' => 'synthetic-staff@example.test',
            'role' => 'staff',
        ])->assertCreated()
            ->assertJsonPath('user.role', 'staff')
            ->assertJsonPath('user.is_active', true)
            ->assertJsonPath('password_reset_requested', true)
            ->assertJsonMissingPath('user.password');

        $created = User::where('email', 'synthetic-staff@example.test')->firstOrFail();
        Notification::assertSentTo($created, ResetPassword::class);
        $this->assertDatabaseHas('audit_events', [
            'actor_id' => $admin->id,
            'event' => 'user.created',
            'subject_id' => $created->id,
        ]);
    }

    public function test_admin_can_deactivate_an_account_but_not_themselves(): void
    {
        $admin = User::factory()->admin()->create();
        $associate = User::factory()->associate()->create();

        $this->actingAs($admin)->patchJson('/staff/users/'.$associate->id.'/active', ['is_active' => false])
            ->assertOk()
            ->assertJsonPath('is_active', false);

        $this->actingAs($admin)->patchJson('/staff/users/'.$admin->id.'/active', ['is_active' => false])
            ->assertForbidden();

        $this->assertDatabaseHas('audit_events', [
            'actor_id' => $admin->id,
            'event' => 'user.deactivated',
            'subject_id' => $associate->id,
        ]);
    }
}
