import { APP_CONSTANTS } from './constants'

// Formatear precio
export const formatPrice = (price) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: APP_CONSTANTS.CURRENCY
  }).format(price)
}

// Formatear fecha
export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Validar email
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Generar slug
export const generateSlug = (text) => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

// Calcular total del carrito
export const calculateCartTotal = (items, coupon = null) => {
  const subtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0)
  
  let discount = 0
  if (coupon) {
    if (coupon.type === 'percentage') {
      discount = (subtotal * coupon.discount) / 100
    } else {
      discount = Math.min(coupon.discount, subtotal)
    }
  }
  
  const shipping = subtotal >= APP_CONSTANTS.FREE_SHIPPING_THRESHOLD ? 0 : APP_CONSTANTS.SHIPPING_COST
  const total = subtotal - discount + shipping
  
  return {
    subtotal,
    discount,
    shipping,
    total
  }
}