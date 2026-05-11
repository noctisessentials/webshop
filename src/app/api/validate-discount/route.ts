import { NextResponse } from 'next/server'
import { validateDiscountViaWC } from '@/lib/discounts'

export async function POST(request: Request) {
  try {
    const { code, orderTotal } = await request.json()
    if (!code || typeof orderTotal !== 'number') {
      return NextResponse.json({ valid: false, error: 'Ongeldige aanvraag.' }, { status: 400 })
    }
    const result = await validateDiscountViaWC(code, orderTotal)
    return NextResponse.json(result)
  } catch {
    return NextResponse.json({ valid: false, error: 'Er ging iets mis.' }, { status: 500 })
  }
}
