<?php

namespace App\Http\Controllers\Staff;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Models\CaseRecord;
use App\Models\FollowUp;
use Carbon\CarbonImmutable;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function __invoke(Request $request): JsonResponse
    {
        $this->authorize('viewAny', CaseRecord::class);
        $today = CarbonImmutable::now('Africa/Nairobi')->toDateString();
        $followUps = FollowUp::query()
            ->with(['caseRecord:id,client_name,case_number,assigned_lawyer_id', 'assignee:id,name'])
            ->where('status', 'pending')
            ->whereHas('caseRecord', function ($query) use ($request): void {
                if ($request->user()->role === UserRole::Associate) {
                    $query->where('assigned_lawyer_id', $request->user()->id);
                }
            });

        $todayItems = (clone $followUps)->whereDate('due_on', $today)->orderBy('due_on')->get();
        $overdueItems = (clone $followUps)->whereDate('due_on', '<', $today)->orderBy('due_on')->get();

        return response()->json([
            'date' => $today,
            'timezone' => 'Africa/Nairobi',
            'today' => $todayItems,
            'overdue' => $overdueItems,
        ])->header('Cache-Control', 'private, no-store');
    }
}
