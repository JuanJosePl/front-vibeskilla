import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';

const ProtectedRoute = ({ children, requiredRole = 'admin' }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    // Redirigir al login y guardar la ubicación para volver después
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // Verificar roles
  const hasAccess = 
    requiredRole === 'admin' ? user.role === 'admin' :
    requiredRole === 'moderator' ? ['admin', 'moderator'].includes(user.role) :
    true; // Para otros roles o sin restricción

  if (!hasAccess) {
    // Si no tiene acceso, redirigir según su rol
    if (user.role === 'admin' || user.role === 'moderator') {
      return <Navigate to="/admin" replace />;
    } else {
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;