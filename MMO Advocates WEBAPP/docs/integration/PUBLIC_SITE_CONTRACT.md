# Public site integration contract

Status: Backend route view data is implemented and tested. Public Blade output still requires Strawberry's template integration and escaped rendering.

## Public page routes

| Method and path | Route name | Blade view | `publishedContent` slug |
|---|---|---|---|
| `GET /` | `home` | `public.home` | `home` |
| `GET /services` | `public.services` | `public.services` | `services` |
| `GET /about` | `public.about` | `public.about` | `about` |
| `GET /contact` | `public.contact` | `public.contact` | `contact` |

Each endpoint returns server-rendered HTML and passes a nullable `publishedContent` view variable. When there is no published record for that page, the variable is `null` and the existing approved static fallback must remain visible. No case records, editor fields, or audit data are passed. The `home` route name is retained for the shared layout's root link.

When present, `publishedContent` is an associative array containing exactly these fields:

```php
[
    'slug' => 'services',
    'title' => 'Services',
    'body' => 'Published plain-text content',
    'published_at' => '2026-10-21T12:00:00.000000Z',
]
```

The controller selects only a record whose `published_slug` matches that page's slug and whose status is `published`. The values come from `published_slug`, `published_title`, `published_body`, and `published_at`. Draft `slug`, `title`, and `body` are never used for public view data. `published_at` is an ISO-8601 UTC string.

## Required Blade rendering and fallback

Strawberry owns `backend/resources/views/public/**` and must complete the view-side integration. Render editable values with ordinary escaped Blade expressions, for example `{{ $publishedContent['title'] }}` and `{{ $publishedContent['body'] }}`. Never use `{!! !!}`, `HtmlString`, or another raw HTML path for these fields. `body` is untrusted plain text; script tags, event handlers, and other markup must display as text and must not execute.

Guard each published block with `@if ($publishedContent)` and preserve the page's existing approved static copy in the `@else` branch. A draft-only or missing publication leaves the existing page intact. A publication for one slug must never appear on another page.

## Public content JSON endpoint

`GET /public-content/{slug}` remains a JSON endpoint for consumers outside the Blade page render. It returns only a published snapshot with exactly this allowlisted shape:

```json
{
  "slug": "contact",
  "title": "Contact us",
  "body": "Published plain-text content",
  "published_at": "2026-10-21T12:00:00.000000Z"
}
```

Unknown and draft-only slugs return 404. The endpoint does not return draft fields, editor identity, audit data, or case data. Responses use `Cache-Control: public, max-age=60` (header parameter order may be normalized by the HTTP runtime). The body is plain text, not an HTML fragment; external consumers must render it as text or apply context-appropriate output encoding.

## Draft, preview, and publication behavior

- `POST /staff/content` creates a draft from `slug`, `title`, and `body`; only an active admin or staff content editor may call it.
- `PATCH /staff/content/{contentItem}` edits draft fields only. An existing publication snapshot and timestamp remain unchanged.
- `POST /staff/content/{contentItem}/preview` returns current draft fields with `status` and `preview: true`; it does not publish.
- `POST /staff/content/{contentItem}/publish` copies draft values into the published snapshot and sets `published_at` in UTC. Its full editor-only response is not for public templates.
- `GET /staff/content` and `GET /staff/content/{contentItem}` require an active admin or staff editor and return private, non-cacheable editor data.
- Creation, edits, and publication write `AuditEvent` entries with the authenticated actor, event type, subject, and UTC timestamp. Draft body revisions are not retained; the PRD requires publication/change attribution, not rollback history.

Slugs are lowercase ASCII words separated by single hyphens. Publishing is rejected if another item already owns the requested published slug.
