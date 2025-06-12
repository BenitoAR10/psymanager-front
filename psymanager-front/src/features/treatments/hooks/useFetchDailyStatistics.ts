import { useQuery } from "@tanstack/react-query";
import customAxios from "../../../services/axiosInstance";
import type { DailySeriesResponseDto } from "../types";

interface FetchDailyParams {
  patientId: number;
  from: string;
  to: string;
}

/**
 * Hook para obtener estadísticas diarias de ejercicios completados por paciente.
 */
export function useFetchDailyStatistics(params: FetchDailyParams) {
  const { patientId, from, to } = params;

  return useQuery<DailySeriesResponseDto, Error>({
    queryKey: ["statistics", "daily", patientId, from, to],
    queryFn: async () => {
      const response = await customAxios.get<DailySeriesResponseDto>(
        `/api/statistics/${patientId}/daily`,
        { params: { from, to } }
      );
      return response.data;
    },
    enabled: Boolean(patientId && from && to),
  });
}
