import { useQuery } from "@tanstack/react-query";
import { getTreatmentStatus } from "../services/getTreatmentService";

export const useTreatmentStatus = () => {
  return useQuery({
    queryKey: ["treatment-status"],
    queryFn: getTreatmentStatus,
    staleTime: 1000 * 60 * 5, // 5 minutos
    retry: false,
    refetchOnWindowFocus: false,
  });
};
