<?php

namespace App\Policies;

use App\Enums\UserRole;
use App\Models\PublicContentItem;
use App\Models\User;

class PublicContentItemPolicy
{
    public function viewAny(User $user): bool
    {
        return $this->edit($user);
    }

    public function view(User $user, PublicContentItem $contentItem): bool
    {
        return $this->edit($user);
    }

    public function create(User $user): bool
    {
        return $this->edit($user);
    }

    public function update(User $user, PublicContentItem $contentItem): bool
    {
        return $this->edit($user);
    }

    public function publish(User $user, PublicContentItem $contentItem): bool
    {
        return $this->edit($user);
    }

    private function edit(User $user): bool
    {
        return $user->is_active && in_array($user->role, [UserRole::Admin, UserRole::Staff], true);
    }
}
