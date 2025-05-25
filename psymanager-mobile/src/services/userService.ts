import { fetcher } from "../utils/fetcher";
import type { UserProfileUpdateDto } from "../types/userTypes";

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
  await fetcher(`${API_URL}/api/auth/complete-profile`, {
    method: "PUT",
    body: JSON.stringify({
      ...profile,
      birthDate: profile.birthDate.toISOString().split("T")[0],
    }),
  });
}

/**
 * Actualiza el perfil del usuario autenticado con los datos proporcionados.
 * @param profile Datos del perfil a actualizar
 */
export const updateUserProfile = async (
  payload: UserProfileUpdateDto
): Promise<void> => {
  return await fetcher("/api/users/me", {
    method: "PUT",
    body: JSON.stringify(payload),
  });
};
