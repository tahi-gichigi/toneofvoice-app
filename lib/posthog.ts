import { PostHog } from "posthog-node"

// NOTE: This is a Node.js client, so you can use it for sending events from the server side to PostHog.
export default function PostHogClient() {
  const posthogClient = new PostHog(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    flushAt: 1,
    flushInterval: 0,
  })
  return posthogClient
}

/**
 * Fire-and-forget server-side exception capture.
 * Safe to call from any API route catch block without awaiting.
 */
export async function captureServerError(
  error: unknown,
  context: { endpoint: string; userId?: string; [key: string]: unknown }
) {
  try {
    const err = error instanceof Error ? error : new Error(String(error))
    const client = PostHogClient()
    client.captureException(err, context.userId ?? "server", context)
    await client.shutdown()
  } catch {
    // Never let observability code break the app
  }
}