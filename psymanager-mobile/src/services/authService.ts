import { API_URL } from "../utils/constants";
import { storage } from "../utils/storage";

const GOOGLE_MOBILE_AUTH_PATH = "/oauth2/authorization/google-mobile";

/**
 * Inicia el flujo de autenticación con Google para la app móvil.
 * Redirige al navegador al endpoint OAuth2 del backend.
 */
export function loginWithGoogle(): void {
  const url = `${API_URL}${GOOGLE_MOBILE_AUTH_PATH}`;
  window.location.href = url;
}

/**
 * Obtiene la información del usuario autenticado desde el backend.
 */
export async function getUserProfileInfo(): Promise<{
  email: string;
  firstName: string;
  lastName: string;
  userId: number;
  roles: string[];
  profileComplete: boolean;
}> {
  const token = await storage.getItem("accessToken");

  const response = await fetch(`${API_URL}/api/auth/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("No se pudo obtener la información del usuario");
  }

  return await response.json();
}
