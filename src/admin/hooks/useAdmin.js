import { useState, useEffect } from "react";
import { adminService } from "../services/adminService";
import { useAuth } from "../../contexts/AuthContext";

export const useAdmin = () => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleRequest = async (requestFn, ...args) => {
    setLoading(true);
    setError(null);
    try {
      const response = await requestFn(...args, token);
      return response;
    } catch (err) {
      // Manejar errores específicos de validación
      if (err.response?.data?.errors) {
        const errorMessage = err.response.data.errors.join(", ");
        setError(errorMessage);
        throw new Error(errorMessage);
      }
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    handleRequest,
    getDashboardStats: () => handleRequest(adminService.getDashboardStats),
    getSalesData: (range) => handleRequest(adminService.getSalesData, range),
    getProducts: (params) => handleRequest(adminService.getProducts, params),
    createProduct: (data) => handleRequest(adminService.createProduct, data),
    updateProduct: (id, data) =>
      handleRequest(adminService.updateProduct, id, data),
    deleteProduct: (id) => handleRequest(adminService.deleteProduct, id),
    getCategories: () => handleRequest(adminService.getCategories),
    createCategory: (data) => handleRequest(adminService.createCategory, data),
    updateCategory: (id, data) =>
      handleRequest(adminService.updateCategory, id, data),
    deleteCategory: (id) => handleRequest(adminService.deleteCategory, id),
    getOrders: (params) => handleRequest(adminService.getOrders, params),
    updateOrderStatus: (id, data) =>
      handleRequest(adminService.updateOrderStatus, id, data),
    getOrderDetails: (id) => handleRequest(adminService.getOrderDetails, id),
    getUsers: (params) => handleRequest(adminService.getUsers, params),
    updateUser: (id, data) => handleRequest(adminService.updateUser, id, data),
    deleteUser: (id) => handleRequest(adminService.deleteUser, id),
  };
};
