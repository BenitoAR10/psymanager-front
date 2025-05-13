import { API_URL } from "../utils/constants";
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
