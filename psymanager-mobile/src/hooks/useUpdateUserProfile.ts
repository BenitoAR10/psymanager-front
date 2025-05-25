import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserProfile } from "../services/userService";
import type { UserProfileUpdateDto } from "../types/userTypes";

export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UserProfileUpdateDto) => updateUserProfile(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
    },
  });
};
