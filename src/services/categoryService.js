// services/categoryService.js
import { apiClient } from './api';

export const categoryService = {
  /**
   * Obtener todas las categorías activas
   * @returns {Promise} Promise con las categorías
   */
  async getCategories() {
    try {
      const response = await Client.get('/categories');
      return response;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  /**
   * Obtener categorías con conteo de productos
   * @returns {Promise} Promise con categorías y conteo de productos
   */
  async getCategoriesWithCount() {
    try {
      // Primero obtenemos las categorías
      const categoriesResponse = await this.getCategories();
      
      if (!categoriesResponse.success) {
        return categoriesResponse;
      }

      // Para cada categoría, obtenemos el conteo de productos
      const categoriesWithCount = await Promise.all(
        categoriesResponse.data.map(async (category) => {
          try {
            const productsResponse = await Client.get(`/categories/${category._id}/products?limit=1`);
            const productCount = productsResponse.success ? productsResponse.total || productsResponse.data.length : 0;
            
            return {
              ...category,
              productCount
            };
          } catch (error) {
            console.error(`Error getting product count for category ${category._id}:`, error);
            return {
              ...category,
              productCount: 0
            };
          }
        })
      );

      return {
        success: true,
        data: categoriesWithCount
      };
    } catch (error) {
      console.error('Error fetching categories with count:', error);
      throw error;
    }
  },

  /**
   * Obtener categoría por slug
   * @param {string} slug - Slug de la categoría
   * @returns {Promise} Promise con la categoría
   */
  async getCategoryBySlug(slug) {
    try {
      const response = await Client.get(`/categories/${slug}`);
      return response;
    } catch (error) {
      console.error('Error fetching category by slug:', error);
      throw error;
    }
  },

  /**
   * Obtener categoría por ID
   * @param {string} id - ID de la categoría
   * @returns {Promise} Promise con la categoría
   */
  async getCategoryById(id) {
    try {
      // Primero intentamos obtener todas las categorías y filtrar por ID
      const categoriesResponse = await this.getCategories();
      
      if (!categoriesResponse.success) {
        return categoriesResponse;
      }

      const category = categoriesResponse.data.find(cat => cat._id === id);
      
      if (!category) {
        return {
          success: false,
          message: 'Categoría no encontrada'
        };
      }

      return {
        success: true,
        data: category
      };
    } catch (error) {
      console.error('Error fetching category by ID:', error);
      throw error;
    }
  },

  /**
   * Obtener productos por categoría
   * @param {string} categoryId - ID de la categoría
   * @param {Object} filters - Filtros adicionales
   * @param {number} filters.page - Página actual
   * @param {number} filters.limit - Límite de productos por página
   * @param {string} filters.sort - Campo para ordenar
   * @returns {Promise} Promise con los productos de la categoría
   */
  async getProductsByCategory(categoryId, filters = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      // Agregar filtros a los parámetros de consulta
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value);
        }
      });

      const url = `/categories/${categoryId}/products?${queryParams.toString()}`;
      const response = await Client.get(url);
      return response;
    } catch (error) {
      console.error('Error fetching products by category:', error);
      throw error;
    }
  },

  /**
   * Obtener productos por slug de categoría
   * @param {string} slug - Slug de la categoría
   * @param {Object} filters - Filtros adicionales
   * @returns {Promise} Promise con los productos de la categoría
   */
  async getProductsByCategorySlug(slug, filters = {}) {
    try {
      // Primero obtenemos la categoría por slug
      const categoryResponse = await this.getCategoryBySlug(slug);
      
      if (!categoryResponse.success) {
        return categoryResponse;
      }

      // Luego obtenemos los productos usando el ID de la categoría
      return await this.getProductsByCategory(categoryResponse.data._id, filters);
    } catch (error) {
      console.error('Error fetching products by category slug:', error);
      throw error;
    }
  },

  /**
   * Crear nueva categoría (Solo admin)
   * @param {Object} categoryData - Datos de la categoría
   * @param {string} token - Token de autenticación
   * @returns {Promise} Promise con la categoría creada
   */
  async createCategory(categoryData, token) {
    try {
      const response = await Client.post('/categories', categoryData, token);
      return response;
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  },

  /**
   * Actualizar categoría (Solo admin)
   * @param {string} id - ID de la categoría
   * @param {Object} categoryData - Datos actualizados de la categoría
   * @param {string} token - Token de autenticación
   * @returns {Promise} Promise con la categoría actualizada
   */
  async updateCategory(id, categoryData, token) {
    try {
      const response = await Client.put(`//categories/${id}`, categoryData, token);
      return response;
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  },

  /**
   * Eliminar categoría (Solo admin)
   * @param {string} id - ID de la categoría
   * @param {string} token - Token de autenticación
   * @returns {Promise} Promise con el resultado de la eliminación
   */
  async deleteCategory(id, token) {
    try {
      const response = await Client.delete(`/categories/${id}`, null, token);
      return response;
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  },

  /**
   * Obtener categorías jerárquicas (padres e hijos)
   * @returns {Promise} Promise con categorías organizadas jerárquicamente
   */
  async getHierarchicalCategories() {
    try {
      const response = await this.getCategories();
      
      if (!response.success) {
        return response;
      }

      const categories = response.data;
      
      // Separar categorías padre e hijas
      const parentCategories = categories.filter(cat => !cat.parentCategory);
      const childCategories = categories.filter(cat => cat.parentCategory);

      // Organizar jerárquicamente
      const hierarchicalCategories = parentCategories.map(parent => ({
        ...parent,
        children: childCategories.filter(child => 
          child.parentCategory._id === parent._id
        )
      }));

      return {
        success: true,
        data: hierarchicalCategories
      };
    } catch (error) {
      console.error('Error fetching hierarchical categories:', error);
      throw error;
    }
  },

  /**
   * Buscar categorías por término
   * @param {string} searchTerm - Término de búsqueda
   * @returns {Promise} Promise con categorías que coinciden con la búsqueda
   */
  async searchCategories(searchTerm) {
    try {
      const response = await this.getCategories();
      
      if (!response.success) {
        return response;
      }

      const filteredCategories = response.data.filter(category =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );

      return {
        success: true,
        data: filteredCategories
      };
    } catch (error) {
      console.error('Error searching categories:', error);
      throw error;
    }
  },

  /**
   * Obtener categorías populares (con más productos)
   * @param {number} limit - Límite de categorías a retornar
   * @returns {Promise} Promise con categorías populares
   */
  async getPopularCategories(limit = 6) {
    try {
      const categoriesWithCount = await this.getCategoriesWithCount();
      
      if (!categoriesWithCount.success) {
        return categoriesWithCount;
      }

      // Ordenar por cantidad de productos (descendente) y limitar
      const popularCategories = categoriesWithCount.data
        .sort((a, b) => b.productCount - a.productCount)
        .slice(0, limit);

      return {
        success: true,
        data: popularCategories
      };
    } catch (error) {
      console.error('Error fetching popular categories:', error);
      throw error;
    }
  }
};

export default categoryService;