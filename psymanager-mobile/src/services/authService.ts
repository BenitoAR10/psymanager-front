import { API_URL } from "../utils/constants";
import { storage } from "../utils/storage";

const GOOGLE_MOBILE_AUTH_PATH = "/oauth2/authorization/google-mobile";

/**
 * Inicia el flujo de autenticación con Google para la app móvil.
 * Redirige al navegador al endpoint OAuth2 del backend.
 */
// export function loginWithGoogle(): void {
//   const url = `${API_URL}${GOOGLE_MOBILE_AUTH_PATH}`;
//   window.location.href = url;
// }

export async function loginWithEmailAndPassword(
  email: string,
  password: string
): Promise<void> {
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error("Credenciales inválidas o error de red.");
  }

  const data = await response.json();

  await storage.setItem("accessToken", data.accessToken);
  await storage.setItem("refreshToken", data.refreshToken);
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

  if (!token) {
    console.warn("⚠️ Token no disponible. Abortando llamada a /auth/me.");
    throw new Error("Token de acceso no disponible");
  }

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

export async function registerPatientStep1(
  firstName: string,
  lastName: string,
  email: string,
  password: string
): Promise<void> {
  const response = await fetch(`${API_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ firstName, lastName, email, password }),
  });

  if (!response.ok) {
    const msg = await response.text();
    throw new Error(msg || "Error al registrar al paciente.");
  }
}

export async function completePatientProfile(profileDto: any): Promise<void> {
  const token = await storage.getItem("accessToken");

  const response = await fetch(`${API_URL}/api/auth/complete-profile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(profileDto),
  });

  if (!response.ok) {
    throw new Error("No se pudo completar el perfil.");
  }
}
