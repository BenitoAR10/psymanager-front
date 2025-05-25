import { useQuery } from "@tanstack/react-query";
import { getUserProfile } from "../services/getUserProfileService";

export const useUserProfile = () => {
  return useQuery({
    queryKey: ["user-profile"],
    queryFn: getUserProfile,
    staleTime: 1000 * 60 * 10,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });
};
