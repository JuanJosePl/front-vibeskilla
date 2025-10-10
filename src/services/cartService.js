import { apiClient } from './api'
import { API_ENDPOINTS } from '../config/api'

export const cartService = {
  // Obtener carrito
  async getCart(token) {
    const response = await apiClient.get(API_ENDPOINTS.CART.GET, token)
    return response
  },

  // Agregar item al carrito
  async addToCart(productData, token) {
    const response = await apiClient.post(API_ENDPOINTS.CART.ADD_ITEM, productData, token)
    return response
  },

  // Actualizar cantidad en carrito
  async updateCartItem(productId, updateData, token) {
    const response = await apiClient.put(
      `${API_ENDPOINTS.CART.UPDATE_ITEM}/${productId}`,
      updateData,
      token
    )
    return response
  },

  // Eliminar item del carrito
  async removeFromCart(productId, attributes = {}, token) {
    const response = await apiClient.delete(
      `${API_ENDPOINTS.CART.REMOVE_ITEM}/${productId}`,
      token
    )
    // Nota: Para DELETE con body, necesitarías modificar el apiClient
    return response
  },

  // Limpiar carrito
  async clearCart(token) {
    const response = await apiClient.delete(API_ENDPOINTS.CART.CLEAR, token)
    return response
  },

  // Aplicar cupón
  async applyCoupon(couponCode, token) {
    const response = await apiClient.post(
      API_ENDPOINTS.CART.APPLY_COUPON,
      { code: couponCode },
      token
    )
    return response
  }
}