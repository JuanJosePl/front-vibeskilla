// services/api.js
import { API_CONFIG, getHeaders } from "../config/api";

class ApiClient {
  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.timeout = API_CONFIG.TIMEOUT;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: getHeaders(),
      ...options,
    };

    // Si hay body, convertir a JSON
    if (config.body && typeof config.body === "object") {
      config.body = JSON.stringify(config.body);
      config.headers["Content-Type"] = "application/json";
    }

    // Agregar timeout
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Timeout")), this.timeout)
    );

    try {
      const response = await Promise.race([fetch(url, config), timeoutPromise]);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || `HTTP error! status: ${response.status}`
        );
      }

      return data;
    } catch (error) {
      console.error("API Request failed:", error);

      // Manejar errores específicos
      if (error.message === "Timeout") {
        throw new Error("La solicitud tardó demasiado tiempo");
      }

      if (
        error.message.includes("Failed to fetch") ||
        error.message.includes("CORS")
      ) {
        throw new Error("No se pudo conectar con el servidor");
      }

      throw error;
    }
  }

  async get(endpoint, data = null, token = null) {
    return this.request(endpoint, {
      method: "GET",
      headers: getHeaders(token),
      body: data,
    });
  }

  async post(endpoint, data, token = null) {
    return this.request(endpoint, {
      method: "POST",
      headers: getHeaders(token),
      body: data,
    });
  }

  async put(endpoint, data, token = null) {
    return this.request(endpoint, {
      method: "PUT",
      headers: getHeaders(token),
      body: data,
    });
  }

  async delete(endpoint, data = null, token = null) {
    return this.request(endpoint, {
      method: "DELETE",
      headers: getHeaders(token),
      body: data,
    });
  }
}

export const apiClient = new ApiClient();
