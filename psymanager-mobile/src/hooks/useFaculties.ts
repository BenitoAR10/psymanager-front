import { useQuery } from "@tanstack/react-query";
import { getFaculties, getCareersByFaculty } from "../services/careerService";

/**
 * Hook para obtener la lista de facultades únicas.
 */
export const useFaculties = () => {
  return useQuery({
    queryKey: ["faculties"],
    queryFn: getFaculties,
    staleTime: 10 * 60 * 1000, // 10 minutos
    refetchOnWindowFocus: false,
  });
};

/**
 * Hook para obtener la lista de carreras por facultad seleccionada.
 * @param faculty Facultad seleccionada (ej. "Ciencias Sociales")
 */
export const useCareersByFaculty = (faculty: string) => {
  return useQuery({
    queryKey: ["careers", faculty],
    queryFn: () => getCareersByFaculty(faculty),
    enabled: !!faculty,
    staleTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};
