import { apiClient } from './api'
import { API_ENDPOINTS } from '../config/api'

export const authService = {
  // Registrar nuevo usuario
  async register(userData) {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.REGISTER, userData)
    return response
  },

  // Iniciar sesión
  async login(credentials) {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, credentials)
    return response
  },

  // Obtener perfil del usuario - CORREGIDO
  async getProfile(token) {
    const response = await apiClient.get(API_ENDPOINTS.AUTH.PROFILE, null, token) // Cambio aquí
    return response
  },

  // Actualizar perfil - CORREGIDO
  async updateProfile(userData, token) {
    const response = await apiClient.put(API_ENDPOINTS.AUTH.UPDATE_PROFILE, userData, token) // Ya está correcto
    return response
  }
}