// Sentry bootstrap — env-gated, no-op if VITE_SENTRY_DSN isn't set.
//
// Add VITE_SENTRY_DSN to Vercel env vars (and .env.local for dev) to enable.
// Keeps the feature dormant until we're ready to pay attention to errors.

import * as Sentry from '@sentry/react'

export function initSentry() {
  const dsn = import.meta.env.VITE_SENTRY_DSN
  if (!dsn) return // silently disabled — intentional

  Sentry.init({
    dsn,
    environment: import.meta.env.MODE,
    // Small sampling to keep free-tier volume under control. Bump later.
    tracesSampleRate: 0.1,
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 1.0,
    // Drop obvious noise
    ignoreErrors: [
      'ResizeObserver loop limit exceeded',
      'ResizeObserver loop completed with undelivered notifications',
      'Non-Error promise rejection captured',
    ],
  })
}
