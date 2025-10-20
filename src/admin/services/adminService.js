import { apiClient } from "../../services/api";
import { API_ENDPOINTS } from "../../config/api";

export const adminService = {
  // DASHBOARD
  async getDashboardStats(token) {
    return apiClient.get(API_ENDPOINTS.ADMIN.DASHBOARD.STATS, null, token);
  },

  async getSalesData(range = "monthly", token) {
    return apiClient.get(
      `${API_ENDPOINTS.ADMIN.DASHBOARD.SALES}?range=${range}`,
      null,
      token
    );
  },

  // PRODUCTS
  async getProducts(params = {}, token) {
    const query = new URLSearchParams(params).toString();
    const url = query
      ? `${API_ENDPOINTS.ADMIN.PRODUCTS}?${query}`
      : API_ENDPOINTS.ADMIN.PRODUCTS;
    return apiClient.get(url, null, token);
  },

  async createProduct(data, token) {
    return apiClient.post(API_ENDPOINTS.ADMIN.PRODUCTS, data, token);
  },

  async updateProduct(id, data, token) {
    return apiClient.put(`${API_ENDPOINTS.ADMIN.PRODUCTS}/${id}`, data, token);
  },

  async deleteProduct(id, token) {
    return apiClient.delete(
      `${API_ENDPOINTS.ADMIN.PRODUCTS}/${id}`,
      null,
      token
    );
  },

  // CATEGORIES
  async getCategories(token) {
    return apiClient.get(API_ENDPOINTS.ADMIN.CATEGORIES, null, token);
  },

  async createCategory(data, token) {
    return apiClient.post(API_ENDPOINTS.ADMIN.CATEGORIES, data, token);
  },

  async updateCategory(id, data, token) {
    return apiClient.put(
      `${API_ENDPOINTS.ADMIN.CATEGORIES}/${id}`,
      data,
      token
    );
  },

  async deleteCategory(id, token) {
    return apiClient.delete(
      `${API_ENDPOINTS.ADMIN.CATEGORIES}/${id}`,
      null,
      token
    );
  },

  // ORDERS
  async getOrders(params = {}, token) {
    const query = new URLSearchParams(params).toString();
    const url = query
      ? `${API_ENDPOINTS.ADMIN.ORDERS}?${query}`
      : API_ENDPOINTS.ADMIN.ORDERS;
    return apiClient.get(url, null, token);
  },

  async getOrderDetails(id, token) {
    return apiClient.get(`${API_ENDPOINTS.ADMIN.ORDERS}/${id}`, null, token);
  },

  async updateOrderStatus(id, data, token) {
    return apiClient.put(
      `${API_ENDPOINTS.ADMIN.ORDERS}/${id}/status`,
      data,
      token
    );
  },

  // USERS
  async getUsers(params = {}, token) {
    const query = new URLSearchParams(params).toString();
    const url = query
      ? `${API_ENDPOINTS.ADMIN.USERS}?${query}`
      : API_ENDPOINTS.ADMIN.USERS;
    return apiClient.get(url, null, token);
  },

  async updateUser(id, data, token) {
    return apiClient.put(`${API_ENDPOINTS.ADMIN.USERS}/${id}`, data, token);
  },

  async deleteUser(id, token) {
    return apiClient.delete(`${API_ENDPOINTS.ADMIN.USERS}/${id}`, null, token);
  },
};
