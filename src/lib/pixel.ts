'use client'

const PIXEL_ID = '933186462850674'

function fbq(...args: unknown[]) {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq(...args)
  }
}

function generateEventId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export function pixelViewContent(productId: string, productName: string, price: number, eventId?: string) {
  const id = eventId ?? generateEventId()
  fbq('track', 'ViewContent', {
    content_ids: [productId],
    content_name: productName,
    content_type: 'product',
    value: price,
    currency: 'EUR',
  }, { eventID: id })
  return id
}

export function pixelAddToCart(productId: string, productName: string, price: number, quantity: number, eventId?: string) {
  const id = eventId ?? generateEventId()
  fbq('track', 'AddToCart', {
    content_ids: [productId],
    content_name: productName,
    content_type: 'product',
    value: price * quantity,
    currency: 'EUR',
    num_items: quantity,
  }, { eventID: id })
  return id
}

export function pixelInitiateCheckout(value: number, numItems: number, eventId?: string) {
  const id = eventId ?? generateEventId()
  fbq('track', 'InitiateCheckout', {
    value,
    currency: 'EUR',
    num_items: numItems,
  }, { eventID: id })
  return id
}

export function pixelPurchase(orderId: string, value: number, numItems: number, eventId?: string) {
  const id = eventId ?? generateEventId()
  fbq('track', 'Purchase', {
    content_ids: [orderId],
    value,
    currency: 'EUR',
    num_items: numItems,
  }, { eventID: id })
  return id
}
