import { storage } from "../utils/storage";

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:8080";

export interface CompleteProfileRequest {
  birthDate: Date;
  birthGender: string;
  identityGender: string;
  ciNumber: string;
  ciComplement?: string;
  ciExtension: string;
  phoneNumber: string;
  address: string;
}

/**
 * Envía al backend los datos para completar el perfil del usuario autenticado.
 * @param profile Datos del formulario completado
 */
export async function completeUserProfile(
  profile: CompleteProfileRequest
): Promise<void> {
  const token = await storage.getItem("accessToken");

  const response = await fetch(`${API_URL}/api/auth/complete-profile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      ...profile,
      birthDate: profile.birthDate.toISOString().split("T")[0],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Error al completar el perfil");
  }
}
