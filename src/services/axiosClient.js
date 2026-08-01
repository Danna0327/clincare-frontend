import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api/v1";

/**
 * Instancia única de axios usada por todos los servicios.
 * Centraliza la configuración de base URL, headers y manejo de errores
 * para que ningún servicio tenga que repetirla (principio DRY / SRP).
 */
const axiosClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("clincare_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const detail =
      error.response?.data?.detail ||
      error.response?.data?.message ||
      error.message ||
      "Ocurrió un error inesperado al comunicarse con el servidor.";

    if (error.response?.status === 401) {
      localStorage.removeItem("clincare_token");
      localStorage.removeItem("clincare_user");
    }

    return Promise.reject({ ...error, detail });
  }
);

export default axiosClient;
