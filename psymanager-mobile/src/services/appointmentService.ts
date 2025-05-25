import { fetcher } from "../utils/fetcher";
import {
  UserAppointmentDto,
  UserAppointmentDetailDto,
} from "../types/appointmentTypes";

/**
 * Obtiene todas las citas del usuario autenticado.
 * @returns Lista de citas
 * @throws Error si la solicitud falla
 */
export async function getUserAppointments(): Promise<UserAppointmentDto[]> {
  return await fetcher("/api/sessions/my");
}

/**
 * Obtiene el detalle de una cita específica del usuario autenticado.
 * @param sessionId ID de la sesión
 * @returns Detalle de la cita
 * @throws Error si la solicitud falla
 */
export async function getAppointmentDetail(
  sessionId: number
): Promise<UserAppointmentDetailDto> {
  return await fetcher(`/api/sessions/my/${sessionId}`);
}

/**
 * Cancela una cita específica del usuario autenticado.
 * @param sessionId ID de la sesión
 * @param reason Motivo de cancelación
 * @throws Error si la solicitud falla
 */
export async function cancelAppointment(
  sessionId: number,
  reason: string
): Promise<void> {
  await fetcher(`/api/sessions/cancel`, {
    method: "POST",
    body: JSON.stringify({
      scheduleSessionId: sessionId,
      cancellationReason: reason,
    }),
  });
}
