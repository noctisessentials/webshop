import type { Metadata } from 'next'
import { VanRommelNaarRustClient } from '@/components/product/VanRommelNaarRustClient'

export const metadata: Metadata = {
  title: 'Van rommel naar rust — het verhaal | Noctis',
  description:
    'Eén besluit dat alles veranderde. Het verhaal achter de Noctis 19-delige keukenset.',
  robots: { index: false, follow: false },
}

export default function VanRommelNaarRustPage() {
  return <VanRommelNaarRustClient />
}
