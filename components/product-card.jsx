
import { ShoppingCart, Heart, Eye, Star, Zap, Truck, Shield } from "lucide-react"
import { Button } from "./ui/button"
import { Card, CardContent, CardFooter } from "./ui/card"
import { Badge } from "./ui/badge"
import { formatPrice } from "../lib/utils"
import { useCart } from "../hooks/use-cart"
import { useState } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../src/contexts/AuthContext"
import { useToast } from "../hooks/use-toast"

export function ProductCard({ 
  product, 
  className = "", 
  showWishlistButton = true,
  variant = "default" 
}) {
  const { addItem, toggleWishlist, isInWishlist } = useCart()
  const { isAuthenticated } = useAuth()
  const { toast } = useToast()
  const [isWishlistLoading, setIsWishlistLoading] = useState(false)
  const [isImageLoaded, setIsImageLoaded] = useState(false)

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!isAuthenticated) {
      toast({
        title: "Inicia sesión",
        description: "Debes iniciar sesión para agregar productos al carrito.",
        type: "warning",
      })
      return
    }

    addItem(product)
    toast({
      title: "¡Agregado!",
      description: `${product.name} se agregó al carrito.`,
      type: "success",
    })
  }

  const handleToggleWishlist = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!isAuthenticated) {
      toast({
        title: "Inicia sesión",
        description: "Debes iniciar sesión para agregar productos a favoritos.",
        type: "warning",
      })
      return
    }
    
    setIsWishlistLoading(true)
    try {
      toggleWishlist(product)
      await new Promise(resolve => setTimeout(resolve, 200))
    } catch (error) {
      console.error('Error toggling wishlist:', error)
    } finally {
      setIsWishlistLoading(false)
    }
  }

  const isInWishlistState = isInWishlist(product._id || product.id)
  const discountPercentage = product.comparePrice && product.comparePrice > product.price 
    ? Math.round((1 - product.price / product.comparePrice) * 100)
    : 0

  const isNew = product.createdAt && (Date.now() - new Date(product.createdAt).getTime()) < (7 * 24 * 60 * 60 * 1000)
  const isLowStock = product.stock > 0 && product.stock <= 5
  const isOutOfStock = !product.stock || product.stock <= 0

  // Calcular rating promedio
  const averageRating = product.ratings?.length 
    ? (product.ratings.reduce((acc, rating) => acc + rating.rating, 0) / product.ratings.length).toFixed(1)
    : null

  return (
    <Card className={`
      group overflow-hidden transition-all duration-500 hover:shadow-2xl hover:scale-105 cursor-pointer 
      bg-gradient-to-br from-card to-card/80 backdrop-blur-sm border-2 border-border/50
      hover:border-primary/30 relative
      ${isOutOfStock ? 'opacity-70 grayscale' : ''}
      ${className}
    `}>
      {/* Badges Superpuestos */}
      <div className="absolute top-3 left-3 z-20 flex flex-col space-y-2">
        {discountPercentage > 0 && (
          <Badge className="bg-gradient-to-r from-red-500 to-orange-500 text-white border-0 font-bold text-xs py-1 px-3 shadow-lg animate-pulse">
            -{discountPercentage}%
          </Badge>
        )}
        {product.isFeatured && (
          <Badge className="bg-gradient-to-r from-primary to-purple-600 text-white border-0 font-bold text-xs py-1 px-3 shadow-lg">
            <Star className="h-3 w-3 mr-1" />
            Destacado
          </Badge>
        )}
        {isNew && (
          <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 font-bold text-xs py-1 px-3 shadow-lg">
            NUEVO
          </Badge>
        )}
      </div>

      {/* Wishlist Button */}
      {showWishlistButton && (
        <div className="absolute top-3 right-3 z-20">
          <Button 
            size="icon" 
            variant="secondary" 
            className={`
              h-9 w-9 rounded-full backdrop-blur-sm border-0 shadow-lg transition-all duration-300
              ${isInWishlistState 
                ? 'bg-red-500 text-white hover:bg-red-600 scale-110' 
                : 'bg-white/90 text-gray-700 hover:bg-white hover:scale-110'
              }
            `}
            onClick={handleToggleWishlist}
            disabled={isWishlistLoading}
            title={isInWishlistState ? 'Quitar de favoritos' : 'Agregar a favoritos'}
          >
            <Heart className={`h-4 w-4 ${isInWishlistState ? 'fill-current' : ''}`} />
          </Button>
        </div>
      )}

      <Link to={`/productos/${product.slug || product._id || product.id}`} className="block">
        {/* Image Container */}
        <div className="relative overflow-hidden bg-muted/30">
          <div className={`aspect-square transition-all duration-700 ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}>
            <img
              src={product.images?.[0]?.url || product.image || "/placeholder-product.jpg"}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              onLoad={() => setIsImageLoaded(true)}
            />
          </div>
          
          {/* Loading Skeleton */}
          {!isImageLoaded && (
            <div className="absolute inset-0 bg-gradient-to-br from-muted to-muted/50 animate-pulse flex items-center justify-center">
              <div className="text-muted-foreground">Cargando...</div>
            </div>
          )}

          {/* Overlay con información rápida */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-3 left-3 right-3 text-white">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-1">
                  <Truck className="h-3 w-3" />
                  <span>Envío gratis</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Shield className="h-3 w-3" />
                  <span>Garantía</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <Button 
              size="sm" 
              variant="secondary"
              className="rounded-full backdrop-blur-sm bg-white/90 text-foreground hover:bg-white hover:scale-110 transition-transform"
            >
              <Eye className="h-4 w-4 mr-2" />
              Ver detalles
            </Button>
          </div>
        </div>

        {/* Product Info */}
        <CardContent className="p-4 space-y-3">
          {/* Category */}
          {product.category && (
            <div className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">
              {product.category}
            </div>
          )}

          {/* Title */}
          <h3 className="font-bold text-base leading-tight line-clamp-2 group-hover:text-primary transition-colors duration-300">
            {product.name}
          </h3>

          {/* Description */}
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {product.shortDescription || product.description}
          </p>

          {/* Rating */}
          {averageRating && (
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-3 w-3 ${
                      star <= Math.round(averageRating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-muted-foreground">
                ({averageRating})
              </span>
            </div>
          )}

          {/* Price Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-baseline space-x-2">
                <span className="text-xl font-bold text-primary">
                  {formatPrice(product.price)}
                </span>
                {product.comparePrice && product.comparePrice > product.price && (
                  <span className="text-sm line-through text-muted-foreground">
                    {formatPrice(product.comparePrice)}
                  </span>
                )}
              </div>

              {/* Stock Status */}
              {isLowStock && (
                <Badge variant="outline" className="text-orange-500 border-orange-200 text-xs">
                  <Zap className="h-3 w-3 mr-1" />
                  Últimas {product.stock}
                </Badge>
              )}
            </div>

            {/* Savings */}
            {discountPercentage > 0 && (
              <div className="text-xs text-green-600 font-semibold">
                Ahorras {formatPrice(product.comparePrice - product.price)} ({discountPercentage}% OFF)
              </div>
            )}
          </div>

          {/* Features Icons */}
          <div className="flex items-center justify-between pt-2 border-t border-border/50">
            <div className="flex items-center space-x-3 text-xs text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Truck className="h-3 w-3" />
                <span>Free</span>
              </div>
              <div className="flex items-center space-x-1">
                <Shield className="h-3 w-3" />
                <span>1 año</span>
              </div>
            </div>
            
            {/* Reviews Count */}
            {product.reviewsCount > 0 && (
              <div className="text-xs text-muted-foreground">
                {product.reviewsCount} review{product.reviewsCount !== 1 ? 's' : ''}
              </div>
            )}
          </div>
        </CardContent>
      </Link>

      {/* Actions Footer */}
      <CardFooter className="p-4 pt-0">
        <div className="flex space-x-2 w-full">
          <Button 
            onClick={handleAddToCart} 
            disabled={isOutOfStock || !isAuthenticated}
            className={`
              flex-1 py-3 font-semibold transition-all duration-300
              ${isOutOfStock 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'btn-primary hover:scale-105'
              }
            `}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            {!isAuthenticated ? 'Iniciar sesión' : isOutOfStock ? 'Agotado' : 'Agregar al carrito'}
          </Button>
        </div>
        
        {/* Additional Info */}
        {!isOutOfStock && product.stock > 0 && (
          <div className="text-xs text-center text-muted-foreground mt-2">
            {product.stock > 10 ? '✓ En stock' : `Solo ${product.stock} disponibles`}
          </div>
        )}
      </CardFooter>

      {/* Hover Effect Border */}
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-primary/20 rounded-lg transition-all duration-300 pointer-events-none" />
    </Card>
  )
}

// Variante compacta para listas
export function ProductCardCompact({ product, className = "" }) {
  return (
    <div className={`flex space-x-4 p-4 border border-border rounded-lg hover:shadow-lg transition-all duration-300 group ${className}`}>
      {/* Image */}
      <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden">
        <img
          src={product.images?.[0]?.url || product.image || "/placeholder-product.jpg"}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
      </div>
      
      {/* Content */}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        <p className="text-xs text-muted-foreground line-clamp-1 mt-1">
          {product.shortDescription || product.description}
        </p>
        <div className="flex items-center justify-between mt-2">
          <span className="font-bold text-primary">
            {formatPrice(product.price)}
          </span>
          {product.comparePrice && product.comparePrice > product.price && (
            <span className="text-xs line-through text-muted-foreground">
              {formatPrice(product.comparePrice)}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}