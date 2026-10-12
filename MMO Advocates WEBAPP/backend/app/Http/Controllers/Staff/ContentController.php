<?php

namespace App\Http\Controllers\Staff;

use App\Http\Controllers\Controller;
use App\Models\AuditEvent;
use App\Models\PublicContentItem;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class ContentController extends Controller
{
    /** Editor contract: draft and published values plus editor and publication metadata. */
    public function index(): JsonResponse
    {
        $this->authorize('viewAny', PublicContentItem::class);

        return $this->privateJson(PublicContentItem::query()->with('editor:id,name')->orderBy('slug')->get());
    }

    public function show(PublicContentItem $contentItem): JsonResponse
    {
        $this->authorize('view', $contentItem);

        return $this->privateJson($contentItem->load('editor:id,name'));
    }

    /** Public contract is an allowlist; drafts and editor-only fields are never returned. */
    public function publicShow(string $slug): JsonResponse
    {
        $item = PublicContentItem::query()->where('published_slug', $slug)->where('status', 'published')->firstOrFail();

        return response()->json([
            'slug' => $item->published_slug,
            'title' => $item->published_title,
            'body' => $item->published_body,
            'published_at' => $item->published_at,
        ])
            ->header('Cache-Control', 'public, max-age=60');
    }

    public function store(Request $request): JsonResponse
    {
        $this->authorize('create', PublicContentItem::class);
        $data = $request->validate([
            'slug' => ['required', 'string', 'max:100', 'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/', 'unique:public_content_items,slug'],
            'title' => ['required', 'string', 'max:255'],
            'body' => ['required', 'string', 'max:100000'],
        ]);
        $item = DB::transaction(function () use ($request, $data): PublicContentItem {
            $item = PublicContentItem::create([...$data, 'status' => 'draft', 'updated_by' => $request->user()->id]);
            $this->audit($request, 'content.created', $item);

            return $item;
        });

        return $this->privateJson($item->load('editor:id,name'), 201);
    }

    public function update(Request $request, PublicContentItem $contentItem): JsonResponse
    {
        $this->authorize('update', $contentItem);
        $data = $request->validate([
            'slug' => ['sometimes', 'required', 'string', 'max:100', 'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/', Rule::unique('public_content_items', 'slug')->ignore($contentItem->id)],
            'title' => ['sometimes', 'required', 'string', 'max:255'],
            'body' => ['sometimes', 'required', 'string', 'max:100000'],
        ]);
        DB::transaction(function () use ($request, $contentItem, $data): void {
            $contentItem->update([...$data, 'updated_by' => $request->user()->id]);
            $this->audit($request, 'content.updated', $contentItem);
        });

        return $this->privateJson($contentItem->refresh()->load('editor:id,name'));
    }

    public function preview(PublicContentItem $contentItem): JsonResponse
    {
        $this->authorize('view', $contentItem);

        return $this->privateJson([
            'slug' => $contentItem->slug,
            'title' => $contentItem->title,
            'body' => $contentItem->body,
            'status' => $contentItem->status,
            'preview' => true,
        ]);
    }

    public function publish(Request $request, PublicContentItem $contentItem): JsonResponse
    {
        $this->authorize('publish', $contentItem);
        Validator::make(['slug' => $contentItem->slug], [
            'slug' => ['required', Rule::unique('public_content_items', 'published_slug')->ignore($contentItem->id)],
        ])->validate();
        DB::transaction(function () use ($request, $contentItem): void {
            $contentItem->forceFill([
                'status' => 'published',
                'updated_by' => $request->user()->id,
                'published_slug' => $contentItem->slug,
                'published_title' => $contentItem->title,
                'published_body' => $contentItem->body,
                'published_at' => now('UTC'),
            ])->save();
            $this->audit($request, 'content.published', $contentItem);
        });

        return $this->privateJson($contentItem->refresh()->load('editor:id,name'));
    }

    private function audit(Request $request, string $event, PublicContentItem $item): void
    {
        AuditEvent::create([
            'actor_id' => $request->user()->id,
            'event' => $event,
            'subject_type' => PublicContentItem::class,
            'subject_id' => $item->id,
            'created_at' => now('UTC'),
        ]);
    }

    private function privateJson(mixed $data, int $status = 200): JsonResponse
    {
        return response()->json($data, $status)->header('Cache-Control', 'private, no-store');
    }
}
