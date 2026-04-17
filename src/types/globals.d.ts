interface Window {
  fbq?: (...args: unknown[]) => void
  gtag?: (...args: unknown[]) => void
  omnisend?: ((...args: unknown[]) => void) & { push: (...args: unknown[]) => void }
  dataLayer?: unknown[]
  turnstile?: {
    render: (container: HTMLElement, options: Record<string, unknown>) => string
    remove: (widgetId: string) => void
    reset: (widgetId: string) => void
    getResponse: (widgetId: string) => string | undefined
  }
  onloadTurnstileCallback?: () => void
}
