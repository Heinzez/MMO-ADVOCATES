<?php

namespace Tests\Unit;

use App\Enums\UserRole;
use App\Models\CaseRecord;
use App\Models\User;
use App\Policies\CaseRecordPolicy;
use App\Policies\UserPolicy;
use PHPUnit\Framework\TestCase;

class CaseRecordPolicyTest extends TestCase
{
    public function test_admin_can_view_any_case_and_associate_can_view_only_assigned_case(): void
    {
        $policy = new CaseRecordPolicy;
        $admin = $this->user(1, UserRole::Admin);
        $associate = $this->user(2, UserRole::Associate);
        $assigned = (new CaseRecord)->forceFill(['assigned_lawyer_id' => 2]);
        $other = (new CaseRecord)->forceFill(['assigned_lawyer_id' => 3]);

        self::assertTrue($policy->viewAny($admin));
        self::assertTrue($policy->viewAny($associate));
        self::assertTrue($policy->view($admin, $other));
        self::assertTrue($policy->view($associate, $assigned));
        self::assertTrue($policy->create($associate));
        self::assertFalse($policy->view($associate, $other));
    }

    public function test_staff_and_deactivated_accounts_are_denied_case_access(): void
    {
        $policy = new CaseRecordPolicy;
        $case = (new CaseRecord)->forceFill(['assigned_lawyer_id' => 2]);
        $staff = $this->user(2, UserRole::Staff);
        $inactiveAdmin = $this->user(3, UserRole::Admin, false);

        self::assertFalse($policy->viewAny($staff));
        self::assertFalse($policy->view($staff, $case));
        self::assertFalse($policy->create($staff));
        self::assertFalse($policy->viewAny($inactiveAdmin));
        self::assertFalse($policy->view($inactiveAdmin, $case));
    }

    public function test_only_an_active_admin_can_manage_users(): void
    {
        $policy = new UserPolicy;
        self::assertTrue($policy->viewAny($this->user(1, UserRole::Admin)));
        self::assertFalse($policy->viewAny($this->user(2, UserRole::Associate)));
        self::assertFalse($policy->viewAny($this->user(3, UserRole::Staff)));
        self::assertFalse($policy->viewAny($this->user(4, UserRole::Admin, false)));
    }

    private function user(int $id, UserRole $role, bool $active = true): User
    {
        return (new User)->forceFill(['id' => $id, 'role' => $role, 'is_active' => $active]);
    }
}
