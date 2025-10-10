import React, { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useProducts } from '../../src/hooks/useProducts'
import { useCart } from '../../hooks/use-cart'
import { useAuth } from '../../src/contexts/AuthContext'
import { useToast } from '../../hooks/use-toast'
import { cartService } from '../../src/services/cartService'
import { formatPrice } from '../../lib/utils'

export default function ProductsPage() {
  const [searchParams] = useSearchParams()
  const category = searchParams.get('category')
  const search = searchParams.get('search')
  
  const [filters, setFilters] = useState({
    category,
    search,
    page: 1,
    limit: 12
  })

  const { products, loading, error, pagination } = useProducts(filters)
  const { addItem, isInWishlist, toggleWishlist } = useCart()
  const { isAuthenticated, token } = useAuth()
  const { toast } = useToast()

  // Actualizar filtros cuando cambien los search params
  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      category,
      search
    }))
  }, [category, search])

  const handleAddToCart = async (product) => {
    if (!isAuthenticated) {
      toast({
        title: 'Inicia sesión',
        description: 'Debes iniciar sesión para agregar productos al carrito.',
        type: 'warning'
      })
      return
    }

    try {
      await cartService.addToCart({
        productId: product._id,
        quantity: 1
      }, token)

      // También actualizar carrito local
      addItem({
        id: product._id,
        name: product.name,
        price: product.price,
        image: product.images[0]?.url,
        slug: product.slug
      })

      toast({
        title: 'Producto agregado',
        description: `${product.name} se agregó al carrito.`,
        type: 'success'
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo agregar el producto al carrito.',
        type: 'error'
      })
    }
  }

  const handleWishlist = (product) => {
    toggleWishlist({
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.images[0]?.url,
      slug: product.slug
    })

    toast({
      title: isInWishlist(product._id) ? 'Eliminado de favoritos' : 'Agregado a favoritos',
      description: isInWishlist(product._id) 
        ? `${product.name} se eliminó de tu lista de deseos.`
        : `${product.name} se agregó a tu lista de deseos.`,
      type: 'success'
    })
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="product-card p-4">
              <div className="skeleton h-48 w-full rounded-lg mb-4"></div>
              <div className="skeleton h-4 w-3/4 mb-2"></div>
              <div className="skeleton h-4 w-1/2 mb-4"></div>
              <div className="skeleton h-10 w-full rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Error al cargar productos</h2>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-heading text-foreground mb-2">
          {search ? `Resultados para "${search}"` : 'Nuestros Productos'}
        </h1>
        {category && (
          <p className="text-muted-foreground">Categoría: {category}</p>
        )}
      </div>

      {/* Products Grid */}
      {products.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold text-foreground mb-2">
            No se encontraron productos
          </h3>
          <p className="text-muted-foreground">
            {search ? 'Intenta con otros términos de búsqueda.' : 'Pronto agregaremos más productos.'}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <div key={product._id} className="product-card group">
                {/* Product Image */}
                <div className="relative overflow-hidden rounded-t-lg">
                  <Link to={`/productos/${product.slug}`}>
                    <img
                      src={product.images[0]?.url || '/placeholder-product.jpg'}
                      alt={product.images[0]?.altText || product.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </Link>
                  
                  {/* Wishlist Button */}
                  <button
                    onClick={() => handleWishlist(product)}
                    className="absolute top-3 right-3 p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-colors"
                  >
                    <svg
                      className={`w-5 h-5 ${
                        isInWishlist(product._id) 
                          ? 'fill-red-500 text-red-500' 
                          : 'fill-none text-foreground'
                      }`}
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>

                  {/* Status Badges */}
                  {product.isFeatured && (
                    <div className="absolute top-3 left-3">
                      <span className="px-2 py-1 text-xs font-medium bg-primary text-primary-foreground rounded-full">
                        Destacado
                      </span>
                    </div>
                  )}
                  
                  {product.stock === 0 && (
                    <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
                      <span className="px-3 py-1 text-sm font-medium bg-destructive text-destructive-foreground rounded-full">
                        Agotado
                      </span>
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <Link to={`/productos/${product.slug}`}>
                    <h3 className="font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                  </Link>
                  
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {product.shortDescription || product.description}
                  </p>

                  {/* Price */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-xl font-bold text-foreground">
                        {formatPrice(product.price)}
                      </span>
                      {product.comparePrice && product.comparePrice > product.price && (
                        <span className="text-sm text-muted-foreground line-through">
                          {formatPrice(product.comparePrice)}
                        </span>
                      )}
                    </div>
                    
                    {product.stock > 0 && product.stock <= 10 && (
                      <span className="text-xs text-orange-500 font-medium">
                        ¡Solo {product.stock} disponibles!
                      </span>
                    )}
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={() => handleAddToCart(product)}
                    disabled={product.stock === 0 || !isAuthenticated}
                    className="w-full py-2 px-4 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed transition-all"
                  >
                    {!isAuthenticated ? 'Inicia sesión' : product.stock === 0 ? 'Agotado' : 'Agregar al Carrito'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination && pagination.pages > 1 && (
            <div className="flex justify-center items-center space-x-2 mt-8">
              <button
                onClick={() => setFilters(prev => ({ ...prev, page: prev.page - 1 }))}
                disabled={pagination.current === 1}
                className="px-4 py-2 border border-border rounded-lg hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Anterior
              </button>
              
              <span className="text-sm text-muted-foreground">
                Página {pagination.current} de {pagination.pages}
              </span>
              
              <button
                onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}
                disabled={pagination.current === pagination.pages}
                className="px-4 py-2 border border-border rounded-lg hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Siguiente
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}