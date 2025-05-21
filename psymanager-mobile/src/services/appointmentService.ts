import { API_URL } from "../utils/urlConstant";
import {
  UserAppointmentDto,
  UserAppointmentDetailDto,
} from "../types/appointmentTypes";

/**
 * Obtiene todas las citas del usuario autenticado.
 */
export async function getUserAppointments(
  token: string
): Promise<UserAppointmentDto[]> {
  const response = await fetch(`${API_URL}/api/sessions/my`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Error al obtener citas agendadas");
  }

  return await response.json();
}

/**
 * Obtiene el detalle de una cita específica del usuario.
 */
export async function getAppointmentDetail(
  sessionId: number,
  token: string
): Promise<UserAppointmentDetailDto> {
  const response = await fetch(`${API_URL}/api/sessions/my/${sessionId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Error al obtener detalle de la cita");
  }

  return await response.json();
}

/**
 * Cancela una cita específica del usuario.
 * @param sessionId ID de la sesión a cancelar
 * @param reason Motivo de la cancelación
 * @param token Token JWT del usuario autenticado
 */
export async function cancelAppointment(
  sessionId: number,
  reason: string,
  token: string
): Promise<void> {
  const response = await fetch(`${API_URL}/api/sessions/cancel`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      scheduleSessionId: sessionId,
      cancellationReason: reason,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      errorText || "No se pudo cancelar la cita. Intenta nuevamente."
    );
  }
}
