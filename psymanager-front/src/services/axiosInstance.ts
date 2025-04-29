import axios from "axios";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_API_URL;

// Instancia de axios
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor de requests: agregamos el accessToken a cada solicitud
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de responses: manejo global de errores
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;

      // Si nuestro backend devolvió ErrorResponse estructurado:
      const backendMessage = data?.message || "Ocurrió un error inesperado";

      //  Mostramos notificación global (puede ser Toast, Modal, etc.)
      switch (status) {
        case 400:
          toast.warning(backendMessage);
          break;

        case 401:
          toast.error("No estás autenticado. Por favor inicia sesión.");
          // window.location.href = "/login";
          break;

        case 403:
          toast.error("Acceso denegado.");
          break;

        case 404:
          toast.error("Recurso no encontrado.");
          break;

        case 500:
          toast.error("Error interno del servidor.");
          break;

        default:
          toast.error(backendMessage);
          break;
      }
    } else if (error.request) {
      // Cuando no hubo respuesta del servidor (timeout, desconexión, etc.)
      toast.error("No se pudo contactar con el servidor.");
    } else {
      // Error desconocido
      toast.error("Error al procesar la solicitud.");
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
