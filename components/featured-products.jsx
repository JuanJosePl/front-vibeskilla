import { ArrowRight } from "lucide-react"
import { Button } from "./ui/button"
import { ProductCard } from "./product-card"
import { productService } from "../src/services/productService"
import { useState, useEffect } from "react"

export function FeaturedProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let isMounted = true // Para prevenir updates en componentes desmontados

    const loadProducts = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await productService.getProducts({
          featured: true,
          limit: 8,
          status: 'active'
        })
        
        if (isMounted && response.success) {
          setProducts(response.data || [])
        } else if (isMounted) {
          setError('No se pudieron cargar los productos')
        }
      } catch (err) {
        if (isMounted) {
          console.error('Error loading featured products:', err)
          setError('Error de conexión. Usando datos de demostración.')
          // Datos de demostración como fallback
          setProducts(getDemoProducts())
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadProducts()

    // Cleanup function
    return () => {
      isMounted = false
    }
  }, []) // ✅ Array de dependencias VACÍO - se ejecuta solo una vez

  // Datos de demostración para cuando falle la API
  const getDemoProducts = () => [
    {
      _id: "1",
      name: "AirPods Pro 2da Generación",
      slug: "airpods-pro-2da-generacion",
      price: 899000,
      description: "Audífonos inalámbricos con cancelación activa de ruido",
      image: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=500",
      stock: 15,
      category: "audio",
      featured: true,
      discount: 10,
      rating: 4.8,
      reviewCount: 124
    },
    {
      _id: "2", 
      name: "Parlante JBL Flip 6",
      slug: "parlante-jbl-flip-6",
      price: 499000,
      description: "Parlante Bluetooth portátil con sonido surround",
      image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500",
      stock: 8,
      category: "audio",
      featured: true,
      discount: 15,
      rating: 4.6,
      reviewCount: 89
    },
    {
      _id: "3",
      name: "Smartwatch Galaxy Watch 5",
      slug: "smartwatch-galaxy-watch-5",
      price: 799000,
      description: "Reloj inteligente con monitoreo de salud avanzado",
      image: "https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=500",
      stock: 12,
      category: "wearables",
      featured: true,
      discount: 5,
      rating: 4.7,
      reviewCount: 67
    },
    {
      _id: "4",
      name: "Tablet iPad Air",
      slug: "tablet-ipad-air",
      price: 1299000,
      description: "Tablet potente para trabajo y creatividad",
      image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500",
      stock: 6,
      category: "tablets",
      featured: true,
      discount: 8,
      rating: 4.9,
      reviewCount: 203
    }
  ]

  if (loading) {
    return (
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Cargando productos destacados...</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
          <div className="space-y-2">
            <h2 className="text-3xl lg:text-4xl font-bold text-balance">Productos Destacados</h2>
            <p className="text-muted-foreground text-pretty">
              Los productos más populares que vibran con nuestra comunidad
            </p>
            {error && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-2">
                <p className="text-yellow-800 text-sm">{error}</p>
              </div>
            )}
          </div>
          <a href="/productos">
            <Button variant="outline" className="hidden sm:flex bg-transparent">
              Ver Todos
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <ProductCard
              key={product._id}
              product={product}
              className="animate-slide-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            />
          ))}
        </div>

        <div className="text-center mt-12 sm:hidden">
          <a href="/productos">
            <Button variant="outline">
              Ver Todos los Productos
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </a>
        </div>
      </div>
    </section>
  )
}