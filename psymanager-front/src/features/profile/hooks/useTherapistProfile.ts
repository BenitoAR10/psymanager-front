import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getTherapistProfile,
  updateTherapistProfile,
} from "../services/profileService";
import type {
  TherapistProfileUpdateDto,
  TherapistProfileViewDto,
} from "../types";

export const useTherapistProfile = () => {
  const queryClient = useQueryClient();

  const {
    data: profile,
    isLoading,
    isError,
  } = useQuery<TherapistProfileViewDto>({
    queryKey: ["therapist-profile"],
    queryFn: getTherapistProfile,
  });

  const mutation = useMutation({
    mutationFn: (data: TherapistProfileUpdateDto) =>
      updateTherapistProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["therapist-profile"] });
    },
  });

  const [editMode, setEditMode] = useState(false);

  const isProfileIncomplete =
    !profile?.ciNumber ||
    !profile?.specialties ||
    profile.specialties.length === 0;

  return {
    profile,
    isLoading,
    isError,
    isProfileIncomplete,
    editMode,
    setEditMode,
    updateProfile: mutation.mutate,
    updating: mutation.isPending,
  };
};
