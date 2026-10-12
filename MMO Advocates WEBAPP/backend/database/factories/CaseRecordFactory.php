<?php

namespace Database\Factories;

use App\Models\CaseRecord;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<CaseRecord>
 */
class CaseRecordFactory extends Factory
{
    protected $model = CaseRecord::class;

    public function definition(): array
    {
        return [
            'client_name' => 'Synthetic Client '.fake()->unique()->numberBetween(1, 999999),
            'client_contact' => 'synthetic-'.fake()->unique()->numberBetween(1, 999999).'@example.test',
            'type' => fake()->randomElement(['conveyancing', 'civil litigation', 'succession']),
            'case_number' => fake()->optional()->bothify('SYN-####/26'),
            'court' => 'Synthetic Court '.fake()->unique()->numberBetween(1, 999999),
            'status' => 'synthetic-status',
            'assigned_lawyer_id' => User::factory()->associate(),
            'opened_on' => fake()->date(),
        ];
    }
}
