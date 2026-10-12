<?php

namespace App\Http\Controllers\Staff;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Models\AuditEvent;
use App\Models\CaseRecord;
use App\Models\FollowUp;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class FollowUpController extends Controller
{
    public function index(CaseRecord $caseRecord): JsonResponse
    {
        $this->authorize('view', $caseRecord);

        return $this->privateJson($caseRecord->followUps()->with('assignee:id,name')->orderBy('due_on')->get());
    }

    public function store(Request $request, CaseRecord $caseRecord): JsonResponse
    {
        $this->authorize('create', [FollowUp::class, $caseRecord]);

        $rules = [
            'due_on' => ['required', 'date'],
            'note' => ['required', 'string', 'max:10000'],
            'status' => ['sometimes', Rule::in(['pending', 'done'])],
        ];

        if ($request->user()->role === UserRole::Admin) {
            $rules['assignee_id'] = [
                'required',
                Rule::exists('users', 'id')->whereIn('role', [UserRole::Admin->value, UserRole::Associate->value])->where('is_active', true),
            ];
        }

        $validated = $request->validate($rules);
        $validated['case_id'] = $caseRecord->id;
        $validated['assignee_id'] ??= $request->user()->id;
        $validated['status'] ??= 'pending';

        $followUp = DB::transaction(function () use ($request, $validated): FollowUp {
            $followUp = FollowUp::create($validated);
            $this->audit($request, 'follow_up.created', $followUp);

            return $followUp;
        });

        return $this->privateJson($followUp, 201);
    }

    public function update(Request $request, FollowUp $followUp): JsonResponse
    {
        $this->authorize('update', $followUp);

        $rules = [
            'due_on' => ['sometimes', 'date'],
            'note' => ['sometimes', 'string', 'max:10000'],
            'status' => ['sometimes', Rule::in(['pending', 'done'])],
        ];

        if ($request->user()->role === UserRole::Admin) {
            $rules['assignee_id'] = [
                'sometimes',
                Rule::exists('users', 'id')->whereIn('role', [UserRole::Admin->value, UserRole::Associate->value])->where('is_active', true),
            ];
        }

        $validated = $request->validate($rules);
        DB::transaction(function () use ($request, $followUp, $validated): void {
            $followUp->update($validated);
            $this->audit($request, 'follow_up.updated', $followUp);
        });

        return $this->privateJson($followUp->refresh());
    }

    private function audit(Request $request, string $event, FollowUp $followUp): void
    {
        AuditEvent::create([
            'actor_id' => $request->user()->id,
            'event' => $event,
            'subject_type' => FollowUp::class,
            'subject_id' => $followUp->id,
            'created_at' => now('UTC'),
        ]);
    }

    private function privateJson(mixed $data, int $status = 200): JsonResponse
    {
        return response()->json($data, $status)->header('Cache-Control', 'private, no-store');
    }
}
