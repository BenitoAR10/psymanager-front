import { fetcher } from "../utils/fetcher";

export const getFaculties = async (): Promise<string[]> => {
  return await fetcher("/api/careers/faculties");
};

export const getCareersByFaculty = async (
  faculty: string
): Promise<{ careerId: number; careerName: string }[]> => {
  return await fetcher(
    `/api/careers/by-faculty?faculty=${encodeURIComponent(faculty)}`
  );
};
