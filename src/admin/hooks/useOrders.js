import { useState, useEffect } from 'react';
import { adminService } from '../services/adminService';
import { useAuth } from '../../../contexts/AuthContext';

export const useOrders = () => {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({});

  const fetchOrders = async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      console.log('🔄 Fetching orders...');
      const response = await adminService.getOrders(params, token);
      console.log('📨 Orders response:', response);
      
      // Manejar diferentes estructuras de respuesta
      const ordersData = response.data || response.orders || response;
      const paginationData = response.pagination || response.meta || {};
      
      setOrders(Array.isArray(ordersData) ? ordersData : []);
      setPagination(paginationData);
      
      return response;
    } catch (err) {
      console.error('❌ Error fetching orders:', err);
      setError(err.message);
      setOrders([]);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderDetails = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminService.getOrderDetails(id, token);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (id, statusData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminService.updateOrderStatus(id, statusData, token);
      await fetchOrders(); // Refrescar la lista
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    orders,
    loading,
    error,
    pagination,
    fetchOrders,
    fetchOrderDetails,
    updateOrderStatus
  };
};