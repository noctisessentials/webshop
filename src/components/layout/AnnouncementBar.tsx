import { getTranslations } from 'next-intl/server'

export async function AnnouncementBar() {
  const t = await getTranslations('announcement')

  const messages = [
    t('msg1'),
    t('msg2'),
    t('msg3'),
    t('msg4'),
    t('msg5'),
  ]

  const repeated = [...messages, ...messages]

  return (
    <div
      className="bg-dark text-light overflow-hidden"
      style={{ height: '36px' }}
      aria-label="Website mededelingen"
    >
      <div className="flex items-center h-full">
        <div className="marquee-track">
          {repeated.map((msg, i) => (
            <span
              key={i}
              className="flex items-center gap-8 px-8 text-xs font-sans tracking-widest uppercase whitespace-nowrap"
            >
              <span className="text-accent text-xs">✦</span>
              {msg}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
