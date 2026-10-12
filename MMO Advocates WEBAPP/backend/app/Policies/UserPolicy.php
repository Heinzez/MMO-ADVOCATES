<?php

namespace App\Policies;

use App\Enums\UserRole;
use App\Models\User;

class UserPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->is_active && $user->role === UserRole::Admin;
    }

    public function view(User $user, User $target): bool
    {
        return $user->is_active && $user->role === UserRole::Admin;
    }

    public function create(User $user): bool
    {
        return $user->is_active && $user->role === UserRole::Admin;
    }

    public function update(User $user, User $target): bool
    {
        return $user->is_active && $user->role === UserRole::Admin;
    }

    public function deactivate(User $user, User $target): bool
    {
        return $user->is_active && $user->role === UserRole::Admin && $user->id !== $target->id;
    }

    public function reactivate(User $user): bool
    {
        return $user->is_active && $user->role === UserRole::Admin;
    }
}
