import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'

export async function CategoryGrid() {
  const t = await getTranslations('home.categories')

  const categories = [
    {
      label: t('acacia'),
      href: '/acacia-snijplank' as const,
      image: '/images/products/acacia.jpg',
    },
    {
      label: t('mills'),
      href: '/peper-en-zoutmolens' as const,
      image: '/images/products/mills-white.jpg',
    },
    {
      label: t('kitchenSet'),
      href: '/19-delige-keukenset' as const,
      image: '/images/products/kitchenware-grey.jpg',
    },
  ]

  return (
    <section className="section-py-sm">
      <div className="container-content">
        <h2
          className="font-sans font-bold text-dark tracking-tight text-center mb-8"
          style={{ fontSize: 'clamp(22px, 2.5vw, 32px)' }}
        >
          {t('title')}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
          {categories.map(({ label, href, image }) => (
            <Link
              key={label}
              href={href}
              className="group relative overflow-hidden block"
              style={{
                borderRadius: '18px',
                aspectRatio: '3/4',
              }}
            >
              <Image
                src={image}
                alt={label}
                fill
                className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.03]"
                sizes="(max-width: 640px) 100vw, 33vw"
              />

              <div
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(to top, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0) 50%)',
                }}
              />

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                <span className="inline-flex items-center justify-center whitespace-nowrap rounded-full bg-white px-6 py-3 text-base md:text-[22px] font-sans font-medium text-dark shadow-md">
                  {label}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
