interface Window {
  fbq?: (...args: unknown[]) => void
  gtag?: (...args: unknown[]) => void
  omnisend?: ((...args: unknown[]) => void) & { push: (...args: unknown[]) => void }
  dataLayer?: unknown[]
}
