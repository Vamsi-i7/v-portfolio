/**
 * Umami Analytics Wrapper
 * Handles dynamic script injection and type-safe event tracking.
 */

interface Umami {
  track: (eventName: string, data?: Record<string, unknown>) => void
}

declare global {
  interface Window {
    umami?: Umami
  }
}

const WEBSITE_ID = import.meta.env.VITE_UMAMI_WEBSITE_ID
const SCRIPT_URL = import.meta.env.VITE_UMAMI_SCRIPT_URL

/**
 * Injects the Umami script into the document head if configured.
 * Should be called once during app initialization.
 */
export function initAnalytics() {
  if (typeof window === 'undefined') return
  if (!WEBSITE_ID || !SCRIPT_URL) return

  // Prevent duplicate injection
  if (document.getElementById('umami-tracker')) return

  const script = document.createElement('script')
  script.id = 'umami-tracker'
  script.async = true
  script.defer = true
  script.src = SCRIPT_URL
  script.setAttribute('data-website-id', WEBSITE_ID)
  
  document.head.appendChild(script)
}

/**
 * Tracks a custom event.
 * Gracefully handles cases where Umami is blocked or not loaded.
 */
export function trackEvent(eventName: string, data?: Record<string, unknown>) {
  if (window.umami) {
    window.umami.track(eventName, data)
  }
}
