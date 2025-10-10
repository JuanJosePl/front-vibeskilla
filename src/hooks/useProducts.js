import { useState, useEffect } from 'react'
import { productService } from '../services/productService'

export const useProducts = (filters = {}) => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [pagination, setPagination] = useState({})

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const response = await productService.getProducts(filters)
        setProducts(response.data)
        setPagination(response.pagination || {})
      } catch (err) {
        setError(err.message || 'Error al cargar productos')
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [filters])

  return {
    products,
    loading,
    error,
    pagination,
    refetch: () => {
      // Puedes implementar refetch si es necesario
    }
  }
}