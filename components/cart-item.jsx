import { Minus, Plus, Trash2, Heart, Share2 } from "lucide-react"
import { Button } from "./ui/button"
import { Card, CardContent } from "./ui/card"
import { formatPrice } from "../lib/utils"
import { useCart } from "../hooks/use-cart"
import { useState } from "react"

export function CartItem({ item }) {
  const { updateQuantity, removeItem, toggleWishlist } = useCart()
  const [isRemoving, setIsRemoving] = useState(false)

  const product = item.product || item
  const quantity = item.quantity || 1
  const attributes = item.attributes || {}

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity <= 0) {
      handleRemove()
    } else {
      updateQuantity(product._id || product.id, newQuantity, attributes)
    }
  }

  const handleRemove = () => {
    setIsRemoving(true)
    setTimeout(() => {
      removeItem(product._id || product.id, attributes)
    }, 300)
  }

  const handleMoveToWishlist = () => {
    toggleWishlist(product)
    removeItem(product._id || product.id, attributes)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description,
          url: `${window.location.origin}/productos/${product.slug}`
        })
      } catch (error) {
        console.log('Error sharing:', error)
      }
    } else {
      navigator.clipboard.writeText(`${window.location.origin}/productos/${product.slug}`)
      alert('Enlace copiado al portapapeles')
    }
  }

  return (
    <Card className={`overflow-hidden transition-all duration-300 ${isRemoving ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
      <CardContent className="p-4">
        <div className="flex items-center space-x-4">
          {/* Product Image */}
          <div className="flex-shrink-0 relative">
            <img 
              src={product.images?.[0]?.url || product.image || "/placeholder.svg"} 
              alt={product.name} 
              className="h-20 w-20 object-cover rounded-md" 
            />
            {quantity > 1 && (
              <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                {quantity}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm mb-1 line-clamp-2 hover:text-primary cursor-pointer">
              <a href={`/productos/${product.slug}`}>{product.name}</a>
            </h3>
            <p className="text-xs text-muted-foreground mb-2 line-clamp-1">{product.description}</p>
            
            {/* Atributos si existen */}
            {attributes && Object.keys(attributes).length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2">
                {Object.entries(attributes).map(([key, value]) => (
                  <span key={key} className="text-xs bg-muted px-2 py-1 rounded">
                    {key}: {value}
                  </span>
                ))}
              </div>
            )}
            
            {/* Stock Status */}
            <div className="flex items-center justify-between mb-2">
              <span className={`text-xs px-2 py-1 rounded-full ${
                product.stock > 0 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                  : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
              }`}>
                {product.stock > 0 ? 'En stock' : 'Agotado'}
              </span>
              <span className="font-bold text-primary text-sm">{formatPrice(product.price)}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                Subtotal: {formatPrice(product.price * quantity)}
              </span>
              
              {/* Quick Actions */}
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={handleMoveToWishlist}
                  title="Mover a lista de deseos"
                >
                  <Heart className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={handleShare}
                  title="Compartir producto"
                >
                  <Share2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>

          {/* Quantity Controls */}
          <div className="flex flex-col items-center space-y-2">
            <div className="flex items-center border rounded-lg bg-background">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 hover:bg-muted"
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= 1}
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="px-3 py-1 text-sm min-w-[40px] text-center font-medium">{quantity}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 hover:bg-muted"
                onClick={() => handleQuantityChange(quantity + 1)}
                disabled={product.stock <= 0}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={handleRemove}
              title="Eliminar producto"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}