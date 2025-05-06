import axiosInstance from "../../../services/axiosInstance";

import type { UpcomingAppointmentDto } from "../types";

/**
 * Marca una sesión como ACCEPTED o REJECTED.
 * @param appointmentId  ID de la cita
 * @param newState       'ACCEPTED' | 'REJECTED'
 */
export async function updateAppointmentState(
  appointmentId: number,
  newState: "ACCEPTED" | "REJECTED"
): Promise<void> {
  await axiosInstance.put(`/api/sessions/${appointmentId}/state`, {
    newState,
  });
}

/**
 * Obtiene las solicitudes PENDING.
 */
export async function getPendingAppointments(): Promise<
  UpcomingAppointmentDto[]
> {
  const resp = await axiosInstance.get<UpcomingAppointmentDto[]>(
    "/api/sessions",
    { params: { state: "PENDING" } }
  );
  return resp.data;
}
