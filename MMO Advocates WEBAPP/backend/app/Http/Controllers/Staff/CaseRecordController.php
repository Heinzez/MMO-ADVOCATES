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

class CaseRecordController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewAny', CaseRecord::class);

        $query = CaseRecord::query()->with('assignedLawyer:id,name');

        if ($request->user()->role === UserRole::Associate) {
            $query->where('assigned_lawyer_id', $request->user()->id);
        }

        $filters = $request->validate([
            'search' => ['nullable', 'string', 'max:200'],
            'type' => ['nullable', 'string', 'max:100'],
            'status' => ['nullable', 'string', 'max:100'],
            'follow_up_on' => ['nullable', 'date_format:Y-m-d'],
        ]);

        $query->when($filters['search'] ?? null, function ($query, string $search): void {
            $query->where(function ($query) use ($search): void {
                $query->where('client_name', 'like', "%{$search}%")
                    ->orWhere('case_number', 'like', "%{$search}%")
                    ->orWhere('type', 'like', "%{$search}%")
                    ->orWhere('court', 'like', "%{$search}%");
            });
        });
        $query->when($filters['type'] ?? null, fn ($query, string $type) => $query->where('type', $type));
        $query->when($filters['status'] ?? null, fn ($query, string $status) => $query->where('status', $status));
        $query->when($filters['follow_up_on'] ?? null, fn ($query, string $date) => $query->whereHas(
            'followUps', fn ($followUps) => $followUps->whereDate('due_on', $date),
        ));

        return $this->privateJson($query->latest('updated_at')->get());
    }

    public function show(CaseRecord $caseRecord): JsonResponse
    {
        $this->authorize('view', $caseRecord);

        return $this->privateJson($caseRecord->load(['assignedLawyer:id,name', 'followUps.assignee:id,name']));
    }

    public function history(CaseRecord $caseRecord): JsonResponse
    {
        $this->authorize('view', $caseRecord);

        $followUpIds = $caseRecord->followUps()->pluck('id');
        $events = AuditEvent::query()
            ->with('actor:id,name')
            ->where(function ($query) use ($caseRecord, $followUpIds): void {
                $query->where(fn ($query) => $query
                    ->where('subject_type', CaseRecord::class)
                    ->where('subject_id', $caseRecord->id));

                if ($followUpIds->isNotEmpty()) {
                    $query->orWhere(fn ($query) => $query
                        ->where('subject_type', FollowUp::class)
                        ->whereIn('subject_id', $followUpIds));
                }
            })
            ->orderByDesc('created_at')
            ->get(['id', 'actor_id', 'event', 'subject_type', 'subject_id', 'created_at']);

        return $this->privateJson($events->map(fn (AuditEvent $event): array => [
            'event' => $event->event,
            'actor' => $event->actor?->only(['id', 'name']),
            'subject_type' => $event->subject_type === CaseRecord::class ? 'case' : 'follow_up',
            'subject_id' => $event->subject_id,
            'created_at' => $event->created_at,
        ])->values());
    }

    public function store(Request $request): JsonResponse
    {
        $this->authorize('create', CaseRecord::class);

        $canAssign = $request->user()->role === UserRole::Admin;
        $validated = $request->validate($this->rules($canAssign));
        $validated['assigned_lawyer_id'] ??= $request->user()->id;
        $case = DB::transaction(function () use ($request, $validated): CaseRecord {
            $case = CaseRecord::create($validated);
            $this->audit($request, 'case.created', $case);

            return $case;
        });

        return $this->privateJson($case, 201);
    }

    public function update(Request $request, CaseRecord $caseRecord): JsonResponse
    {
        $this->authorize('update', $caseRecord);

        $validated = $request->validate($this->rules($request->user()->role === UserRole::Admin, true));
        DB::transaction(function () use ($request, $caseRecord, $validated): void {
            $caseRecord->update($validated);
            $this->audit($request, 'case.updated', $caseRecord);
        });

        return $this->privateJson($caseRecord->refresh());
    }

    public function destroy(Request $request, CaseRecord $caseRecord): JsonResponse
    {
        $this->authorize('delete', $caseRecord);
        DB::transaction(function () use ($request, $caseRecord): void {
            $caseRecord->delete();
            $this->audit($request, 'case.deleted', $caseRecord);
        });

        return response()->json([], 204)->header('Cache-Control', 'private, no-store');
    }

    public function restore(Request $request, string $caseId): JsonResponse
    {
        $case = CaseRecord::withTrashed()->findOrFail($caseId);
        $this->authorize('restore', $case);

        DB::transaction(function () use ($request, $case): void {
            $case->restore();
            $this->audit($request, 'case.restored', $case);
        });

        return $this->privateJson($case->refresh());
    }

    private function rules(bool $canAssign, bool $partial = false): array
    {
        $required = $partial ? 'sometimes' : 'required';
        $rules = [
            'client_name' => [$required, 'string', 'max:255'],
            'client_contact' => [$required, 'string', 'max:255'],
            'type' => [$required, 'string', 'max:100'],
            'case_number' => ['nullable', 'string', 'max:100'],
            'court' => ['nullable', 'string', 'max:255'],
            'status' => [$required, 'string', 'max:100'],
            'opened_on' => [$required, 'date'],
        ];

        if ($canAssign) {
            $rules['assigned_lawyer_id'] = [
                $required,
                Rule::exists('users', 'id')->where('role', UserRole::Associate->value)->where('is_active', true),
            ];
        }

        return $rules;
    }

    private function audit(Request $request, string $event, CaseRecord $case): void
    {
        AuditEvent::create([
            'actor_id' => $request->user()->id,
            'event' => $event,
            'subject_type' => CaseRecord::class,
            'subject_id' => $case->id,
            'created_at' => now('UTC'),
        ]);
    }

    private function privateJson(mixed $data, int $status = 200): JsonResponse
    {
        return response()->json($data, $status)->header('Cache-Control', 'private, no-store');
    }
}
