import { useQuery } from "@tanstack/react-query";
import customAxios from "../../../services/axiosInstance";
import type { HourlySeriesResponseDto } from "../types";

interface FetchHourlyParams {
  patientId: number;
  from: string;
  to: string;
}

export function useFetchHourlyStatistics(params: FetchHourlyParams) {
  const { patientId, from, to } = params;
  return useQuery<HourlySeriesResponseDto, Error>({
    queryKey: ["statistics", "hourly", patientId, from, to],
    queryFn: async () => {
      const { data } = await customAxios.get<HourlySeriesResponseDto>(
        `/api/statistics/${patientId}/hourly`,
        { params: { from, to } }
      );
      return data;
    },
    enabled: Boolean(patientId && from && to),
  });
}
