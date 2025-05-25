import { fetcher } from "../utils/fetcher";
import type {
  ScheduleAvailabilityDto,
  ScheduleAvailabilityWithContactDto,
} from "../types/scheduleTypes";

/**
 * Obtiene los horarios disponibles, opcionalmente filtrados por terapeuta y rango de fechas.
 * @param therapistId ID del terapeuta a filtrar
 * @param startDate Fecha inicial del rango (YYYY-MM-DD)
 * @param endDate Fecha final del rango (YYYY-MM-DD)
 * @returns Lista de horarios disponibles
 */
export async function getAvailableSchedules({
  therapistId,
  startDate,
  endDate,
}: {
  therapistId?: number;
  startDate: string;
  endDate: string;
}): Promise<ScheduleAvailabilityDto[]> {
  const params = new URLSearchParams();
  params.append("startDate", startDate);
  params.append("endDate", endDate);
  if (therapistId) params.append("therapistId", therapistId.toString());

  const queryString = params.toString();
  const url = queryString
    ? `/api/schedules/available?${queryString}`
    : `/api/schedules/available`;

  return await fetcher(url);
}

/**
 * Obtiene los horarios disponibles del mismo terapeuta y fecha,
 * relacionados al horario base especificado por su ID.
 * @param scheduleId ID del horario base
 * @returns Lista de horarios relacionados con contacto del terapeuta
 */
export async function getRelatedSchedulesByScheduleId(
  scheduleId: number
): Promise<ScheduleAvailabilityWithContactDto[]> {
  return await fetcher(`/api/schedules/available/by-schedule/${scheduleId}`);
}

/**
 * Crea una nueva sesión programada para un horario específico.
 * @param scheduleId ID del horario disponible seleccionado
 * @param reason Razón de la cita (opcional)
 * @throws Error si la creación falla, incluyendo mensaje y path del error
 */
export async function createScheduledSession({
  scheduleId,
  reason,
}: {
  scheduleId: number;
  reason?: string;
}): Promise<void> {
  await fetcher(`/api/sessions`, {
    method: "POST",
    body: JSON.stringify({
      therapistScheduledId: scheduleId,
      reason,
    }),
  });
}

/**
 * Obtiene las sesiones del tratamiento activo del paciente autenticado.
 * @returns Lista de sesiones asignadas al tratamiento activo
 */
export const getTreatmentScheduleSessions = async (): Promise<
  ScheduleAvailabilityDto[]
> => {
  return await fetcher("/api/sessions/my/treatment-sessions");
};
