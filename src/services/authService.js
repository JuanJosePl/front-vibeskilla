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

  // Obtener perfil del usuario
  async getProfile(token) {
    const response = await apiClient.get(API_ENDPOINTS.AUTH.PROFILE, token)
    return response
  },

  // Actualizar perfil
  async updateProfile(userData, token) {
    const response = await apiClient.put(API_ENDPOINTS.AUTH.UPDATE_PROFILE, userData, token)
    return response
  }
}