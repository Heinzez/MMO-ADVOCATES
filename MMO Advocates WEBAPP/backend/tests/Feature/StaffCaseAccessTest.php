<?php

namespace Tests\Feature;

use App\Models\AuditEvent;
use App\Models\CaseRecord;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class StaffCaseAccessTest extends TestCase
{
    use RefreshDatabase;

    public function test_case_lists_are_scoped_to_admin_and_associate_assignments(): void
    {
        $associate = User::factory()->associate()->create();
        $otherAssociate = User::factory()->associate()->create();
        CaseRecord::factory()->create(['client_name' => 'Synthetic assigned case', 'assigned_lawyer_id' => $associate->id]);
        CaseRecord::factory()->create(['client_name' => 'Synthetic other case', 'assigned_lawyer_id' => $otherAssociate->id]);

        $this->actingAs($associate)->getJson('/staff/cases')
            ->assertOk()
            ->assertJsonCount(1)
            ->assertJsonFragment(['client_name' => 'Synthetic assigned case'])
            ->assertJsonMissing(['client_name' => 'Synthetic other case']);

        $this->actingAs(User::factory()->admin()->create())->getJson('/staff/cases')
            ->assertOk()
            ->assertJsonCount(2);
    }

    public function test_staff_cannot_access_case_records_and_associate_creation_assigns_to_self(): void
    {
        $staff = User::factory()->create();
        $associate = User::factory()->associate()->create();
        $otherAssociate = User::factory()->associate()->create();
        $case = CaseRecord::factory()->create(['assigned_lawyer_id' => $associate->id]);

        $this->actingAs($staff)->getJson('/staff/cases')->assertForbidden();
        $this->actingAs($staff)->getJson('/staff/cases/'.$case->id)->assertForbidden();

        $this->actingAs($associate)->postJson('/staff/cases', [
            'client_name' => 'Synthetic new client',
            'client_contact' => 'synthetic@example.test',
            'type' => 'civil litigation',
            'status' => 'synthetic-status',
            'opened_on' => '2026-10-11',
            'assigned_lawyer_id' => $otherAssociate->id,
        ])->assertCreated();

        $this->assertDatabaseHas('cases', [
            'client_name' => 'Synthetic new client',
            'assigned_lawyer_id' => $associate->id,
        ]);
    }

    public function test_deactivated_accounts_are_logged_out_of_protected_routes(): void
    {
        $inactiveAdmin = User::factory()->admin()->create(['is_active' => false]);

        $this->actingAs($inactiveAdmin)->getJson('/staff/cases')->assertForbidden();

        $this->assertGuest();
    }

    public function test_admin_can_soft_delete_and_restore_case_with_actor_audit(): void
    {
        $admin = User::factory()->admin()->create();
        $associate = User::factory()->associate()->create();
        $case = CaseRecord::factory()->create(['assigned_lawyer_id' => $associate->id]);

        $this->actingAs($admin)->deleteJson('/staff/cases/'.$case->id)->assertNoContent();
        $this->assertSoftDeleted('cases', ['id' => $case->id]);
        $this->assertDatabaseHas('audit_events', [
            'actor_id' => $admin->id,
            'event' => 'case.deleted',
            'subject_id' => $case->id,
        ]);

        $this->actingAs($admin)->postJson('/staff/cases/'.$case->id.'/restore')->assertOk();
        $this->assertDatabaseHas('cases', ['id' => $case->id, 'deleted_at' => null]);
        $this->assertSame(2, AuditEvent::where('subject_id', $case->id)->count());
    }
}
