"use client"

import { ShoppingCart, Heart, Eye } from "lucide-react"
import { Button } from "./ui/button"
import { Card, CardContent, CardFooter } from "./ui/card"
import { Badge } from "./ui/badge"
import { formatPrice } from "../lib/utils"
import { useCart } from "../hooks/use-cart"
import { useState } from "react"
import { Link } from "react-router-dom"

export function ProductCard({ product, className = "", showWishlistButton = true }) {
  const { addItem, toggleWishlist, isInWishlist } = useCart()
  const [isWishlistLoading, setIsWishlistLoading] = useState(false)

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    addItem(product)
  }

  const handleToggleWishlist = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    
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

  return (
    <Card className={`group overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer ${className}`}>
      <Link to={`/productos/${product.slug || product._id || product.id}`} className="block">
        <div className="relative overflow-hidden">
          <img
            src={product.images?.[0]?.url || product.image || "/placeholder.svg"}
            alt={product.name}
            className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          {product.featured && <Badge className="absolute top-2 left-2 bg-primary">Destacado</Badge>}
          {product.discount && (
            <Badge className="absolute top-2 left-2 bg-red-500">
              -{product.discount}%
            </Badge>
          )}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 space-y-2">
            {showWishlistButton && (
              <Button 
                size="icon" 
                variant="secondary" 
                className={`h-8 w-8 ${isInWishlistState ? 'bg-red-50 text-red-500 hover:bg-red-100' : ''}`}
                onClick={handleToggleWishlist}
                disabled={isWishlistLoading}
                title={isInWishlistState ? 'Quitar de favoritos' : 'Agregar a favoritos'}
              >
                <Heart className={`h-4 w-4 ${isInWishlistState ? 'fill-current' : ''}`} />
              </Button>
            )}
            <Button 
              size="icon" 
              variant="secondary" 
              className="h-8 w-8"
              title="Ver detalles"
            >
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <CardContent className="p-4">
          <h3 className="font-semibold text-sm mb-2 line-clamp-2 hover:text-primary transition-colors">
            {product.name}
          </h3>
          <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{product.description}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold text-primary">
                {product.discount 
                  ? formatPrice(product.price * (1 - product.discount / 100))
                  : formatPrice(product.price)
                }
              </span>
              {product.discount && (
                <span className="text-sm line-through text-muted-foreground">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>
            {product.stock > 0 ? (
              <Badge variant="secondary" className="text-xs">
                En stock
              </Badge>
            ) : (
              <Badge variant="destructive" className="text-xs">
                Agotado
              </Badge>
            )}
          </div>
        </CardContent>
      </Link>

      <CardFooter className="p-4 pt-0">
        <div className="flex space-x-2 w-full">
          <Button 
            onClick={handleAddToCart} 
            disabled={!product.stock || product.stock <= 0} 
            className="flex-1 btn-primary"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Agregar
          </Button>
          {showWishlistButton && (
            <Button 
              variant="outline" 
              size="icon"
              className={`flex-shrink-0 ${isInWishlistState ? 'bg-red-50 text-red-500 border-red-200 hover:bg-red-100' : ''}`}
              onClick={handleToggleWishlist}
              disabled={isWishlistLoading}
              title={isInWishlistState ? 'Quitar de favoritos' : 'Agregar a favoritos'}
            >
              <Heart className={`h-4 w-4 ${isInWishlistState ? 'fill-current' : ''}`} />
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}