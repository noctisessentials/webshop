import Link from 'next/link'

type PolicyPageProps = {
  title: string
  breadcrumb?: string
  children: React.ReactNode
}

export function PolicyPage({ title, breadcrumb, children }: PolicyPageProps) {
  return (
    <div className="bg-light min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-surface border-b border-border">
        <div className="container-content py-3.5">
          <nav className="flex items-center gap-2 text-xs font-sans text-muted" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-dark transition-colors">Home</Link>
            <span>/</span>
            <span className="text-dark">{breadcrumb ?? title}</span>
          </nav>
        </div>
      </div>

      <div className="container-narrow py-14 md:py-20">
        <h1
          className="font-sans font-bold text-dark mb-10 leading-tight"
          style={{ fontSize: 'clamp(26px, 3.5vw, 40px)' }}
        >
          {title}
        </h1>
        <div className="space-y-8 font-sans text-dark/80 leading-relaxed text-base">
          {children}
        </div>
      </div>
    </div>
  )
}

export function PolicySection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="font-sans font-semibold text-dark text-lg mb-3">{title}</h2>
      <div className="space-y-3 text-dark/75">{children}</div>
    </section>
  )
}
