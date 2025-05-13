import { useQuery } from "@tanstack/react-query";
import { getPatientsByTherapist } from "../services/studentService";
import type { AssignedPatientDto } from "../types";

/**
 * Hook para obtener estudiantes atendidos por un terapeuta.
 */
export function useStudentsQuery(therapistId: number) {
  return useQuery<AssignedPatientDto[]>({
    queryKey: ["therapist-patients", therapistId],
    queryFn: () => getPatientsByTherapist(therapistId),
    enabled: !!therapistId,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}
