<?php

namespace Database\Factories;

use App\Models\CaseRecord;
use App\Models\FollowUp;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<FollowUp>
 */
class FollowUpFactory extends Factory
{
    protected $model = FollowUp::class;

    public function definition(): array
    {
        return [
            'case_id' => CaseRecord::factory(),
            'due_on' => fake()->date(),
            'note' => 'Synthetic follow-up '.fake()->sentence(),
            'status' => 'pending',
            'assignee_id' => User::factory()->associate(),
        ];
    }
}
