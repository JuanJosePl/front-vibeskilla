import { useState, useEffect } from 'react';
import { adminService } from '../services/adminService';
import { useAuth } from '../../../contexts/AuthContext';

export const useUsers = () => {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({});

  const fetchUsers = async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      console.log('🔄 Fetching users...');
      const response = await adminService.getUsers(params, token);
      console.log('📨 Users response:', response);
      
      // Manejar diferentes estructuras de respuesta
      const usersData = response.data || response.users || response;
      const paginationData = response.pagination || response.meta || {};
      
      setUsers(Array.isArray(usersData) ? usersData : []);
      setPagination(paginationData);
      
      return response;
    } catch (err) {
      console.error('❌ Error fetching users:', err);
      setError(err.message);
      setUsers([]);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (id, userData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminService.updateUser(id, userData, token);
      await fetchUsers(); // Refrescar la lista
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminService.deleteUser(id, token);
      await fetchUsers(); // Refrescar la lista
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Cargar usuarios al inicializar el hook
  useEffect(() => {
    if (token) {
      fetchUsers();
    }
  }, [token]);

  return {
    users,
    loading,
    error,
    pagination,
    fetchUsers,
    updateUser,
    deleteUser
  };
};