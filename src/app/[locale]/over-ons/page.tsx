import type { Metadata } from 'next'
import { PolicyPage } from '@/components/layout/PolicyPage'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  if (locale === 'en') {
    return {
      title: 'About Noctis | Noctis',
      description: 'At Noctis, kitchenware goes beyond the ordinary. Functional and stylish products for the kitchen.',
    }
  }
  return {
    title: 'Over ons | Noctis',
    description: 'Bij Noctis gaat keukengerei verder dan het gewone. Functionele en stijlvolle producten voor de keuken.',
  }
}

export default async function OverOnsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations('about')
  const isEn = locale === 'en'

  if (isEn) {
    return (
      <PolicyPage title={t('title')}>
        <p className="text-lg text-dark/85 leading-relaxed font-medium">
          At Noctis, kitchenware goes beyond the ordinary. Our passion is simple: to elevate the kitchen — the heart of every home — with products that are both functional and beautiful.
        </p>

        <p>
          Our kitchen products fit effortlessly into any kitchen, from subtly powerful tones to vibrant, expressive colours. Each item is carefully designed to complement your space or create striking contrasts.
        </p>

        <p>
          Most kitchens aren&apos;t missing tools. They&apos;re missing calm. Different colours, different materials, nothing feels like a whole — and you notice it every day. We believe the kitchen is the heart of the home. Not just as a workspace, but as a space where you spend time every day.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4">
          {[
            { title: 'Designed for calm', body: 'Every product is designed to match the rest. One style, one colour palette, one cohesive whole on your countertop.' },
            { title: 'Made for daily use', body: 'No showpieces. All our products are made for everyday use — sturdy, safe and easy to clean.' },
            { title: 'Carefully curated', body: 'We select every product with care. What doesn\'t fit, we don\'t add.' },
          ].map((item) => (
            <div key={item.title} className="bg-surface rounded-[18px] p-6 border border-border">
              <h3 className="font-sans font-semibold text-dark mb-2">{item.title}</h3>
              <p className="text-sm text-dark/70 leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>

        <p>
          Noctis is a Dutch brand, based in Amsterdam. We are proud of our free shipping within the Netherlands and Belgium, secure payment methods and personal customer service.
        </p>

        <div className="border-t border-border pt-8 mt-4">
          <h2 className="font-sans font-semibold text-dark text-lg mb-4">Contact details</h2>
          <div className="text-sm space-y-1 text-dark/70">
            <p><span className="font-medium text-dark">Company name:</span> Noctis</p>
            <p><span className="font-medium text-dark">Location:</span> Amsterdam, Netherlands</p>
            <p><span className="font-medium text-dark">Email:</span> info@noctisessentials.com</p>
            <p><span className="font-medium text-dark">Phone:</span> +31 6 87267125</p>
            <p><span className="font-medium text-dark">KvK number:</span> 95790004</p>
            <p><span className="font-medium text-dark">VAT number:</span> NL867300875B01</p>
          </div>
          <div className="mt-6">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-dark text-light font-sans font-semibold text-sm px-6 py-3 hover:bg-dark/85 transition-colors duration-200"
            >
              {t('contactCta')}
            </Link>
          </div>
        </div>
      </PolicyPage>
    )
  }

  return (
    <PolicyPage title="Over Noctis">
      <p className="text-lg text-dark/85 leading-relaxed font-medium">
        Bij Noctis gaat keukengerei verder dan het gewone. Onze passie is simpel: de keuken — het hart van elk huis — naar een hoger niveau tillen met functionele én stijlvolle producten.
      </p>

      <p>
        Onze keukenproducten passen moeiteloos in elke keuken, van subtiel krachtige tinten tot levendige, expressieve kleuren. Elk item is zorgvuldig ontworpen om jouw ruimte te complementeren of opvallende contrasten te creëren.
      </p>

      <p>
        De meeste keukens missen geen tools. Ze missen rust. Verschillende kleuren, verschillende materialen, niets voelt echt als een geheel — en dat merk je elke dag. Wij geloven dat de keuken het hart van het huis is. Niet alleen als werkplek, maar als ruimte waar je elke dag tijd doorbrengt.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4">
        {[
          { title: 'Ontworpen voor rust', body: 'Elk product is ontworpen om bij de rest te passen. Eén stijl, één kleurpalet, één geheel op jouw aanrecht.' },
          { title: 'Gemaakt voor gebruik', body: 'Geen showstukken. Al onze producten zijn gemaakt voor dagelijks gebruik — stevig, veilig en makkelijk schoon te houden.' },
          { title: 'Zorgvuldig samengesteld', body: 'Wij kiezen elk product zorgvuldig. Wat er niet bij past, voegen we niet toe.' },
        ].map((item) => (
          <div key={item.title} className="bg-surface rounded-[18px] p-6 border border-border">
            <h3 className="font-sans font-semibold text-dark mb-2">{item.title}</h3>
            <p className="text-sm text-dark/70 leading-relaxed">{item.body}</p>
          </div>
        ))}
      </div>

      <p>
        Noctis is een Nederlands merk, gevestigd in Amsterdam. We zijn trots op onze gratis verzending binnen Nederland en België, veilige betaalmethoden en persoonlijke klantenservice.
      </p>

      <div className="border-t border-border pt-8 mt-4">
        <h2 className="font-sans font-semibold text-dark text-lg mb-4">Contactgegevens</h2>
        <div className="text-sm space-y-1 text-dark/70">
          <p><span className="font-medium text-dark">Bedrijfsnaam:</span> Noctis</p>
          <p><span className="font-medium text-dark">Vestiging:</span> Amsterdam, Nederland</p>
          <p><span className="font-medium text-dark">E-mail:</span> info@noctisessentials.com</p>
          <p><span className="font-medium text-dark">Whatsapp:</span> +31 6 87267125</p>
          <p><span className="font-medium text-dark">KvK-nummer:</span> 95790004</p>
          <p><span className="font-medium text-dark">BTW-nummer:</span> NL867300875B01</p>
        </div>
        <div className="mt-6">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-full bg-dark text-light font-sans font-semibold text-sm px-6 py-3 hover:bg-dark/85 transition-colors duration-200"
          >
            {t('contactCta')}
          </Link>
        </div>
      </div>
    </PolicyPage>
  )
}
