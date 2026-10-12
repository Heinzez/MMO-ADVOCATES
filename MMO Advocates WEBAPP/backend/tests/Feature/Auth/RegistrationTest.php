<?php

namespace Tests\Feature\Auth;

use Tests\TestCase;

class RegistrationTest extends TestCase
{
    public function test_public_self_registration_is_not_available(): void
    {
        $this->get('/register')->assertNotFound();

        $this->post('/register', [
            'name' => 'Synthetic Visitor',
            'email' => 'visitor@example.test',
            'password' => 'a-long-test-password',
            'password_confirmation' => 'a-long-test-password',
        ])->assertNotFound();
    }

    public function test_uncommissioned_profile_deletion_and_passkey_discovery_routes_are_absent(): void
    {
        $this->delete('/settings/profile')->assertNotFound();
        $this->get('/.well-known/passkey-endpoints')->assertNotFound();
    }
}
