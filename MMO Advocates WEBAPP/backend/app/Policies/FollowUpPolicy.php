<?php

namespace App\Policies;

use App\Enums\UserRole;
use App\Models\CaseRecord;
use App\Models\FollowUp;
use App\Models\User;

class FollowUpPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->is_active && in_array($user->role, [UserRole::Admin, UserRole::Associate], true);
    }

    public function view(User $user, FollowUp $followUp): bool
    {
        if (! $user->is_active) {
            return false;
        }

        return $user->role === UserRole::Admin
            || ($user->role === UserRole::Associate && $followUp->caseRecord()->where('assigned_lawyer_id', $user->id)->exists());
    }

    public function create(User $user, CaseRecord $case): bool
    {
        if (! $user->is_active) {
            return false;
        }

        return $user->role === UserRole::Admin
            || ($user->role === UserRole::Associate && $case->assigned_lawyer_id === $user->id);
    }

    public function update(User $user, FollowUp $followUp): bool
    {
        return $this->view($user, $followUp);
    }
}
