import { PageLayout } from "../../components/page-layout"
import { ProductCard } from "../../components/product-card"
import { Badge } from "../../components/ui/badge"
import { getFeaturedProducts } from "../../lib/products"

export default function OffersPage() {
  const offerProducts = getFeaturedProducts() // Using featured products as offers

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">🔥</div>
          <h1 className="text-3xl lg:text-4xl font-bold mb-4">Ofertas Especiales</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Aprovecha nuestras mejores ofertas en productos tecnológicos. ¡Precios increíbles por tiempo limitado!
          </p>
        </div>

        {/* Offer Banner */}
        <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-8 mb-12 text-center text-white">
          <h2 className="text-2xl font-bold mb-2">¡Envío Gratis en Barranquilla y Soledad!</h2>
          <p className="text-lg opacity-90">En todas las compras. Sin mínimo de compra.</p>
        </div>

        {/* Products */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {offerProducts.map((product, index) => (
            <div key={product.id} className="relative">
              <Badge className="absolute top-2 left-2 z-10 bg-red-500">Oferta</Badge>
              <ProductCard
                product={product}
                className="animate-slide-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              />
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16 p-8 bg-muted/50 rounded-2xl">
          <h3 className="text-2xl font-bold mb-4">¿No encuentras lo que buscas?</h3>
          <p className="text-muted-foreground mb-6">
            Contáctanos por WhatsApp y te ayudamos a encontrar el producto perfecto para ti
          </p>
          <a
            href="https://wa.me/message/O4FKBMAABGC5L1"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-6 py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-colors"
          >
            Contactar por WhatsApp
          </a>
        </div>
      </div>
    </PageLayout>
  )
}
