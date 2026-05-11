export type DiscountResult = {
  valid: true
  code: string
  type: 'percentage' | 'fixed'
  value: number
  label: string
  discountAmount: number
} | {
  valid: false
  error: string
}

type WCCoupon = {
  id: number
  code: string
  discount_type: 'percent' | 'fixed_cart' | 'fixed_product'
  amount: string
  date_expires: string | null
  usage_limit: number | null
  usage_count: number
  minimum_amount: string
  maximum_amount: string
}

export async function validateDiscountViaWC(rawCode: string, orderTotal: number): Promise<DiscountResult> {
  const code = rawCode.trim().toLowerCase()
  const base = process.env.NEXT_PUBLIC_WC_URL
  const key = process.env.WC_CONSUMER_KEY
  const secret = process.env.WC_CONSUMER_SECRET

  if (!base || !key || !secret) {
    return { valid: false, error: 'Kortingscodes tijdelijk niet beschikbaar.' }
  }

  const url = new URL(`${base}/wp-json/wc/v3/coupons`)
  url.searchParams.set('consumer_key', key)
  url.searchParams.set('consumer_secret', secret)
  url.searchParams.set('code', code)

  let coupon: WCCoupon | undefined
  try {
    const res = await fetch(url.toString(), { signal: AbortSignal.timeout(5000) })
    if (!res.ok) return { valid: false, error: 'Kortingscode ongeldig of verlopen.' }
    const coupons: WCCoupon[] = await res.json()
    coupon = coupons.find((c) => c.code.toLowerCase() === code)
  } catch {
    return { valid: false, error: 'Kon kortingscode niet controleren. Probeer opnieuw.' }
  }

  if (!coupon) return { valid: false, error: 'Kortingscode ongeldig of verlopen.' }

  // Expired?
  if (coupon.date_expires && new Date(coupon.date_expires) < new Date()) {
    return { valid: false, error: 'Deze kortingscode is verlopen.' }
  }

  // Usage limit reached?
  if (coupon.usage_limit !== null && coupon.usage_count >= coupon.usage_limit) {
    return { valid: false, error: 'Deze kortingscode is niet meer geldig.' }
  }

  // Minimum order?
  const min = parseFloat(coupon.minimum_amount || '0')
  if (min > 0 && orderTotal < min) {
    return { valid: false, error: `Minimale bestelling van €${min.toFixed(2).replace('.', ',')} vereist.` }
  }

  // Maximum order?
  const max = parseFloat(coupon.maximum_amount || '0')
  if (max > 0 && orderTotal > max) {
    return { valid: false, error: `Deze code is niet geldig voor bestellingen boven €${max.toFixed(2).replace('.', ',')}.` }
  }

  const value = parseFloat(coupon.amount)
  const isPercent = coupon.discount_type === 'percent'
  const discountAmount = isPercent
    ? Math.round((orderTotal * value) / 100 * 100) / 100
    : Math.min(value, orderTotal)

  const label = isPercent
    ? `${value}% korting (${coupon.code.toUpperCase()})`
    : `€${value.toFixed(2).replace('.', ',')} korting (${coupon.code.toUpperCase()})`

  return {
    valid: true,
    code: coupon.code.toUpperCase(),
    type: isPercent ? 'percentage' : 'fixed',
    value,
    label,
    discountAmount,
  }
}
