import { PageLayout } from "../../components/page-layout"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { categories, getProductsByCategory } from "../../lib/products"

export default function CategoriesPage() {
  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold mb-4">Categorías</h1>
          <p className="text-muted-foreground">Explora nuestras categorías de productos tecnológicos</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => {
            const categoryProducts = getProductsByCategory(category.id)

            return (
              <a key={category.id} href={`/categorias/${category.id}`}>
                <Card
                  className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 animate-slide-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardHeader className="text-center">
                    <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                      {category.icon}
                    </div>
                    <CardTitle className="group-hover:text-primary transition-colors">{category.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-muted-foreground">{categoryProducts.length} productos disponibles</p>
                  </CardContent>
                </Card>
              </a>
            )
          })}
        </div>
      </div>
    </PageLayout>
  )
}
