import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAdmin } from '../../hooks/useAdmin';
import { ArrowLeft, Save, User, Mail, Phone, Shield, AlertCircle } from 'lucide-react';

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getUsers, updateUser, loading } = useAdmin();
  const [formData, setFormData] = useState({
    profile: {
      firstName: '',
      lastName: '',
      phone: ''
    },
    email: '',
    role: 'customer',
    isActive: true
  });
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadUser();
  }, [id]);

  const loadUser = async () => {
    try {
      const response = await getUsers();
      const userData = response.data.find(u => u._id === id);
      if (userData) {
        setUser(userData);
        setFormData({
          profile: {
            firstName: userData.profile?.firstName || '',
            lastName: userData.profile?.lastName || '',
            phone: userData.profile?.phone || ''
          },
          email: userData.email || '',
          role: userData.role || 'customer',
          isActive: userData.isActive !== false
        });
      }
    } catch (error) {
      console.error('Error loading user:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateUser(id, formData);
      navigate('/admin/users');
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('profile.')) {
      const profileField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        profile: {
          ...prev.profile,
          [profileField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const getRoleColor = (role) => {
    const colors = {
      admin: 'bg-purple-100 text-purple-800 border-purple-200',
      moderator: 'bg-blue-100 text-blue-800 border-blue-200',
      customer: 'bg-green-100 text-green-800 border-green-200'
    };
    return colors[role] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getRoleLabel = (role) => {
    const labels = {
      admin: 'Administrador',
      moderator: 'Moderador',
      customer: 'Cliente'
    };
    return labels[role] || role;
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/admin/users')}
          className="p-2 hover:bg-accent rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Editar Usuario</h1>
          <p className="text-muted-foreground mt-2">
            Actualiza la información del usuario
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Information */}
            <div className="bg-card rounded-xl border border-border p-6">
              <div className="flex items-center space-x-3 mb-6">
                <User className="h-6 w-6 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">Información del Perfil</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Nombre *
                  </label>
                  <input
                    type="text"
                    name="profile.firstName"
                    value={formData.profile.firstName}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Ingresa el nombre"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Apellido *
                  </label>
                  <input
                    type="text"
                    name="profile.lastName"
                    value={formData.profile.lastName}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Ingresa el apellido"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Email *
                  </label>
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <input
                      type="email"
                      value={formData.email}
                      disabled
                      className="flex-1 px-3 py-2 border border-border rounded-lg bg-muted cursor-not-allowed"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    El email no se puede modificar
                  </p>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Teléfono
                  </label>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <input
                      type="tel"
                      name="profile.phone"
                      value={formData.profile.phone}
                      onChange={handleChange}
                      className="flex-1 px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* User Statistics */}
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Estadísticas del Usuario</h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <p className="text-2xl font-bold text-foreground">0</p>
                  <p className="text-sm text-muted-foreground">Órdenes</p>
                </div>
                
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <p className="text-2xl font-bold text-foreground">$0</p>
                  <p className="text-sm text-muted-foreground">Total Gastado</p>
                </div>
                
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <p className="text-2xl font-bold text-foreground">0</p>
                  <p className="text-sm text-muted-foreground">Reviews</p>
                </div>
                
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <p className="text-2xl font-bold text-foreground">
                    {user.lastLogin ? 'Activo' : 'Inactivo'}
                  </p>
                  <p className="text-sm text-muted-foreground">Estado</p>
                </div>
              </div>
              
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Miembro desde:</span>
                  <span className="text-foreground">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Último acceso:</span>
                  <span className="text-foreground">
                    {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Nunca'}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email verificado:</span>
                  <span className={`font-medium ${
                    user.emailVerified ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {user.emailVerified ? 'Sí' : 'No'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Account Settings */}
            <div className="bg-card rounded-xl border border-border p-6">
              <div className="flex items-center space-x-3 mb-6">
                <Shield className="h-6 w-6 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">Configuración de Cuenta</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Rol del Usuario
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="customer">Cliente</option>
                    <option value="moderator">Moderador</option>
                    <option value="admin">Administrador</option>
                  </select>
                  <p className="text-xs text-muted-foreground mt-1">
                    Los administradores tienen acceso completo al panel
                  </p>
                </div>

                <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">Cuenta Activa</p>
                    <p className="text-sm text-muted-foreground">
                      {formData.isActive ? 'El usuario puede acceder' : 'Cuenta desactivada'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, isActive: !prev.isActive }))}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      formData.isActive ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        formData.isActive ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className={`p-3 rounded-lg border ${
                  formData.role === 'admin' 
                    ? 'bg-purple-50 border-purple-200' 
                    : 'bg-blue-50 border-blue-200'
                }`}>
                  <div className="flex items-start space-x-2">
                    <Shield className={`h-4 w-4 mt-0.5 ${
                      formData.role === 'admin' ? 'text-purple-600' : 'text-blue-600'
                    }`} />
                    <div>
                      <p className={`text-sm font-medium ${
                        formData.role === 'admin' ? 'text-purple-800' : 'text-blue-800'
                      }`}>
                        Rol actual: {getRoleLabel(formData.role)}
                      </p>
                      <p className={`text-xs ${
                        formData.role === 'admin' ? 'text-purple-600' : 'text-blue-600'
                      }`}>
                        {formData.role === 'admin' 
                          ? 'Acceso completo al sistema' 
                          : formData.role === 'moderator'
                          ? 'Puede gestionar productos y órdenes'
                          : 'Acceso limitado a funciones básicas'
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-card rounded-xl border border-red-200 p-6">
              <div className="flex items-center space-x-2 mb-4">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <h3 className="text-lg font-semibold text-red-800">Zona de Peligro</h3>
              </div>
              
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('¿Estás seguro de que quieres restablecer la contraseña de este usuario? Se enviará un email con instrucciones.')) {
                      // Implementar lógica de restablecimiento de contraseña
                      console.log('Restablecer contraseña para:', user.email);
                    }
                  }}
                  className="w-full btn-outline border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white"
                >
                  Restablecer Contraseña
                </button>
                
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('¿Forzar cierre de sesión en todos los dispositivos?')) {
                      // Implementar lógica de cierre de sesión forzado
                      console.log('Forzar cierre de sesión para:', user.email);
                    }
                  }}
                  className="w-full btn-outline border-yellow-600 text-yellow-600 hover:bg-yellow-600 hover:text-white"
                >
                  Cerrar Sesión en Todos los Dispositivos
                </button>
                
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm(`¿ESTÁS SEGURO? Esta acción eliminará permanentemente al usuario ${user.profile.firstName} ${user.profile.lastName} y todos sus datos. Esta acción no se puede deshacer.`)) {
                      // Implementar lógica de eliminación
                      console.log('Eliminar usuario:', user._id);
                    }
                  }}
                  className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Eliminar Usuario Permanentemente
                </button>
              </div>
            </div>

            {/* Actions Card */}
            <div className="bg-card rounded-xl border border-border p-6">
              <div className="space-y-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary flex items-center justify-center space-x-2"
                >
                  <Save className="h-4 w-4" />
                  <span>{loading ? 'Guardando...' : 'Guardar Cambios'}</span>
                </button>
                
                <button
                  type="button"
                  onClick={() => navigate('/admin/users')}
                  className="w-full btn-outline"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>

      {/* Current User Info */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Información Actual del Usuario</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-3 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">ID de Usuario</p>
            <p className="font-mono text-sm text-foreground">{user._id}</p>
          </div>
          
          <div className="p-3 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">Rol Actual</p>
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
              {getRoleLabel(user.role)}
            </span>
          </div>
          
          <div className="p-3 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">Estado Actual</p>
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {user.isActive ? 'Activo' : 'Inactivo'}
            </span>
          </div>
          
          <div className="p-3 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">Email Verificado</p>
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              user.emailVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
            }`}>
              {user.emailVerified ? 'Verificado' : 'Pendiente'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditUser;