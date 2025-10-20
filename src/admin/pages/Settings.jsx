import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../../components/theme-provider';
import { Sun, Moon, Monitor, Save, User, Shield, Bell, Globe } from 'lucide-react';

const Settings = () => {
  const { user, updateProfile } = useAuth();
  const { theme, setTheme } = useTheme();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Configuración</h1>
          <p className="text-muted-foreground mt-2">
            Personaliza tu panel de administración
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Settings */}
          <div className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-center space-x-3 mb-6">
              <User className="h-6 w-6 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">Perfil</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Nombre
                </label>
                <input
                  type="text"
                  defaultValue={user?.profile?.firstName}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Apellido
                </label>
                <input
                  type="text"
                  defaultValue={user?.profile?.lastName}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Email
                </label>
                <input
                  type="email"
                  defaultValue={user?.email}
                  disabled
                  className="w-full px-3 py-2 border border-border rounded-lg bg-muted cursor-not-allowed"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  El email no se puede modificar
                </p>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Teléfono
                </label>
                <input
                  type="tel"
                  defaultValue={user?.profile?.phone}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex justify-end mt-6">
              <button className="btn-primary flex items-center space-x-2">
                <Save className="h-4 w-4" />
                <span>Guardar Cambios</span>
              </button>
            </div>
          </div>

          {/* Preferences */}
          <div className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Bell className="h-6 w-6 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">Preferencias</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Notificaciones por Email</p>
                  <p className="text-sm text-muted-foreground">
                    Recibe notificaciones importantes por email
                  </p>
                </div>
                <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-green-500">
                  <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6" />
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Reportes Semanales</p>
                  <p className="text-sm text-muted-foreground">
                    Recibe reportes de ventas semanales
                  </p>
                </div>
                <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-300">
                  <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-1" />
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Alertas de Stock</p>
                  <p className="text-sm text-muted-foreground">
                    Notificaciones cuando el stock sea bajo
                  </p>
                </div>
                <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-green-500">
                  <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Theme Settings */}
          <div className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Globe className="h-6 w-6 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">Tema</h3>
            </div>
            
            <div className="space-y-3">
              <button
                onClick={() => setTheme('light')}
                className={`w-full flex items-center space-x-3 p-3 rounded-lg border transition-colors ${
                  theme === 'light' 
                    ? 'bg-primary text-primary-foreground border-primary' 
                    : 'bg-background border-border hover:bg-accent'
                }`}
              >
                <Sun className="h-5 w-5" />
                <span>Claro</span>
              </button>
              
              <button
                onClick={() => setTheme('dark')}
                className={`w-full flex items-center space-x-3 p-3 rounded-lg border transition-colors ${
                  theme === 'dark' 
                    ? 'bg-primary text-primary-foreground border-primary' 
                    : 'bg-background border-border hover:bg-accent'
                }`}
              >
                <Moon className="h-5 w-5" />
                <span>Oscuro</span>
              </button>
              
              <button
                onClick={() => setTheme('system')}
                className={`w-full flex items-center space-x-3 p-3 rounded-lg border transition-colors ${
                  theme === 'system' 
                    ? 'bg-primary text-primary-foreground border-primary' 
                    : 'bg-background border-border hover:bg-accent'
                }`}
              >
                <Monitor className="h-5 w-5" />
                <span>Sistema</span>
              </button>
            </div>
          </div>

          {/* Account Info */}
          <div className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Shield className="h-6 w-6 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">Cuenta</h3>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Rol:</span>
                <span className="text-sm font-medium text-foreground capitalize">
                  {user?.role}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Estado:</span>
                <span className={`text-sm font-medium ${
                  user?.isActive ? 'text-green-600' : 'text-red-600'
                }`}>
                  {user?.isActive ? 'Activo' : 'Inactivo'}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Miembro desde:</span>
                <span className="text-sm font-medium text-foreground">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Último acceso:</span>
                <span className="text-sm font-medium text-foreground">
                  {user?.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Nunca'}
                </span>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-card rounded-xl border border-red-200 p-6">
            <h3 className="text-lg font-semibold text-red-800 mb-4">Zona de Peligro</h3>
            
            <div className="space-y-3">
              <button className="w-full btn-outline border-red-600 text-red-600 hover:bg-red-600 hover:text-white">
                Cambiar Contraseña
              </button>
              
              <button className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors">
                Cerrar Sesión en Todos los Dispositivos
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;