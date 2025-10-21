// Configuración base de la API
export const API_CONFIG = {
  BASE_URL: 'https://backend-vibeskilla.onrender.com/api',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3
};

// Headers comunes
export const getHeaders = (token = null) => {
  const headers = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

// Endpoints de la API
export const API_ENDPOINTS = {
  //Categorias
   CATEGORIES: {
    BASE: '/categories',
    WITH_COUNT: '/categories/with-count',
    POPULAR: '/categories/popular',
    HIERARCHICAL: '/categories/hierarchical'
  },
  // Auth
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    PROFILE: '/auth/profile',
    UPDATE_PROFILE: '/auth/profile'
  },

  // Products públicos
  PRODUCTS: {
    LIST: '/products',
    FEATURED: '/products/featured',
    SEARCH: '/products/search',
    BY_SLUG: '/products',
    REVIEWS: '/products'
  },

  // Admin
  ADMIN: {
    DASHBOARD: {
      STATS: '/admin/dashboard/stats',
      SALES: '/admin/dashboard/sales'
    },
    PRODUCTS: '/admin/products',
    CATEGORIES: '/admin/categories',
    ORDERS: '/admin/orders',
    USERS: '/admin/users'
  },


  // Cart
  CART: {
    GET: '/cart',
    ADD_ITEM: '/cart/items',
    UPDATE_ITEM: '/cart/items',
    REMOVE_ITEM: '/cart/items',
    CLEAR: '/cart',
    APPLY_COUPON: '/cart/coupon'
  },

  // Orders
  ORDERS: {
    CREATE: '/orders',
    LIST: '/orders',
    BY_ID: '/orders',
    CANCEL: '/orders'
  },

  // Payments
  PAYMENTS: {
    PROCESS: '/payments/process'
  }
};
