import { API_URL } from "../utils/urlConstant";
import { ScheduleAvailabilityDto } from "../types/scheduleTypes";
import type { ScheduleAvailabilityWithContactDto } from "../types/scheduleTypes";
import { storage } from "../utils/storage";

/**
 * Obtiene todos los horarios disponibles, opcionalmente filtrados por terapeuta y fecha.
 */
export async function getAvailableSchedules({
  token,
  therapistId,
  startDate,
  endDate,
}: {
  token: string;
  therapistId?: number;
  startDate?: string;
  endDate?: string;
}): Promise<ScheduleAvailabilityDto[]> {
  const params = new URLSearchParams();
  if (therapistId) params.append("therapistId", therapistId.toString());
  if (startDate) params.append("startDate", startDate);
  if (endDate) params.append("endDate", endDate);

  const response = await fetch(
    `${API_URL}/api/schedules/available?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Error ${response.status}: ${response.statusText}`);
  }

  return await response.json();
}

/**
 * Obtiene los horarios disponibles del mismo terapeuta y fecha usando un horario base,
 * incluyendo email y teléfono del terapeuta.
 */
export async function getRelatedSchedulesByScheduleId({
  token,
  scheduleId,
}: {
  token: string;
  scheduleId: number;
}): Promise<ScheduleAvailabilityWithContactDto[]> {
  const response = await fetch(
    `${API_URL}/api/schedules/available/by-schedule/${scheduleId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Error ${response.status}: ${response.statusText}`);
  }

  return await response.json();
}
/**
 * Crea una sesión programada para un horario específico.
 */
export async function createScheduledSession({
  token,
  scheduleId,
  reason,
}: {
  token: string;
  scheduleId: number;
  reason?: string;
}): Promise<void> {
  const response = await fetch(`${API_URL}/api/sessions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      therapistScheduledId: scheduleId,
      reason,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.json();
    throw {
      status: response.status,
      message: errorBody.message || "Error al crear la cita",
      path: errorBody.path,
    };
  }
}

/**
 * Obtiene las sesiones del tratamiento activo del paciente autenticado.
 */
export const getTreatmentScheduleSessions = async (): Promise<
  ScheduleAvailabilityDto[]
> => {
  const token = await storage.getItem("accessToken");
  if (!token) {
    throw new Error("No se encontró el token de autenticación");
  }

  const response = await fetch(
    `${API_URL}/api/sessions/my/treatment-sessions`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      errorText || "Error al obtener sesiones del tratamiento activo"
    );
  }

  return await response.json();
};
