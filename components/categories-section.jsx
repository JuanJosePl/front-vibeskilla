
import { Card, CardContent } from "./ui/card"
import { categories } from "../lib/products"

export function CategoriesSection() {
  return (
    <section className="py-16 lg:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-balance">Explora Nuestras Categorías</h2>
          <p className="text-muted-foreground text-pretty max-w-2xl mx-auto">
            Encuentra exactamente lo que buscas en nuestras categorías especializadas
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6">
          {categories.map((category, index) => (
            <a key={category.id} href={`/categorias/${category.id}`}>
              <Card
                className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 animate-slide-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {category.icon}
                  </div>
                  <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">{category.name}</h3>
                </CardContent>
              </Card>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
