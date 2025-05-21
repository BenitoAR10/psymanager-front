import { useQuery } from "@tanstack/react-query";
import { getTreatmentScheduleSessions } from "../scheduleService";
import { ScheduleAvailabilityDto } from "../../types/scheduleTypes";
import { useAuth } from "../../auth/useAuth";

/**
 * Hook para obtener las sesiones del tratamiento activo del paciente autenticado.
 */
export const useTreatmentScheduleSessions = () => {
  const { token } = useAuth();

  return useQuery<ScheduleAvailabilityDto[]>({
    queryKey: ["treatment-schedule-sessions"],
    queryFn: getTreatmentScheduleSessions,
    enabled: !!token,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    retry: false,
  });
};
