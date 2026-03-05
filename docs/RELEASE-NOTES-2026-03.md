# Release Notes — March 2026

## Observability: PostHog Error Tracking

- **Client-side exception autocapture** was already enabled via `capture_exceptions: true` in `PostHogProvider` - unhandled JS errors and promise rejections captured automatically
- **`app/global-error.tsx`** added - catches React render crashes that escape all error boundaries, calls `posthog.captureException()` before showing a user-friendly fallback UI
- **`captureServerError` helper** added to `lib/posthog.ts` - wraps `posthog-node`'s `captureException` for use in API routes
- **Three key API routes** now report server-side errors to PostHog Error Tracking:
  - `/api/generate-styleguide` - guide generation failures (AI timeout, template error)
  - `/api/export-pdf` - Puppeteer/Chrome failures, serverless timeout
  - `/api/save-style-guide` - Supabase write failures, auth expiry

**Errors to expect in PostHog Error Tracking:**
- Guide generation failures (AI API issues, template crashes)
- PDF export failures (Chrome launch, timeout, memory)
- Save failures (DB errors, auth expiry)
- Client JS / React render crashes

**Noise to ignore / suppress:**
- `Script error.` with no stack - cross-origin browser extension noise
- `DOMException: SecurityError` from `LazyLoadedSessionRecording` - PostHog internals
- `Error invoking postMessage: Java object is gone` - Android WebView

**PostHog setup:**
- Exception autocapture: enabled in project settings
- Alert: threshold alert on `$exception` count (configured in PostHog UI)
- Project: Default project (id: 244556)

**Removed PostHog from fortress-content-audit-main** - it was forked from this repo and sharing the same API key, polluting this project's data. Packages uninstalled, all references removed.

## Guide Editor UX Fixes

- **Brand name save bug fixed** - H1 edits on the cover now persist via `onBrandNameChange` prop; auto-save picks up the updated name
- **AI toolbar discoverability** - fixed toolbar now shows "Ask AI" text label next to wand icon
- **Add section button** - removed `animate-pulse` animation; dashed border is sufficient visual cue
- **Next Steps banner** - dismissal now persists across downloads in the same session (ref-based, not state)
- **Download all formats** - new button in download dialog bundles PDF + Word + Markdown into a single `.zip` via JSZip

## Brand Favicon on Guide Cover

- `GuideCover` now shows the brand's favicon beside the domain URL (derived from Google favicon service)
- Only appears for URL-based guides; gracefully hidden on error
- Dashboard guide cards: fixed camelCase key bug (`websiteUrl` not `website_url`) so favicons now appear correctly
- Example page (`/example`): uses `https://apple.com` so Apple's favicon renders on the cover

## Example Page

- Back navigation changed from "← toneofvoice.app" to "← Home"
- Refactored into server component shell (`page.tsx`) + `ExampleGuideClient.tsx` for correct SSR metadata handling
