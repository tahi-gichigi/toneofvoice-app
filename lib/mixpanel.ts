/**
 * Thin wrapper around mixpanel-browser for safe client-side event tracking.
 * Import this instead of mixpanel-browser directly so tracking never breaks the app.
 * Uses the same module singleton that MixpanelProvider initialises.
 */
import mixpanel from "mixpanel-browser"

type Properties = Record<string, string | number | boolean | null | undefined>

function isReady() {
  if (typeof window === "undefined") return false
  if (process.env.NODE_ENV === "development") return false
  return true
}

export function track(event: string, properties?: Properties) {
  try {
    if (isReady()) mixpanel.track(event, properties)
  } catch {
    // Never let analytics break the app
  }
}

export function identify(userId: string, properties?: Properties) {
  try {
    if (!isReady()) return
    mixpanel.identify(userId)
    if (properties) mixpanel.people.set(properties)
  } catch {}
}
