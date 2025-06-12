import { useQuery } from "@tanstack/react-query";
import customAxios from "../../../services/axiosInstance";
import type { CategoryCountResponseDto } from "../types";

interface FetchCategoryParams {
  patientId: number;
  from: string;
  to: string;
}

export function useFetchCategoryStatistics(params: FetchCategoryParams) {
  const { patientId, from, to } = params;
  return useQuery<CategoryCountResponseDto[], Error>({
    queryKey: ["statistics", "category", patientId, from, to],
    queryFn: async () => {
      const { data } = await customAxios.get<{
        byCategory: CategoryCountResponseDto[];
      }>(`/api/statistics/${patientId}/weekly`, { params: { from, to } });
      return data.byCategory;
    },
    enabled: Boolean(patientId && from && to),
  });
}
