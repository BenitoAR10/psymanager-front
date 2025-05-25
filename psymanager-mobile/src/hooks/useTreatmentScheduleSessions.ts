import { useQuery } from "@tanstack/react-query";
import { getTreatmentScheduleSessions } from "../services/scheduleService";
import { useAuth } from "../auth/useAuth";
import type { ScheduleAvailabilityDto } from "../types/scheduleTypes";

export const useTreatmentScheduleSessions = (options?: {
  enabled?: boolean;
}) => {
  const { token } = useAuth();

  const query = useQuery<ScheduleAvailabilityDto[], Error>({
    queryKey: ["treatment-schedule-sessions"],
    queryFn: getTreatmentScheduleSessions,
    enabled: options?.enabled ?? !!token,
    staleTime: 1000 * 60 * 5,
    refetchInterval: 5000,
    retry: false,
    refetchOnWindowFocus: false,
  });

  return {
    ...query,
    sessions: query.data ?? [],
  };
};
