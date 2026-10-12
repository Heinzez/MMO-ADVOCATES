<?php

namespace App\Console\Commands;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Validator;

class CreateFirstAdmin extends Command
{
    protected $signature = 'mmo:create-first-admin';

    protected $description = 'Interactively provision the initial administrator account';

    public function handle(): int
    {
        if (User::query()->where('role', UserRole::Admin->value)->exists()) {
            $this->error('An administrator account already exists. Use the authenticated user-management workflow.');

            return self::FAILURE;
        }

        $input = [
            'name' => $this->ask('Administrator name'),
            'email' => $this->ask('Administrator email'),
            'password' => $this->secret('Password (at least 12 characters)'),
        ];
        $confirmation = $this->secret('Confirm password');

        $validator = Validator::make([
            ...$input,
            'password_confirmation' => $confirmation,
        ], [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:12', 'confirmed'],
        ]);

        if ($validator->fails()) {
            foreach ($validator->errors()->all() as $error) {
                $this->error($error);
            }

            return self::FAILURE;
        }

        $user = new User;
        $user->forceFill([
            'name' => $input['name'],
            'email' => $input['email'],
            'password' => $input['password'],
            'role' => UserRole::Admin,
            'is_active' => true,
        ])->save();

        $this->info('Initial administrator account created.');

        return self::SUCCESS;
    }
}
