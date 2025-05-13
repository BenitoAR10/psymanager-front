import { useMutation } from "@tanstack/react-query";
import { saveOrUpdateSessionNote } from "../services/sessionNotesService";

export const useSaveSessionNoteMutation = () => {
  return useMutation({
    mutationFn: saveOrUpdateSessionNote,
  });
};
