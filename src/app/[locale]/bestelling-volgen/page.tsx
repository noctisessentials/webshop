import type { Metadata } from 'next'
import { Link } from '@/i18n/navigation'
import OrderTrackClient from './OrderTrackClient'

export const metadata: Metadata = {
  title: 'Bestelling volgen | Noctis',
  description: 'Voer je ordernummer en postcode in om de status van je bestelling en DHL tracking te bekijken.',
}

export default function BestelVolgenPage() {
  return (
    <div className="bg-light min-h-screen">
      <div className="bg-surface border-b border-border">
        <div className="container-content py-3.5">
          <nav className="flex items-center gap-2 text-xs font-sans text-muted">
            <Link href="/" className="hover:text-dark transition-colors">Home</Link>
            <span>/</span>
            <span className="text-dark">Bestelling volgen</span>
          </nav>
        </div>
      </div>

      <div className="container-narrow py-14 md:py-20">
        <div className="mb-10">
          <h1
            className="font-sans font-bold text-dark leading-tight mb-3"
            style={{ fontSize: 'clamp(26px, 3.5vw, 40px)' }}
          >
            Bestelling volgen
          </h1>
          <p className="text-base font-sans text-muted">
            Voer je ordernummer en postcode in om de status van je pakket te bekijken.
          </p>
        </div>

        <OrderTrackClient />
      </div>
    </div>
  )
}
