'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { useCart } from '@/context/CartContext'
import { formatPrice } from '@/lib/utils'
import { useRouter } from '@/i18n/navigation'
import { Link } from '@/i18n/navigation'
import { ChevronLeft, Lock, Truck, ShieldCheck, RotateCcw } from 'lucide-react'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

// ── Types ──────────────────────────────────────────────────────────────────

type ShippingForm = {
  firstName: string
  lastName: string
  email: string
  phone: string
  address1: string
  houseNumber: string
  address2: string
  city: string
  postcode: string
  country: string
}

// ── Stripe appearance matching Noctis design ───────────────────────────────

const stripeAppearance = {
  theme: 'flat' as const,
  variables: {
    colorPrimary: '#A4744C',
    colorBackground: '#FFFFFF',
    colorText: '#1E1D1D',
    colorDanger: '#dc2626',
    colorTextPlaceholder: '#A89E97',
    fontFamily: '"DM Sans", system-ui, sans-serif',
    borderRadius: '8px',
    spacingUnit: '4px',
  },
  rules: {
    '.Input': {
      border: '1px solid #E8E6E3',
      padding: '12px 14px',
      fontSize: '14px',
      boxShadow: 'none',
    },
    '.Input:focus': {
      border: '1px solid #A4744C',
      boxShadow: 'none',
      outline: 'none',
    },
    '.Label': {
      fontSize: '11px',
      fontWeight: '600',
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      color: '#6B635C',
      marginBottom: '6px',
    },
    '.Tab': {
      border: '1px solid #E8E6E3',
      borderRadius: '8px',
    },
    '.Tab--selected': {
      border: '1px solid #A4744C',
      color: '#A4744C',
    },
  },
}

// ── Payment form (inside Stripe Elements context) ──────────────────────────

