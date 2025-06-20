import axiosInstance from "../../../services/axiosInstance";
import type { UpcomingAppointmentDto } from "../types";

/**
 * Servicio para obtener las próximas citas desde el backend.
 */
export async function getUpcomingAppointments(
  limit: number
): Promise<UpcomingAppointmentDto[]> {
  const response = await axiosInstance.get<UpcomingAppointmentDto[]>(
    "/api/sessions/upcoming",
    { params: { limit } }
  );
  return response.data;
}

/**
 * Servicio para obtener todas las citas del terapeuta (pasadas y futuras).
 */
export async function getAllAppointments(): Promise<UpcomingAppointmentDto[]> {
  const response = await axiosInstance.get<UpcomingAppointmentDto[]>(
    "/api/sessions/all"
  );
  return response.data;
}
