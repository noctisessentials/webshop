import { ProductCard } from './ProductCard'
import { getWCRelatedProducts } from '@/lib/woocommerce'

type RelatedProductsProps = {
  currentHandle: string
}

export async function RelatedProducts({ currentHandle }: RelatedProductsProps) {
  const related = await getWCRelatedProducts(currentHandle, 3)

  if (related.length === 0) return null

  return (
    <section className="section-py bg-surface border-t border-border">
      <div className="container-content">
        <div className="flex items-center gap-4 mb-12">
          <span className="h-px flex-1 max-w-12 bg-border" />
          <p className="text-xs font-sans uppercase tracking-ultra text-muted">
            You May Also Like
          </p>
          <span className="h-px flex-1 max-w-12 bg-border" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {related.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}
