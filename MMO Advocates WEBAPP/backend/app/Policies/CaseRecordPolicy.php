<?php

namespace App\Policies;

use App\Enums\UserRole;
use App\Models\CaseRecord;
use App\Models\User;

class CaseRecordPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->is_active && in_array($user->role, [UserRole::Admin, UserRole::Associate], true);
    }

    public function view(User $user, CaseRecord $case): bool
    {
        return $user->is_active && ($user->role === UserRole::Admin
            || ($user->role === UserRole::Associate && $case->assigned_lawyer_id === $user->id));
    }

    public function create(User $user): bool
    {
        return $user->is_active && in_array($user->role, [UserRole::Admin, UserRole::Associate], true);
    }

    public function update(User $user, CaseRecord $case): bool
    {
        return $this->view($user, $case);
    }

    public function delete(User $user, CaseRecord $case): bool
    {
        return $user->is_active && $user->role === UserRole::Admin;
    }

    public function restore(User $user, CaseRecord $case): bool
    {
        return $user->is_active && $user->role === UserRole::Admin;
    }

    public function forceDelete(User $user, CaseRecord $case): bool
    {
        return false;
    }
}
