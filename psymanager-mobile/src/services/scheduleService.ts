import { ScheduleAvailabilityDto } from "../types/scheduleTypes";

/**
 * Obtiene todos los horarios disponibles opcionalmente filtrados por terapeuta y fecha.
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
  try {
    const baseUrl = process.env.EXPO_PUBLIC_API_URL || "http://localhost:8080";
    const params = new URLSearchParams();

    if (therapistId) params.append("therapistId", therapistId.toString());
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);

    const response = await fetch(
      `${baseUrl}/api/schedules/available?${params.toString()}`,
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
  } catch (error) {
    console.error("Error al obtener horarios disponibles:", error);
    throw error;
  }
}

/**
 * Obtiene los horarios disponibles del mismo terapeuta y fecha usando un horario base.
 */
export async function getRelatedSchedulesByScheduleId({
  token,
  scheduleId,
}: {
  token: string;
  scheduleId: number;
}): Promise<ScheduleAvailabilityDto[]> {
  try {
    const baseUrl = process.env.EXPO_PUBLIC_API_URL || "http://localhost:8080";

    const response = await fetch(
      `${baseUrl}/api/schedules/available/by-schedule/${scheduleId}`,
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
  } catch (error) {
    console.error("Error al obtener horarios relacionados:", error);
    throw error;
  }
}

/**
 * * Crea una sesión programada para un horario específico.
 * * @param token - Token de autorización del usuario.
 * * @param scheduleId - ID del horario programado.
 */

export async function createScheduledSession({
  token,
  scheduleId,
}: {
  token: string;
  scheduleId: number;
}): Promise<void> {
  const baseUrl = process.env.EXPO_PUBLIC_API_URL || "http://localhost:8080";

  const response = await fetch(`${baseUrl}/api/sessions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ therapistScheduledId: scheduleId }),
  });

  if (!response.ok) {
    const errorBody = await response.json();
    throw new Error(JSON.stringify(errorBody));
  }
}
