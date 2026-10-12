<?php

namespace Tests\Feature\Settings;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProfileUpdateTest extends TestCase
{
    use RefreshDatabase;

    public function test_uncommissioned_profile_management_routes_are_unavailable(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)->get('/settings/profile')->assertNotFound();
        $this->actingAs($user)->patch('/settings/profile')->assertNotFound();
        $this->actingAs($user)->delete('/settings/profile')->assertNotFound();
    }
}
