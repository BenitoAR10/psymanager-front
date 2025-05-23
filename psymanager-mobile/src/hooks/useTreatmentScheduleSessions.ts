import { useQuery } from "@tanstack/react-query";
import { getTreatmentScheduleSessions } from "../services/scheduleService";
import { useAuth } from "../auth/useAuth";
import type { ScheduleAvailabilityDto } from "../types/scheduleTypes";

export const useTreatmentScheduleSessions = () => {
  const { token } = useAuth();

  const query = useQuery<ScheduleAvailabilityDto[], Error>({
    queryKey: ["treatment-schedule-sessions"],
    queryFn: getTreatmentScheduleSessions,
    enabled: !!token,
    staleTime: 1000 * 60 * 5,
    refetchInterval: 5000,
    retry: false,
    refetchOnWindowFocus: false,
  });

  const hasTreatmentActive =
    query.isSuccess && Array.isArray(query.data) && query.data.length > 0;

  return {
    ...query,
    hasTreatmentActive,
    sessions: query.data ?? [],
  };
};
