import Image from 'next/image'
import Link from 'next/link'
import { Camera } from 'lucide-react'
import { SectionFrame } from '@/components/ui/SectionFrame'

type InstagramMedia = {
  id: string
  src: string
  permalink: string
  alt: string
  mediaType: 'IMAGE' | 'VIDEO'
  poster?: string
}

type InstagramGraphItem = {
  id: string
  caption?: string
  media_url?: string
  thumbnail_url?: string
  permalink?: string
  media_type?: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM' | string
}

type InstagramGraphResponse = {
  data?: InstagramGraphItem[]
  paging?: {
    next?: string
  }
}

const FALLBACK_UGC: InstagramMedia[] = [
  { id: 'ugc-kitchen-1', src: '/content/peper-en-zoutmolens-lifestyle-zwart-wit.webp', permalink: 'https://instagram.com/noctisessentials', alt: 'Noctis keuken inspiratie', mediaType: 'IMAGE' },
  { id: 'ugc-kitchen-2', src: '/content/acacia-snijplank-lifestyle-1-800x1067.webp', permalink: 'https://instagram.com/noctisessentials', alt: 'Noctis klantfoto keuken', mediaType: 'IMAGE' },
  { id: 'ugc-kitchen-3', src: '/content/peper-en-zoutmolens-groen-boven-pan.webp', permalink: 'https://instagram.com/noctisessentials', alt: 'Noctis keuken styling', mediaType: 'IMAGE' },
  { id: 'ugc-kitchen-4', src: '/content/acacia-snijplank-lifestyle-2.jpg', permalink: 'https://instagram.com/noctisessentials', alt: 'Noctis product in keuken', mediaType: 'IMAGE' },
  { id: 'ugc-kitchen-5', src: '/content/transp-set-nude-website-banner.webp', permalink: 'https://instagram.com/noctisessentials', alt: 'Noctis accessoires', mediaType: 'IMAGE' },
  { id: 'ugc-kitchen-6', src: '/content/peper-en-zoutmolens-zwart-doos-kabel.webp', permalink: 'https://instagram.com/noctisessentials', alt: 'Noctis countertop setup', mediaType: 'IMAGE' },
  { id: 'ugc-kitchen-7', src: '/content/noctis-houder.webp', permalink: 'https://instagram.com/noctisessentials', alt: 'Noctis user generated content', mediaType: 'IMAGE' },
  { id: 'ugc-kitchen-8', src: '/content/acacia-snijplank-product-foto-scaled.jpg', permalink: 'https://instagram.com/noctisessentials', alt: 'Noctis community post', mediaType: 'IMAGE' },
]

function normalizeInstagramItem(item: InstagramGraphItem): InstagramMedia | null {
  if (!item.id) return null

  const mediaType = item.media_type === 'VIDEO' ? 'VIDEO' : 'IMAGE'
  const src =
    mediaType === 'VIDEO'
      ? item.media_url ?? item.thumbnail_url ?? ''
      : item.media_url ?? item.thumbnail_url ?? ''

  if (!src) return null

  return {
    id: item.id,
    src,
    mediaType,
    poster: item.thumbnail_url,
    permalink: item.permalink ?? 'https://instagram.com/noctisessentials',
    alt: item.caption?.slice(0, 120) || 'Instagram post van Noctis',
  }
}

async function fetchInstagramMedia(): Promise<InstagramMedia[]> {
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN?.trim()
  if (!accessToken) return FALLBACK_UGC

  try {
    const fields = 'id,caption,media_url,thumbnail_url,permalink,media_type'
    let nextUrl: string | undefined = `https://graph.instagram.com/me/media?fields=${fields}&limit=25&access_token=${encodeURIComponent(accessToken)}`
    const allItems: InstagramGraphItem[] = []
    let pageCount = 0

    while (nextUrl && pageCount < 4) {
      const response = await fetch(nextUrl, { next: { revalidate: 1800 } })
      if (!response.ok) {
        const errorBody = await response.text().catch(() => '')
        console.warn('[InstagramGrid] Kon Instagram media niet ophalen:', response.status, errorBody.slice(0, 220))
        break
      }

      const data = (await response.json()) as InstagramGraphResponse
      const pageItems = data.data ?? []
      if (pageItems.length === 0) break

      allItems.push(...pageItems)
      nextUrl = data.paging?.next
      pageCount += 1
    }

    const normalized = allItems
      .map(normalizeInstagramItem)
      .filter((item): item is InstagramMedia => Boolean(item))

    if (normalized.length === 0) return FALLBACK_UGC

    if (normalized.length >= 8) return normalized.slice(0, 8)

    const merged = [
      ...normalized,
      ...FALLBACK_UGC.filter((fb) => !normalized.some((item) => item.src === fb.src)),
    ]

    return merged.slice(0, 8)
  } catch {
    return FALLBACK_UGC
  }
}

export async function InstagramGrid() {
  const items = await fetchInstagramMedia()

  return (
    <SectionFrame>
      <div className="bg-white section-py-sm">
        <div className="container-content">
          <div className="flex items-center justify-between mb-8">
            <h2
              className="font-sans font-bold text-dark tracking-tight"
              style={{ fontSize: 'clamp(24px, 3vw, 44px)' }}
            >
              Een stijl die verder gaat dan de keuken
            </h2>
            <Link
              href="https://instagram.com/noctisessentials"
              className="hidden md:flex items-center gap-2 text-xs font-sans font-semibold uppercase tracking-widest text-muted hover:text-dark transition-colors duration-200"
            >
              <Camera size={14} strokeWidth={2} />
              @noctisessentials
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
            {items.map((item) => (
              <a
                key={item.id}
                href={item.permalink}
                target="_blank"
                rel="noreferrer"
                className="group relative overflow-hidden cursor-pointer"
                style={{
                  borderRadius: '14px',
                  aspectRatio: '4/5',
                }}
              >
                {item.mediaType === 'VIDEO' ? (
                  <video
                    src={item.src}
                    poster={item.poster}
                    className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.03]"
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                  />
                ) : (
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.03]"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                )}
                <div className="absolute inset-0 bg-dark/0 group-hover:bg-dark/25 transition-all duration-300 flex items-center justify-center">
                  <Camera
                    size={22}
                    strokeWidth={1.5}
                    className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  />
                </div>
              </a>
            ))}
          </div>

          <div className="mt-5 text-center md:hidden">
            <Link
              href="https://instagram.com/noctisessentials"
              className="inline-flex items-center gap-2 text-xs font-sans font-semibold uppercase tracking-widest text-muted hover:text-dark transition-colors duration-200"
            >
              <Camera size={13} strokeWidth={2} />
              Volg @noctisessentials
            </Link>
          </div>
        </div>
      </div>
    </SectionFrame>
  )
}
