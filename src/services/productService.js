import { apiClient } from './api'
import { API_ENDPOINTS } from '../config/api'

export const productService = {
  // Obtener todos los productos
  async getProducts(filters = {}) {
    const queryParams = new URLSearchParams()
    
    // Agregar filtros a los parámetros
    Object.keys(filters).forEach(key => {
      if (filters[key] !== undefined && filters[key] !== null) {
        queryParams.append(key, filters[key])
      }
    })
    
    const queryString = queryParams.toString()
    const endpoint = queryString ? `${API_ENDPOINTS.PRODUCTS.LIST}?${queryString}` : API_ENDPOINTS.PRODUCTS.LIST
    
    const response = await apiClient.get(endpoint)
    return response
  },

  // Obtener productos destacados
  async getFeaturedProducts() {
    const response = await apiClient.get(API_ENDPOINTS.PRODUCTS.FEATURED)
    return response
  },

  // Buscar productos
  async searchProducts(query, limit = 10) {
    const response = await apiClient.get(`${API_ENDPOINTS.PRODUCTS.SEARCH}/${query}?limit=${limit}`)
    return response
  },

  // Obtener producto por slug
  async getProductBySlug(slug) {
    const response = await apiClient.get(`${API_ENDPOINTS.PRODUCTS.BY_SLUG}/${slug}`)
    return response
  },

  // Obtener reseñas de producto
  async getProductReviews(productId) {
    const response = await apiClient.get(`${API_ENDPOINTS.PRODUCTS.REVIEWS}/${productId}/reviews`)
    return response
  },

  // Crear reseña
  async createReview(productId, reviewData, token) {
    const response = await apiClient.post(
      `${API_ENDPOINTS.PRODUCTS.REVIEWS}/${productId}/reviews`, 
      reviewData, 
      token
    )
    return response
  }
}