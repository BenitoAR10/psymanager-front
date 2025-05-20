import axiosInstance from "../../../services/axiosInstance";
import type {
  SpecialtyDto,
  TherapistProfileUpdateDto,
  TherapistProfileViewDto,
} from "../types";

/**
 * Obtiene la lista de especialidades disponibles para terapeutas.
 */
export async function fetchSpecialties(): Promise<SpecialtyDto[]> {
  const response = await axiosInstance.get<SpecialtyDto[]>("/api/specialties");
  return response.data;
}

export async function getTherapistProfile(): Promise<TherapistProfileViewDto> {
  const response = await axiosInstance.get("/api/therapists/me/profile");
  return response.data;
}

/**
 * Envía los datos del perfil del terapeuta para actualizar/completar.
 * @param data Objeto con los datos del formulario.
 */
export async function updateTherapistProfile(
  data: TherapistProfileUpdateDto
): Promise<void> {
  await axiosInstance.put("/api/therapists/me/profile", data);
}
