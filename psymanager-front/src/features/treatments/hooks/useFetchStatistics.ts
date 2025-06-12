import { useQuery } from "@tanstack/react-query";
import customAxios from "../../../services/axiosInstance";
import type { StatisticsResponseDto } from "../types";

/**
 * Parámetros para la consulta de estadísticas.
 */
interface FetchStatisticsParams {
  patientId: number;
  from: string;
  to: string;
}

/**
 * Hook para obtener estadísticas semanales de ejercicios completados por paciente.
 */
export function useFetchStatistics(params: FetchStatisticsParams) {
  const { patientId, from, to } = params;

  return useQuery<StatisticsResponseDto, Error>({
    queryKey: ["statistics", patientId, from, to],
    queryFn: async () => {
      const response = await customAxios.get<StatisticsResponseDto>(
        `/api/statistics/${patientId}/weekly`,
        { params: { from, to } }
      );
      return response.data;
    },
    enabled: Boolean(patientId),
  });
}
