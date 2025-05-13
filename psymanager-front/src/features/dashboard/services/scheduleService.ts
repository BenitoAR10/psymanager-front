import axios from "../../../services/axiosInstance";
import { ScheduleAvailabilityDto } from "../types";

/**
 * Obtiene los horarios disponibles para un terapeuta dentro de un rango de fechas.
 */
export async function getSchedulesByTherapistAndDateRange(
  therapistId: number,
  startDate: string,
  endDate: string
): Promise<ScheduleAvailabilityDto[]> {
  try {
    if (!therapistId || !startDate || !endDate) return [];

    const response = await axios.get<ScheduleAvailabilityDto[]>(
      "/api/schedules/filterByTherapistDate",
      {
        params: {
          therapistId,
          startDate,
          endDate,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error al obtener horarios del terapeuta:", error);
    throw error;
  }
}
