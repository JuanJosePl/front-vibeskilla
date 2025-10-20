import { useState, useEffect } from 'react';
import { adminService } from '../services/adminService';
import { useAuth } from '../../../contexts/AuthContext';

export const useCategories = () => {
  const { token } = useAuth();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('🔄 Fetching categories...');
      const response = await adminService.getCategories({}, token);
      console.log('📨 Categories response:', response);
      
      // Manejar diferentes estructuras de respuesta
      const categoriesData = response.data || response.categories || response;
      setCategories(Array.isArray(categoriesData) ? categoriesData : []);
      
      return response;
    } catch (err) {
      console.error('❌ Error fetching categories:', err);
      setError(err.message);
      setCategories([]);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createCategory = async (categoryData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminService.createCategory(categoryData, token);
      await fetchCategories(); // Refrescar la lista
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateCategory = async (id, categoryData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminService.updateCategory(id, categoryData, token);
      await fetchCategories(); // Refrescar la lista
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminService.deleteCategory(id, token);
      await fetchCategories(); // Refrescar la lista
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Cargar categorías al inicializar el hook
  useEffect(() => {
    if (token) {
      fetchCategories();
    }
  }, [token]);

  return {
    categories,
    loading,
    error,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory
  };
};