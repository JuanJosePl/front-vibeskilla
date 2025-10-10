

import { ArrowLeft } from "lucide-react"
import { PageLayout } from "../../../components/page-layout"
import { ProductCard } from "../../../components/product-card"
import { Button } from "../../../components/ui/button"
import { categories, getProductsByCategory } from "../../../lib/products"

export default function CategoryPage() {
  const params = useParams()
  const category = categories.find((cat) => cat.id === params.id)
  const categoryProducts = getProductsByCategory(params.id)

  if (!category) {
    return (
      <PageLayout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Categoría no encontrada</h1>
          <Link href="/categorias">
            <Button>Volver a categorías</Button>
          </Link>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-8">
          <Link href="/" className="hover:text-primary">
            Inicio
          </Link>
          <span>/</span>
          <Link href="/categorias" className="hover:text-primary">
            Categorías
          </Link>
          <span>/</span>
          <span className="text-foreground">{category.name}</span>
        </div>

        {/* Back Button */}
        <Link
          href="/categorias"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver a categorías
        </Link>

        {/* Category Header */}
        <div className="text-center mb-12">
          <div className="text-8xl mb-4">{category.icon}</div>
          <h1 className="text-3xl lg:text-4xl font-bold mb-4">{category.name}</h1>
          <p className="text-muted-foreground">{categoryProducts.length} productos en esta categoría</p>
        </div>

        {/* Products */}
        {categoryProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categoryProducts.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                className="animate-slide-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold mb-2">No hay productos en esta categoría</h3>
            <p className="text-muted-foreground mb-4">Pronto agregaremos productos a esta categoría</p>
            <Link href="/productos">
              <Button>Ver todos los productos</Button>
            </Link>
          </div>
        )}
      </div>
    </PageLayout>
  )
}
