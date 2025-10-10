import { apiClient } from "./api";
import { API_ENDPOINTS } from "../config/api";

export const orderService = {
  // Crear orden
  async createOrder(orderData, token) {
    const response = await apiClient.post(
      API_ENDPOINTS.ORDERS.CREATE,
      orderData,
      token
    );
    return response;
  },

  // Obtener órdenes del usuario
  async getUserOrders(token, filters = {}) {
    const queryParams = new URLSearchParams();

    Object.keys(filters).forEach((key) => {
      if (filters[key] !== undefined && filters[key] !== null) {
        queryParams.append(key, filters[key]);
      }
    });

    const queryString = queryParams.toString();
    const endpoint = queryString
      ? `${API_ENDPOINTS.ORDERS.LIST}?${queryString}`
      : API_ENDPOINTS.ORDERS.LIST;

    const response = await apiClient.get(endpoint, token);
    return response;
  },

  // Obtener orden específica
  async getOrderById(orderId, token) {
    const response = await apiClient.get(
      `${API_ENDPOINTS.ORDERS.BY_ID}/${orderId}`,
      token
    );
    return response;
  },

  // En services/orderService.js, agrega esta función:
  async getUserOrders(token, filters = {}) {
    const queryParams = new URLSearchParams();

    Object.keys(filters).forEach((key) => {
      if (filters[key] !== undefined && filters[key] !== null) {
        queryParams.append(key, filters[key]);
      }
    });

    const queryString = queryParams.toString();
    const endpoint = queryString
      ? `${API_ENDPOINTS.ORDERS.LIST}?${queryString}`
      : API_ENDPOINTS.ORDERS.LIST;

    const response = await apiClient.get(endpoint, token);
    return response;
  },

  // Cancelar orden
  async cancelOrder(orderId, token) {
    const response = await apiClient.put(
      `${API_ENDPOINTS.ORDERS.CANCEL}/${orderId}/cancel`,
      {},
      token
    );
    return response;
  },
};
