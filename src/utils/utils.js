import { APP_CONSTANTS } from './constants'

// Formatear precio
export const formatPrice = (price) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: APP_CONSTANTS.CURRENCY,
    minimumFractionDigits: 0
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
  const subtotal = items.reduce((total, item) => {
    const itemPrice = item.price || item.product?.price || 0
    return total + (itemPrice * item.quantity)
  }, 0)
  
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

// Función para manejar errores de API
export const handleApiError = (error) => {
  console.error('API Error:', error)
  return {
    success: false,
    message: error.message || 'Ha ocurrido un error inesperado'
  }
}

// Función para debounce
export const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}