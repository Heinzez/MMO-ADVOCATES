<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['slug', 'title', 'body', 'status', 'updated_by', 'published_at'])]
class PublicContentItem extends Model
{
    protected function casts(): array
    {
        return ['published_at' => 'immutable_datetime'];
    }

    public function editor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }
}
