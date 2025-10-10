// Constantes de la aplicación
export const APP_CONSTANTS = {
  SITE_NAME: 'KillaVibes',
  SITE_DESCRIPTION: 'Tecnología que vibra contigo',
  CURRENCY: 'COP',
  CURRENCY_SYMBOL: '$',
  SHIPPING_COST: 15000,
  FREE_SHIPPING_THRESHOLD: 100000
}

// Estados de orden
export const ORDER_STATUS = {
  PENDING: { label: 'Pendiente', color: 'bg-yellow-500' },
  CONFIRMED: { label: 'Confirmada', color: 'bg-blue-500' },
  PROCESSING: { label: 'En proceso', color: 'bg-purple-500' },
  SHIPPED: { label: 'Enviada', color: 'bg-indigo-500' },
  DELIVERED: { label: 'Entregada', color: 'bg-green-500' },
  CANCELLED: { label: 'Cancelada', color: 'bg-red-500' }
}

// Roles de usuario
export const USER_ROLES = {
  CUSTOMER: 'customer',
  ADMIN: 'admin',
  MODERATOR: 'moderator'
}

// Categorías por defecto
export const DEFAULT_CATEGORIES = [
  { id: 'electronics', name: 'Electrónicos', icon: '📱' },
  { id: 'audio', name: 'Audio', icon: '🎧' },
  { id: 'gaming', name: 'Gaming', icon: '🎮' },
  { id: 'smart-home', name: 'Hogar Inteligente', icon: '🏠' },
  { id: 'accessories', name: 'Accesorios', icon: '⌚' }
]