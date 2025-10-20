import React, { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services/authService";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("killavibes-token"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          console.log("🔄 Cargando usuario con token...", token.substring(0, 20) + "...");
          const response = await authService.getProfile(token);
          console.log("📨 Respuesta completa de getProfile:", response);

          if (response.success) {
            // Manejar diferentes estructuras de respuesta
            let userData;
            
            if (response.data && response.data.user) {
              userData = response.data.user;
            } else if (response.user) {
              userData = response.user;
            } else if (response.data) {
              userData = response.data; // En caso de que user venga directamente en data
            }

            if (userData) {
              setUser(userData);
              console.log("✅ Usuario cargado desde token:", userData);
            } else {
              console.error("❌ No se pudo extraer usuario de la respuesta:", response);
              logout();
            }
          } else {
            console.error("❌ Error en respuesta de getProfile:", response);
            logout();
          }
        } catch (error) {
          console.error("❌ Error loading user:", error);
          logout();
        }
      } else {
        console.log("🔐 No hay token, skipping loadUser");
      }
      setLoading(false);
    };
    loadUser();
  }, [token]);

  const login = async (credentials) => {
    try {
      console.log("🔐 Iniciando proceso de login...");
      const response = await authService.login(credentials);

      console.log("📨 Respuesta completa del login:", response);

      if (response.success && response.token && response.user) {
        const { token: newToken, user: userData } = response;

        console.log("✅ Login exitoso, usuario:", userData);
        console.log("🔑 Token recibido:", newToken.substring(0, 20) + "...");
        console.log("🎯 Rol del usuario:", userData.role);

        // Actualizar ambos estados
        setToken(newToken);
        setUser(userData);
        localStorage.setItem("killavibes-token", newToken);

        console.log("🔄 Estado actualizado en AuthContext");

        return { success: true, user: userData };
      } else {
        console.error("❌ Respuesta del servidor inválida:", response);
        return {
          success: false,
          error: "Respuesta del servidor inválida",
        };
      }
    } catch (error) {
      console.error("❌ Error en login:", error);
      return {
        success: false,
        error: error.message || "Error al iniciar sesión",
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await authService.register(userData);

      if (response.success && response.token && response.user) {
        const { token: newToken, user: newUser } = response;

        setToken(newToken);
        setUser(newUser);
        localStorage.setItem("killavibes-token", newToken);

        return { success: true, user: newUser };
      } else {
        return {
          success: false,
          error: response.message || "Error al registrar usuario",
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error.message || "Error al registrar usuario",
      };
    }
  };

  const logout = () => {
    console.log("🚪 Cerrando sesión...");
    setUser(null);
    setToken(null);
    localStorage.removeItem("killavibes-token");
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await authService.updateProfile(profileData, token);
      console.log("📨 Respuesta de updateProfile:", response);

      if (response.success) {
        const updatedUser = response.data?.user || response.user || response.data;
        if (updatedUser) {
          setUser(updatedUser);
          return { success: true };
        }
      }
      return { success: false, error: "Error al actualizar perfil" };
    } catch (error) {
      return {
        success: false,
        error: error.message || "Error al actualizar perfil",
      };
    }
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!user && !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};