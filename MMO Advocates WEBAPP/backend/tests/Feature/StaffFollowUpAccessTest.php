<?php

namespace Tests\Feature;

use App\Models\CaseRecord;
use App\Models\FollowUp;
use App\Models\User;
use Carbon\CarbonImmutable;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class StaffFollowUpAccessTest extends TestCase
{
    use RefreshDatabase;

    public function test_associate_can_manage_follow_ups_only_under_assigned_cases(): void
    {
        $associate = User::factory()->associate()->create();
        $otherAssociate = User::factory()->associate()->create();
        $case = CaseRecord::factory()->create(['assigned_lawyer_id' => $associate->id]);
        $otherCase = CaseRecord::factory()->create(['assigned_lawyer_id' => $otherAssociate->id]);

        $this->actingAs($associate)->postJson('/staff/cases/'.$case->id.'/follow-ups', [
            'due_on' => '2026-10-12',
            'note' => 'Synthetic follow-up note',
        ])->assertCreated()->assertJsonFragment([
            'status' => 'pending',
            'assignee_id' => $associate->id,
        ]);

        $followUp = FollowUp::where('case_id', $case->id)->firstOrFail();
        $this->actingAs($associate)->patchJson('/staff/follow-ups/'.$followUp->id, [
            'status' => 'done',
        ])->assertOk()->assertJsonFragment(['status' => 'done']);

        $this->actingAs($associate)->getJson('/staff/cases/'.$otherCase->id.'/follow-ups')->assertForbidden();
    }

    public function test_dashboard_uses_nairobi_calendar_date_and_assignment_scope(): void
    {
        CarbonImmutable::setTestNow(CarbonImmutable::parse('2026-10-11 21:30:00', 'UTC'));
        try {
            $associate = User::factory()->associate()->create();
            $otherAssociate = User::factory()->associate()->create();
            $case = CaseRecord::factory()->create(['assigned_lawyer_id' => $associate->id]);
            $otherCase = CaseRecord::factory()->create(['assigned_lawyer_id' => $otherAssociate->id]);

            FollowUp::factory()->create(['case_id' => $case->id, 'assignee_id' => $associate->id, 'due_on' => '2026-10-12']);
            FollowUp::factory()->create(['case_id' => $case->id, 'assignee_id' => $associate->id, 'due_on' => '2026-10-11']);
            FollowUp::factory()->create(['case_id' => $otherCase->id, 'assignee_id' => $otherAssociate->id, 'due_on' => '2026-10-10']);

            $this->actingAs($associate)->getJson('/staff/dashboard')
                ->assertOk()
                ->assertJsonPath('date', '2026-10-12')
                ->assertJsonPath('timezone', 'Africa/Nairobi')
                ->assertJsonCount(1, 'today')
                ->assertJsonCount(1, 'overdue');
        } finally {
            CarbonImmutable::setTestNow();
        }
    }
}
