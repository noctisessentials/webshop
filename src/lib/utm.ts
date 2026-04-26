export type UTMData = {
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_content?: string
  utm_term?: string
  referrer?: string
  entry_url?: string
}

const KEY = 'noctis_utm'

export function captureUTMs(): void {
  if (typeof window === 'undefined') return

  const params = new URLSearchParams(window.location.search)
  const source = params.get('utm_source')
  const medium = params.get('utm_medium')
  const campaign = params.get('utm_campaign')
  const content = params.get('utm_content')
  const term = params.get('utm_term')

  // Only overwrite stored UTMs if this page load has UTM params
  if (!source && !medium && !campaign) {
    // No UTMs on this URL — store referrer only if nothing stored yet
    if (!localStorage.getItem(KEY) && document.referrer) {
      localStorage.setItem(KEY, JSON.stringify({
        referrer: document.referrer,
        entry_url: window.location.href,
      }))
    }
    return
  }

  const utm: UTMData = { entry_url: window.location.href }
  if (source) utm.utm_source = source
  if (medium) utm.utm_medium = medium
  if (campaign) utm.utm_campaign = campaign
  if (content) utm.utm_content = content
  if (term) utm.utm_term = term
  if (document.referrer) utm.referrer = document.referrer

  localStorage.setItem(KEY, JSON.stringify(utm))
}

export function getStoredUTMs(): UTMData | null {
  if (typeof window === 'undefined') return null
  const raw = localStorage.getItem(KEY)
  return raw ? (JSON.parse(raw) as UTMData) : null
}

export function clearUTMs(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(KEY)
}

export function utmToWCMeta(utm: UTMData): { key: string; value: string }[] {
  const sourceType = utm.utm_source ? 'utm' : utm.referrer ? 'referral' : 'typein'
  const meta: { key: string; value: string }[] = [
    { key: '_wc_order_attribution_source_type', value: sourceType },
  ]
  if (utm.utm_source) meta.push({ key: '_wc_order_attribution_utm_source', value: utm.utm_source })
  if (utm.utm_medium) meta.push({ key: '_wc_order_attribution_utm_medium', value: utm.utm_medium })
  if (utm.utm_campaign) meta.push({ key: '_wc_order_attribution_utm_campaign', value: utm.utm_campaign })
  if (utm.utm_content) meta.push({ key: '_wc_order_attribution_utm_content', value: utm.utm_content })
  if (utm.utm_term) meta.push({ key: '_wc_order_attribution_utm_term', value: utm.utm_term })
  if (utm.referrer) meta.push({ key: '_wc_order_attribution_referrer', value: utm.referrer })
  if (utm.entry_url) meta.push({ key: '_wc_order_attribution_session_entry', value: utm.entry_url })
  return meta
}
