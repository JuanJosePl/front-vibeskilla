import { useState, useCallback } from 'react'

export const useApi = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const callApi = useCallback(async (apiCall, onSuccess, onError) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await apiCall()
      
      if (onSuccess) {
        onSuccess(response.data)
      }
      
      return response
    } catch (err) {
      const errorMessage = err.message || 'Ha ocurrido un error'
      setError(errorMessage)
      
      if (onError) {
        onError(errorMessage)
      }
      
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }, [])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    loading,
    error,
    callApi,
    clearError
  }
}