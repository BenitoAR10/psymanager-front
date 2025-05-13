import { useQuery } from "@tanstack/react-query";
import { getTreatmentScheduleSessions } from "../scheduleService";
import { ScheduleAvailabilityDto } from "../../types/scheduleTypes";

/**
 * Hook para obtener las sesiones del tratamiento activo del paciente autenticado.
 */
export const useTreatmentScheduleSessions = () => {
  return useQuery<ScheduleAvailabilityDto[]>({
    queryKey: ["treatment-schedule-sessions"],
    queryFn: getTreatmentScheduleSessions,
  });
};
