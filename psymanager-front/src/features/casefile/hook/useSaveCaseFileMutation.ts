import { useMutation } from "@tanstack/react-query";
import { saveOrUpdateCaseFile } from "../services/caseFileService";

export const useSaveCaseFileMutation = () => {
  return useMutation({
    mutationFn: saveOrUpdateCaseFile,
  });
};
