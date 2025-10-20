import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../hooks/useAdmin';
import { Search, Filter, Edit, Trash2, User, Mail, Phone, Shield } from 'lucide-react';

const Users = () => {
  const { getUsers, updateUser, deleteUser, loading } = useAdmin();
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({});
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    role: '',
    search: ''
  });

  useEffect(() => {
    loadUsers();
  }, [filters]);

  const loadUsers = async () => {
    try {
      const response = await getUsers(filters);
      setUsers(response.data);
      setPagination(response.pagination);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const handleRoleUpdate = async (userId, newRole) => {
    try {
      await updateUser(userId, { role: newRole });
      loadUsers();
    } catch (error) {
      console.error('Error updating user role:', error);
    }
  };

  const handleStatusUpdate = async (userId, isActive) => {
    try {
      await updateUser(userId, { isActive });
      loadUsers();
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      try {
        await deleteUser(userId);
        loadUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const getRoleColor = (role) => {
    const colors = {
      admin: 'bg-purple-100 text-purple-800',
      moderator: 'bg-blue-100 text-blue-800',
      customer: 'bg-green-100 text-green-800'
    };
    return colors[role] || 'bg-gray-100 text-gray-800';
  };

  const getRoleLabel = (role) => {
    const labels = {
      admin: 'Administrador',
      moderator: 'Moderador',
      customer: 'Cliente'
    };
    return labels[role] || role;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Usuarios</h1>
          <p className="text-muted-foreground mt-2">
            Gestiona los usuarios de tu plataforma
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-card rounded-xl border border-border p-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <input
                type="text"
                placeholder="Buscar usuarios..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value, page: 1 }))}
                className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          {/* Role Filter */}
          <div className="flex space-x-2">
            <button
              onClick={() => setFilters(prev => ({ ...prev, role: '', page: 1 }))}
              className={`px-4 py-2 rounded-lg border transition-colors ${
                filters.role === '' 
                  ? 'bg-primary text-primary-foreground border-primary' 
                  : 'bg-background border-border hover:bg-accent'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setFilters(prev => ({ ...prev, role: 'customer', page: 1 }))}
              className={`px-4 py-2 rounded-lg border transition-colors ${
                filters.role === 'customer' 
                  ? 'bg-green-100 text-green-800 border-green-200' 
                  : 'bg-background border-border hover:bg-accent'
              }`}
            >
              Clientes
            </button>
            <button
              onClick={() => setFilters(prev => ({ ...prev, role: 'admin', page: 1 }))}
              className={`px-4 py-2 rounded-lg border transition-colors ${
                filters.role === 'admin' 
                  ? 'bg-purple-100 text-purple-800 border-purple-200' 
                  : 'bg-background border-border hover:bg-accent'
              }`}
            >
              Administradores
            </button>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left py-4 px-6 font-semibold text-foreground">Usuario</th>
                    <th className="text-left py-4 px-6 font-semibold text-foreground">Contacto</th>
                    <th className="text-left py-4 px-6 font-semibold text-foreground">Rol</th>
                    <th className="text-left py-4 px-6 font-semibold text-foreground">Estado</th>
                    <th className="text-left py-4 px-6 font-semibold text-foreground">Último Acceso</th>
                    <th className="text-left py-4 px-6 font-semibold text-foreground">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id} className="border-b border-border hover:bg-muted/30 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-primary-foreground" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">
                              {user.profile.firstName} {user.profile.lastName}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              ID: {user._id.slice(-8)}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-foreground">{user.email}</span>
                          </div>
                          {user.profile.phone && (
                            <div className="flex items-center space-x-2">
                              <Phone className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm text-foreground">{user.profile.phone}</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <select
                          value={user.role}
                          onChange={(e) => handleRoleUpdate(user._id, e.target.value)}
                          className={`text-xs font-medium px-2 py-1 rounded border-0 focus:ring-1 focus:ring-primary ${getRoleColor(user.role)}`}
                        >
                          <option value="customer">Cliente</option>
                          <option value="moderator">Moderador</option>
                          <option value="admin">Administrador</option>
                        </select>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleStatusUpdate(user._id, !user.isActive)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              user.isActive ? 'bg-green-500' : 'bg-gray-300'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                user.isActive ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                          <span className="text-sm text-muted-foreground">
                            {user.isActive ? 'Activo' : 'Inactivo'}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <p className="text-sm text-foreground">
                          {user.lastLogin 
                            ? new Date(user.lastLogin).toLocaleDateString()
                            : 'Nunca'
                          }
                        </p>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleDelete(user._id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Eliminar usuario"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Empty State */}
            {users.length === 0 && (
              <div className="text-center py-12">
                <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No hay usuarios</h3>
                <p className="text-muted-foreground">
                  {filters.search || filters.role 
                    ? 'No se encontraron usuarios con los filtros aplicados.' 
                    : 'Aún no hay usuarios registrados.'}
                </p>
              </div>
            )}

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="px-6 py-4 border-t border-border flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Mostrando {users.length} de {pagination.total} usuarios
                </p>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setFilters(prev => ({ ...prev, page: prev.page - 1 }))}
                    disabled={filters.page === 1}
                    className="px-3 py-1 border border-border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent transition-colors"
                  >
                    Anterior
                  </button>
                  <span className="px-3 py-1 text-sm text-muted-foreground">
                    Página {filters.page} de {pagination.pages}
                  </span>
                  <button
                    onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}
                    disabled={filters.page === pagination.pages}
                    className="px-3 py-1 border border-border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent transition-colors"
                  >
                    Siguiente
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Users;