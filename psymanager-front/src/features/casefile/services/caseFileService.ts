import customAxios from "../../../services/axiosInstance";
import type { CaseFileDto, CreateOrUpdateCaseFileDto } from "../types";

import { isAxiosError } from "axios";

export const getCaseFileByTreatmentId = async (
  treatmentId: number
): Promise<CaseFileDto> => {
  try {
    const { data } = await customAxios.get(
      `/api/case-files/treatment/${treatmentId}`
    );
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 404) {
      throw new Error("NOT_FOUND");
    }

    throw error;
  }
};

export const saveOrUpdateCaseFile = async (
  payload: CreateOrUpdateCaseFileDto
): Promise<CaseFileDto> => {
  const { data } = await customAxios.post("/api/case-files", payload);
  return data;
};
