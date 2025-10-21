import { apiClient } from "./api";
import { API_ENDPOINTS } from "../config/api";

export const productService = {
  // Obtener todos los productos
  async getProducts(filters = {}) {
    const queryParams = new URLSearchParams();

    // Agregar filtros a los parámetros
    Object.keys(filters).forEach((key) => {
      if (filters[key] !== undefined && filters[key] !== null) {
        queryParams.append(key, filters[key]);
      }
    });

    const queryString = queryParams.toString();
    const endpoint = queryString
      ? `${API_ENDPOINTS.PRODUCTS.LIST}?${queryString}`
      : API_ENDPOINTS.PRODUCTS.LIST;

    const response = await apiClient.get(endpoint);
    return response;
  },

  // Obtener productos destacados
  async getFeaturedProducts() {
    const response = await apiClient.get(API_ENDPOINTS.PRODUCTS.FEATURED);
    return response;
  },

  // Buscar productos
  async searchProducts(query, limit = 10) {
    const response = await apiClient.get(
      `${API_ENDPOINTS.PRODUCTS.SEARCH}/${query}?limit=${limit}`
    );
    return response;
  },

  // Obtener producto por slug
  async getProductBySlug(slug) {
    const response = await apiClient.get(
      `${API_ENDPOINTS.PRODUCTS.BY_SLUG}/${slug}`
    );
    return response;
  },

  // Obtener reseñas de producto
  async getProductReviews(productId) {
    const response = await apiClient.get(
      `${API_ENDPOINTS.PRODUCTS.REVIEWS}/${productId}/reviews`
    );
    return response;
  },

  // Crear reseña
  async createReview(productId, reviewData, token) {
    const response = await apiClient.post(
      `${API_ENDPOINTS.PRODUCTS.REVIEWS}/${productId}/reviews`,
      reviewData,
      token
    );
    return response;
  },

  /**
   * Obtener productos relacionados
   * @param {string} productId - ID del producto actual
   * @param {string} categoryId - ID de la categoría
   * @param {number} limit - Límite de productos
   * @returns {Promise} Promise con productos relacionados
   */
  async getRelatedProducts(productId, categoryId, limit = 4) {
    try {
      const response = await apiClient.get(
        `/api/products/related/${productId}?category=${categoryId}&limit=${limit}`
      );
      return response;
    } catch (error) {
      console.error("Error fetching related products:", error);

      // Fallback: obtener productos de la misma categoría excluyendo el actual
      try {
        const categoryProducts = await this.getProductsByCategory(categoryId, {
          limit,
        });
        const filteredProducts =
          categoryProducts.data?.filter(
            (product) => product._id !== productId
          ) || [];

        return {
          success: true,
          data: filteredProducts.slice(0, limit),
        };
      } catch (fallbackError) {
        // Último fallback: productos destacados
        const featuredResponse = await this.getFeaturedProducts();
        return {
          success: true,
          data: featuredResponse.data?.slice(0, limit) || [],
        };
      }
    }
  },
};