function PaymentForm({
  shipping,
  onSuccess,
}: {
  shipping: ShippingForm
  onSuccess: (paymentIntentId: string) => void
}) {
  const stripe = useStripe()
  const elements = useElements()
  const [paying, setPaying] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handlePay = async () => {
    if (!stripe || !elements) return
    setError(null)
    setPaying(true)

    const { error: submitError } = await elements.submit()
    if (submitError) {
      setError(submitError.message ?? 'Er ging iets mis')
      setPaying(false)
      return
    }

    const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout/success`,
        payment_method_data: {
          billing_details: {
            name: `${shipping.firstName} ${shipping.lastName}`,
            email: shipping.email,
            phone: shipping.phone || undefined,
            address: {
              line1: `${shipping.address1} ${shipping.houseNumber}`.trim(),
              line2: shipping.address2 || undefined,
              city: shipping.city,
              postal_code: shipping.postcode,
              country: shipping.country,
            },
          },
        },
      },
      redirect: 'if_required',
    })

    if (confirmError) {
      setError(confirmError.message ?? 'Betaling mislukt')
      setPaying(false)
    } else if (paymentIntent?.status === 'succeeded') {
      onSuccess(paymentIntent.id)
    }
  }

  return (
    <div className="space-y-4">
      <PaymentElement
        options={{
          layout: { type: 'accordion', defaultCollapsed: false, spacedAccordionItems: true },
          wallets: { applePay: 'auto', googlePay: 'auto' },
          defaultValues: {
            billingDetails: {
              name: `${shipping.firstName} ${shipping.lastName}`.trim(),
              email: shipping.email,
              phone: shipping.phone,
              address: {
                line1: `${shipping.address1} ${shipping.houseNumber}`.trim(),
                line2: shipping.address2,
                city: shipping.city,
                postal_code: shipping.postcode,
                country: shipping.country,
              },
            },
          },
          fields: {
            billingDetails: {
              name: 'never',
            },
          },
        }}
      />

      {error && (
        <p className="text-sm font-sans text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          {error}
        </p>
      )}

      <button
        onClick={handlePay}
        disabled={!stripe || paying}
        className="w-full h-14 bg-dark hover:bg-dark/90 disabled:opacity-50 text-white text-sm font-sans font-semibold rounded-xl transition-colors duration-200 flex items-center justify-center gap-2"
      >
        <Lock size={13} strokeWidth={2} />
        {paying ? 'Betaling verwerken…' : 'Veilig betalen'}
      </button>
    </div>
  )
}

// ── Main checkout page ─────────────────────────────────────────────────────

export default function CheckoutPage() {
  const router = useRouter()
  const { items, total, count } = useCart() as ReturnType<typeof useCart> & { clearCart?: () => void }

  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [loadingIntent, setLoadingIntent] = useState(false)
  const [intentError, setIntentError] = useState<string | null>(null)
  const [step, setStep] = useState<'details' | 'payment'>('details')

  const [shipping, setShipping] = useState<ShippingForm>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address1: '',
    houseNumber: '',
    address2: '',
    city: '',
    postcode: '',
    country: '',
  })
  const [newsletterOptIn, setNewsletterOptIn] = useState(false)

  useEffect(() => {
    if (items.length === 0) router.replace('/winkel')
  }, [items.length, router])

  const shipping_total = 0
  const order_total = total + shipping_total

  const requiredFields: Array<keyof ShippingForm> = [
    'firstName',
    'lastName',
    'email',
    'address1',
    'houseNumber',
    'city',
    'postcode',
    'country',
  ]
  const hasAllRequiredFields = requiredFields.every((field) => shipping[field].trim().length > 0)
  const hasValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(shipping.email)
  const isDetailsValid = hasAllRequiredFields && hasValidEmail

  const dutchColorName = (raw: string) => {
    const map: Record<string, string> = {
      black: 'Zwart',
      white: 'Wit',
      grey: 'Grijs',
      gray: 'Grijs',
      nude: 'Nude',
      pink: 'Roze',
      green: 'Groen',
      mint: 'Mintgroen',
      acacia: 'Acacia',
      'zwart-wit': 'Zwart wit',
    }
    const key = raw.trim().toLowerCase()
    return map[key] ?? raw
  }

  const localizeItemTitle = (title: string) => {
    if (/19-piece kitchen set/i.test(title)) return '19-delige keukenset'
    if (/pepper.*salt/i.test(title)) return 'Peper- en zoutmolens'
    if (/acacia cutting board/i.test(title)) return 'Acacia snijplank'
    return title
  }

  const set = (field: keyof ShippingForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setShipping((prev) => ({ ...prev, [field]: e.target.value }))

  const handleDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isDetailsValid) {
      setIntentError('Vul alle verplichte velden correct in om door te gaan.')
      return
    }
    setLoadingIntent(true)
    setIntentError(null)

    const shippingForOrder = {
      ...shipping,
      address1: `${shipping.address1} ${shipping.houseNumber}`.trim(),
      newsletterOptIn,
    }

    sessionStorage.setItem('noctis_shipping', JSON.stringify(shippingForOrder))
    sessionStorage.setItem('noctis_cart', JSON.stringify(
      items.map((i) => ({
        wcId: i.color.wcId,
        title: i.product.title,
        colorName: i.color.name,
        quantity: i.quantity,
        price: i.product.price,
      }))
    ))

    try {
      const res = await fetch('/api/payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: shipping.email,
          shipping: { ...shipping, address1: `${shipping.address1} ${shipping.houseNumber}`.trim(), newsletterOptIn },
          items: items.map((i) => ({
            wcId: i.color.wcId,
            title: i.product.title,
            colorName: i.color.name,
            quantity: i.quantity,
            price: i.product.price,
          })),
        }),
      })

      if (!res.ok) throw new Error('Could not create payment')
      const { clientSecret: cs } = await res.json()
      setClientSecret(cs)
      setStep('payment')

      // Meta Pixel: InitiateCheckout
      if (typeof window !== 'undefined' && window.fbq) {
        window.fbq('track', 'InitiateCheckout', {
          value: total,
          currency: 'EUR',
          num_items: count,
        })
      }

      // Omnisend: identify contact + fire $startedCheckout so the
      // "Abandoned Checkout" automation (trigger: Started checkout) fires
      // if the customer doesn't complete payment within the configured delay.
      if (typeof window !== 'undefined' && window.omnisend) {
        window.omnisend.push(['identify', { email: shipping.email }])
        window.omnisend.push(['track', '$startedCheckout', {
          $cartID: `checkout-${shipping.email}`,
          $currency: 'EUR',
          $cartTotal: total,
          $checkoutURL: `${window.location.origin}/checkout`,
          $lineItems: items.map((i) => ({
            $productID: String(i.color.wcId),
            $productTitle: i.product.title,
            $quantity: i.quantity,
            $price: i.product.price,
            $currency: 'EUR',
          })),
        }])
      }
    } catch {
      setIntentError('Er ging iets mis. Probeer het opnieuw.')
    } finally {
      setLoadingIntent(false)
    }
  }

  const handlePaymentSuccess = (paymentIntentId: string) => {
    router.push(`/checkout/success?payment_intent=${paymentIntentId}` as Parameters<typeof router.push>[0])
  }

  if (items.length === 0) return null

  return (
    <div className="min-h-screen bg-[#F0EDE8]">
      <div className="bg-light border-b border-border">
        <div className="container-content">
          <div className="flex items-center justify-between h-16">
            <Link href="/winkel" className="flex items-center gap-1.5 text-xs font-sans text-muted hover:text-dark transition-colors">
              <ChevronLeft size={14} />
              Terug naar winkel
            </Link>
            <div className="flex items-center gap-1.5 text-xs font-sans text-muted">
              <Lock size={12} strokeWidth={2} />
              Veilige checkout
            </div>
          </div>
        </div>
      </div>

      <div className="container-content py-10 md:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-8 lg:gap-12 items-start">

          <div className="space-y-6">
            <div className="flex items-center gap-3 text-xs font-sans">
              <span className={`font-semibold ${step === 'details' ? 'text-dark' : 'text-muted'}`}>
                1. Jouw gegevens
              </span>
              <span className="text-border">→</span>
              <span className={`font-semibold ${step === 'payment' ? 'text-dark' : 'text-muted'}`}>
                2. Betaling
              </span>
            </div>

            {step === 'details' && (
              <form onSubmit={handleDetailsSubmit} className="space-y-5">
                <div className="bg-white rounded-2xl p-6 md:p-8 space-y-5">
                  <h2 className="font-sans font-semibold text-sm text-dark">Contactgegevens</h2>
                  <Field label="E-mailadres" required>
                    <input type="email" value={shipping.email} onChange={set('email')} required placeholder="jij@voorbeeld.nl" />
                  </Field>
                  <p className="text-xs font-sans text-muted/70 -mt-2">
                    Controleer je spam of ongewenste e-mail als je geen bevestiging ontvangt (vooral bij Outlook).{' '}
                    <a href="mailto:info@noctisessentials.com" className="underline underline-offset-2 hover:text-dark transition-colors">Niet ontvangen? Neem contact op.</a>
                  </p>
                  <Field label="Telefoon (optioneel)">
                    <input type="tel" value={shipping.phone} onChange={set('phone')} placeholder="+31 6 12345678" />
                  </Field>
                  <label className="flex items-start gap-2.5 rounded-lg border border-border bg-surface/30 px-3 py-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newsletterOptIn}
                      onChange={(e) => setNewsletterOptIn(e.target.checked)}
                      className="mt-0.5 h-4 w-4 rounded border-border text-accent focus:ring-accent"
                    />
                    <span className="text-xs font-sans text-muted leading-relaxed">
                      Ja, ik wil updates, tips en exclusieve aanbiedingen van Noctis ontvangen per e-mail.
                    </span>
                  </label>
                </div>

                <div className="bg-white rounded-2xl p-6 md:p-8 space-y-5">
                  <h2 className="font-sans font-semibold text-sm text-dark">Adresgegevens</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Voornaam" required>
                      <input type="text" value={shipping.firstName} onChange={set('firstName')} required placeholder="Anna" />
                    </Field>
                    <Field label="Achternaam" required>
                      <input type="text" value={shipping.lastName} onChange={set('lastName')} required placeholder="de Vries" />
                    </Field>
                  </div>
                  <div className="grid grid-cols-[minmax(0,1fr)_120px] gap-4">
                    <Field label="Straat" required>
                      <input type="text" value={shipping.address1} onChange={set('address1')} required placeholder="Keizersgracht" />
                    </Field>
                    <Field label="Huisnummer" required>
                      <input type="text" value={shipping.houseNumber} onChange={set('houseNumber')} required placeholder="10A" />
                    </Field>
                  </div>
                  <Field label="Toevoeging (optioneel)">
                    <input type="text" value={shipping.address2} onChange={set('address2')} placeholder="Appartement 2B" />
                  </Field>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Plaats" required>
                      <input type="text" value={shipping.city} onChange={set('city')} required placeholder="Amsterdam" />
                    </Field>
                    <Field label="Postcode" required>
                      <input type="text" value={shipping.postcode} onChange={set('postcode')} required placeholder="1017 EH" />
                    </Field>
                  </div>
                  <Field label="Land" required>
                    <select value={shipping.country} onChange={set('country')} required>
                      <option value="">Selecteer land</option>
                      <option value="NL">Nederland</option>
                      <option value="BE">België</option>
                      <option value="DE">Duitsland</option>
                      <option value="FR">Frankrijk</option>
                      <option value="GB">Verenigd Koninkrijk</option>
                      <option value="ES">Spanje</option>
                      <option value="IT">Italië</option>
                      <option value="AT">Oostenrijk</option>
                      <option value="CH">Zwitserland</option>
                    </select>
                  </Field>
                </div>

                {intentError && (
                  <p className="text-sm font-sans text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                    {intentError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loadingIntent || !isDetailsValid}
                  className="w-full h-14 bg-accent hover:bg-accent/90 disabled:opacity-60 text-white text-sm font-sans font-semibold rounded-xl transition-colors duration-200"
                >
                  {loadingIntent ? 'Betaling laden…' : 'Ga door naar betalen'}
                </button>
              </form>
            )}

            {step === 'payment' && clientSecret && (
              <div className="space-y-5">
                <button
                  onClick={() => setStep('details')}
                  className="flex items-center gap-1.5 text-xs font-sans text-muted hover:text-dark transition-colors"
                >
                  <ChevronLeft size={14} />
                  Gegevens wijzigen
                </button>

                <div className="bg-white rounded-2xl p-6 md:p-8 space-y-5">
                  <h2 className="font-sans font-semibold text-sm text-dark">Betaalmethode</h2>
                  <Elements
                    stripe={stripePromise}
                    options={{ clientSecret, appearance: stripeAppearance }}
                  >
                    <PaymentForm shipping={shipping} onSuccess={handlePaymentSuccess} />
                  </Elements>
                </div>

                <p className="text-xs font-sans text-muted text-center flex items-center justify-center gap-1.5">
                  <Lock size={11} strokeWidth={2} />
                  Beveiligd door Stripe · Betaalgegevens worden nooit door ons opgeslagen
                </p>
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl p-6 md:p-8 space-y-5 lg:sticky lg:top-24">
            <h2 className="font-sans font-semibold text-sm text-dark">Besteloverzicht</h2>

            <ul className="space-y-4">
              {items.map((item) => (
                <li key={item.id} className="flex gap-4">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-surface flex-shrink-0 border border-border">
                    {item.product.images[0] && (
                      <Image
                        src={item.product.images[0].src}
                        alt={item.product.title}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-sans font-medium text-sm text-dark leading-snug">
                      {localizeItemTitle(item.product.title)}
                    </p>
                    <p className="text-xs font-sans text-muted mt-0.5">
                      {dutchColorName(item.color.name)} · Aantal {item.quantity}
                    </p>
                  </div>
                  <span className="font-sans font-semibold text-sm text-dark flex-shrink-0">
                    {formatPrice(item.product.price * item.quantity)}
                  </span>
                </li>
              ))}
            </ul>

            <div className="border-t border-border pt-4 space-y-2">
              <div className="flex items-center justify-between text-sm font-sans">
                <span className="text-muted">Subtotaal</span>
                <span className="text-dark">{formatPrice(total)}</span>
              </div>
              <div className="flex items-center justify-between text-sm font-sans">
                <span className="text-muted">Verzending</span>
                <span className="text-accent font-medium">Gratis</span>
              </div>
            </div>

            <div className="border-t border-border pt-4 flex items-center justify-between">
              <span className="font-sans font-semibold text-sm text-dark">Totaal</span>
              <span className="font-sans font-bold text-xl text-dark">{formatPrice(order_total)}</span>
            </div>

            <div className="border-t border-border pt-4 space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-sans text-muted">
                <Truck size={13} className="text-accent" />
                Voor 23:30 uur besteld, morgen in huis
              </div>
              <div className="flex items-center gap-2 text-xs font-sans text-muted">
                <RotateCcw size={13} className="text-accent" />
                14 dagen retouren, zonder gedoe
              </div>
              <div className="flex items-center gap-2 text-xs font-sans text-muted">
                <ShieldCheck size={13} className="text-accent" />
                Veilig betalen via Stripe
              </div>

              <Image
                src="/images/payment-methodes2.png"
                alt="Beschikbare betaalmethodes"
                width={326}
                height={18}
                className="h-5 w-auto pt-1"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Field helper ─────────────────────────────────────────────────────────────

function Field({
  label,
  required,
  children,
}: {
  label: string
  required?: boolean
  children: React.ReactElement<React.InputHTMLAttributes<HTMLInputElement> | React.SelectHTMLAttributes<HTMLSelectElement>>
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-sans font-semibold text-muted uppercase tracking-widest">
        {label}
        {required && <span className="text-accent ml-0.5">*</span>}
      </label>
      {children && (
        <div>
          {children.type === 'select'
            ? <select
                {...(children.props as React.SelectHTMLAttributes<HTMLSelectElement>)}
                className="w-full h-12 px-4 border border-border rounded-lg text-sm font-sans text-dark bg-white focus:outline-none focus:border-accent transition-colors duration-200 appearance-none"
              />
            : <input
                {...(children.props as React.InputHTMLAttributes<HTMLInputElement>)}
                className="w-full h-12 px-4 border border-border rounded-lg text-sm font-sans text-dark placeholder:text-muted/60 bg-white focus:outline-none focus:border-accent transition-colors duration-200"
              />
          }
        </div>
      )}
    </div>
  )
}
