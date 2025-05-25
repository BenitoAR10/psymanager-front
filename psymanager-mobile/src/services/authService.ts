import { fetcher } from "../utils/fetcher";
import { storage } from "../utils/storage";
import { API_URL } from "../utils/urlConstant";

/**
 * Inicia sesión del paciente con email y contraseña.
 * Guarda los tokens en el storage si es exitoso.
 */
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
  return fetcher(`${API_URL}/api/auth/me`);
}

/**
 * Registra a un nuevo paciente con nombre, email y contraseña.
 */
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

/**
 * Completa el perfil del paciente autenticado.
 */
export async function completePatientProfile(profileDto: any): Promise<void> {
  await fetcher(`${API_URL}/api/auth/complete-profile`, {
    method: "PUT",
    body: JSON.stringify(profileDto),
  });
}
