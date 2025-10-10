import { Truck, Shield, Clock, Tag, X } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Separator } from "./ui/separator"
import { Input } from "./ui/input"
import { formatPrice } from "../lib/utils"
import { useCart } from "../hooks/use-cart"
import { useState } from "react"

export function CartSummary({ onCheckout }) {
  const { items, getTotal, getDiscount, getFinalTotal, getItemCount, coupon, applyCoupon, removeCoupon } = useCart()
  const [couponCode, setCouponCode] = useState('')
  const [couponError, setCouponError] = useState('')
  const [isApplying, setIsApplying] = useState(false)

  const subtotal = getTotal()
  const discount = getDiscount()
  const shipping = subtotal > 100000 ? 0 : 15000
  const total = getFinalTotal() + (shipping - discount)
  const itemCount = getItemCount()

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return
    
    setIsApplying(true)
    setCouponError('')
    
    const success = await applyCoupon(couponCode)
    if (success) {
      setCouponCode('')
    } else {
      setCouponError('Cupón inválido o expirado')
    }
    
    setIsApplying(false)
  }

  const handleRemoveCoupon = () => {
    removeCoupon()
    setCouponError('')
  }

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle>Resumen del Pedido</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Order Summary */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Productos ({itemCount})</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          
          {/* Cupón Section */}
          {coupon ? (
            <div className="flex justify-between text-sm items-center bg-green-50 dark:bg-green-950 p-2 rounded">
              <div className="flex items-center space-x-2">
                <Tag className="h-3 w-3 text-green-600" />
                <span className="text-green-700 dark:text-green-300">Cupón: {coupon.code}</span>
                <span className="text-green-600 font-medium">
                  -{coupon.type === 'percentage' ? `${coupon.discount}%` : formatPrice(coupon.discount)}
                </span>
              </div>
              <Button variant="ghost" size="icon" className="h-4 w-4" onClick={handleRemoveCoupon}>
                <X className="h-3 w-3" />
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex space-x-2">
                <Input
                  placeholder="Código de cupón"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1 text-sm"
                  onKeyPress={(e) => e.key === 'Enter' && handleApplyCoupon()}
                />
                <Button 
                  onClick={handleApplyCoupon} 
                  variant="outline" 
                  className="text-sm"
                  disabled={isApplying || !couponCode.trim()}
                >
                  {isApplying ? '...' : 'Aplicar'}
                </Button>
              </div>
              {couponError && (
                <p className="text-red-500 text-xs">{couponError}</p>
              )}
            </div>
          )}
          
          {discount > 0 && (
            <div className="flex justify-between text-sm text-green-600">
              <span>Descuento</span>
              <span>-{formatPrice(discount)}</span>
            </div>
          )}
          
          <div className="flex justify-between text-sm">
            <span>Envío</span>
            <span className={shipping === 0 ? "text-green-600 font-medium" : ""}>
              {shipping === 0 ? "GRATIS" : formatPrice(shipping)}
            </span>
          </div>
          
          <Separator />
          
          <div className="flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span className="text-primary">{formatPrice(total)}</span>
          </div>

          {/* Savings Message */}
          {discount > 0 && (
            <div className="bg-blue-50 dark:bg-blue-950 p-2 rounded text-center">
              <p className="text-blue-700 dark:text-blue-300 text-sm">
                ¡Estás ahorrando {formatPrice(discount)}!
              </p>
            </div>
          )}
        </div>

        {/* Shipping Info */}
        {shipping === 0 ? (
          <div className="bg-green-50 dark:bg-green-950 p-3 rounded-md">
            <div className="flex items-center space-x-2 text-green-700 dark:text-green-300">
              <Truck className="h-4 w-4" />
              <span className="text-sm font-medium">¡Envío gratis incluido!</span>
            </div>
          </div>
        ) : (
          <div className="bg-muted p-3 rounded-md">
            <div className="text-sm text-muted-foreground">
              Agrega {formatPrice(100000 - subtotal)} más para envío gratis
            </div>
          </div>
        )}

        {/* Benefits */}
        <div className="space-y-2 pt-2">
          <div className="flex items-center space-x-2 text-sm">
            <Shield className="h-4 w-4 text-primary" />
            <span>Garantía incluida de 12 meses</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <Clock className="h-4 w-4 text-primary" />
            <span>Soporte 24/7</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <Truck className="h-4 w-4 text-primary" />
            <span>Entrega en 24-48 horas</span>
          </div>
        </div>

        {/* Checkout Button */}
        <Button 
          onClick={onCheckout} 
          disabled={items.length === 0} 
          className="w-full btn-primary" 
          size="lg"
        >
          Proceder al Checkout
        </Button>

        {/* Security Badge */}
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 text-xs text-muted-foreground">
            <Shield className="h-3 w-3" />
            <span>Compra 100% segura - Pagos cifrados SSL</span>
          </div>
        </div>

        {/* Continue Shopping */}
        <Button variant="outline" className="w-full bg-transparent" asChild>
          <a href="/productos">Continuar Comprando</a>
        </Button>
      </CardContent>
    </Card>
  )
}