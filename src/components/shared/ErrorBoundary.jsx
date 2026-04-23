// App-level error boundary.
//
// One crashed subtree shouldn't nuke the whole page. Wrap route layouts with
// this so a broken product tile (or flaky third-party script) renders a
// friendly fallback instead of a blank white screen. In prod, errors are
// forwarded to Sentry if it's been initialised.

import { Component } from 'react'
import * as Sentry from '@sentry/react'

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    // Sentry captures automatically via its own ErrorBoundary integration when
    // enabled, but we double-log here so bare Sentry.init() still sees things.
    if (Sentry?.captureException) {
      try { Sentry.captureException(error, { extra: info }) } catch { /* ignore */ }
    }
    // Surface in dev console regardless
    console.error('[ErrorBoundary]', error, info)
  }

  reset = () => this.setState({ error: null })

  render() {
    if (!this.state.error) return this.props.children

    return (
      <div className="min-h-[60vh] flex items-center justify-center px-6 bg-[#FAF6EE]">
        <div className="max-w-sm text-center">
          <div className="text-5xl mb-4">☕</div>
          <h2 className="font-display text-2xl text-ink mb-2">Something spilled</h2>
          <p className="text-sm text-[#6B5744] mb-5">
            We bumped into an unexpected error. Try reloading the page — if it keeps happening, we're already on it.
          </p>
          <div className="flex gap-2 justify-center">
            <button
              onClick={this.reset}
              className="px-4 py-2 rounded-xl border border-[#E8DDC8] text-sm font-semibold text-[#6B5744] hover:bg-[#F0E7D5]"
            >
              Try again
            </button>
            <button
              onClick={() => window.location.href = '/'}
              className="px-4 py-2 rounded-xl bg-accent text-white text-sm font-semibold hover:bg-[#a85225]"
            >
              Go home
            </button>
          </div>
        </div>
      </div>
    )
  }
}
