import React, { createContext, useContext, useState, useEffect } from 'react'
import { authService } from '../services/authService'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('killavibes-token'))
  const [loading, setLoading] = useState(true)

  // Cargar usuario al iniciar
  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          const response = await authService.getProfile(token)
          if (response.success) {
            setUser(response.data.user)
          } else {
            logout()
          }
        } catch (error) {
          console.error('Error loading user:', error)
          logout()
        }
      }
      setLoading(false)
    }

    loadUser()
  }, [token])

  // Login function
  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials)
      const { token: newToken, user: userData } = response.data
      
      setToken(newToken)
      setUser(userData)
      localStorage.setItem('killavibes-token', newToken)
      
      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        error: error.message || 'Error al iniciar sesión' 
      }
    }
  }

  // Register function
  const register = async (userData) => {
    try {
      const response = await authService.register(userData)
      const { token: newToken, user: newUser } = response.data
      
      setToken(newToken)
      setUser(newUser)
      localStorage.setItem('killavibes-token', newToken)
      
      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        error: error.message || 'Error al registrar usuario' 
      }
    }
  }

  // Logout function
  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('killavibes-token')
  }

  // Update profile
  const updateProfile = async (profileData) => {
    try {
      const response = await authService.updateProfile(profileData, token)
      if (response.success) {
        setUser(response.data.user)
        return { success: true }
      }
      return { success: false, error: 'Error al actualizar perfil' }
    } catch (error) {
      return { 
        success: false, 
        error: error.message || 'Error al actualizar perfil' 
      }
    }
  }

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!user && !!token
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}