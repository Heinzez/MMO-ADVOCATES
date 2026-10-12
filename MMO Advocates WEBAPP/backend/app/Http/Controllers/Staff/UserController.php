<?php

namespace App\Http\Controllers\Staff;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Models\AuditEvent;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Throwable;

class UserController extends Controller
{
    public function index(): JsonResponse
    {
        $this->authorize('viewAny', User::class);

        return $this->privateJson(User::query()->orderBy('name')->get(['id', 'name', 'email', 'role', 'is_active']));
    }

    public function store(Request $request): JsonResponse
    {
        $this->authorize('create', User::class);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'role' => ['required', Rule::in(array_column(UserRole::cases(), 'value'))],
        ]);

        $user = DB::transaction(function () use ($request, $validated): User {
            $user = new User;
            $user->forceFill([
                ...$validated,
                'password' => Str::random(64),
                'is_active' => true,
            ])->save();

            $this->audit($request, 'user.created', $user);

            return $user;
        });

        $resetLinkRequested = false;
        try {
            $resetLinkRequested = Password::sendResetLink(['email' => $user->email]) === Password::RESET_LINK_SENT;
        } catch (Throwable $exception) {
            report($exception);
        }

        return $this->privateJson([
            'user' => $user->only(['id', 'name', 'email', 'role', 'is_active']),
            'password_reset_requested' => $resetLinkRequested,
        ], 201);
    }

    public function setActive(Request $request, User $user): JsonResponse
    {
        $validated = $request->validate(['is_active' => ['required', 'boolean']]);

        if ($validated['is_active']) {
            $this->authorize('reactivate', $user);
        } else {
            $this->authorize('deactivate', $user);
        }

        DB::transaction(function () use ($request, $user, $validated): void {
            $user->forceFill(['is_active' => $validated['is_active']])->save();
            $this->audit($request, $validated['is_active'] ? 'user.activated' : 'user.deactivated', $user);
        });

        return $this->privateJson($user->refresh()->only(['id', 'name', 'email', 'role', 'is_active']));
    }

    private function audit(Request $request, string $event, User $user): void
    {
        AuditEvent::create([
            'actor_id' => $request->user()->id,
            'event' => $event,
            'subject_type' => User::class,
            'subject_id' => $user->id,
            'created_at' => now('UTC'),
        ]);
    }

    private function privateJson(mixed $data, int $status = 200): JsonResponse
    {
        return response()->json($data, $status)->header('Cache-Control', 'private, no-store');
    }
}
