/**
 * WooCommerce → storefront stock invalidation.
 *
 * Without this, a stock change takes up to REVALIDATE_SECONDS (5 min) to appear. With a
 * `product.updated` webhook pointed here, WooCommerce pushes the change and the cached stock
 * response is dropped immediately — which matters when the fulfilment feed (and Bol) flips a
 * product to sold out.
 *
 * Setup: WP Admin → WooCommerce → Settings → Advanced → Webhooks → Add webhook
 *   Topic:    Product updated   (add a second one for Product created / deleted if you like)
 *   URL:      https://noctisessentials.com/api/webhooks/woocommerce
 *   Secret:   the value of WC_WEBHOOK_SECRET
 */

import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { revalidateTag } from 'next/cache'
import { WC_STOCK_TAG } from '@/lib/wc-stock'

export async function POST(request: Request) {
  const secret = process.env.WC_WEBHOOK_SECRET
  if (!secret) {
    console.error('[wc-webhook] WC_WEBHOOK_SECRET is not set')
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 })
  }

  const rawBody = await request.text()
  const signature = request.headers.get('x-wc-webhook-signature')

  if (!signature) {
    // WooCommerce sends an unsigned ping when you first save the webhook.
    if (request.headers.get('x-wc-webhook-topic') === null) {
      return NextResponse.json({ received: true })
    }
    return NextResponse.json({ error: 'Missing signature' }, { status: 401 })
  }

  const expected = crypto.createHmac('sha256', secret).update(rawBody, 'utf8').digest('base64')
  const signatureBuf = Buffer.from(signature)
  const expectedBuf = Buffer.from(expected)

  if (
    signatureBuf.length !== expectedBuf.length ||
    !crypto.timingSafeEqual(signatureBuf, expectedBuf)
  ) {
    console.error('[wc-webhook] signature mismatch')
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  // expire: 0 — no stale-while-revalidate window. A sold-out product must not keep being
  // served as available while the fresh response loads in the background.
  revalidateTag(WC_STOCK_TAG, { expire: 0 })

  const topic = request.headers.get('x-wc-webhook-topic') ?? 'unknown'
  console.log(`[wc-webhook] ${topic} — stock cache invalidated`)

  return NextResponse.json({ received: true, revalidated: WC_STOCK_TAG })
}
