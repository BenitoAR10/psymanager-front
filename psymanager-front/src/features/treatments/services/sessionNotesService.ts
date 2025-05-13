import { isAxiosError } from "axios";
import type { SessionNoteDto, CreateOrUpdateSessionNoteDto } from "../types";
import customAxios from "../../../services/axiosInstance";

export const getSessionNoteBySessionId = async (
  sessionId: number
): Promise<SessionNoteDto> => {
  try {
    const { data } = await customAxios.get(`/api/notes/session/${sessionId}`);
    return data;
  } catch (error: unknown) {
    if (isAxiosError(error) && error.response?.status === 404) {
      throw new Error("NOT_FOUND");
    }
    throw error;
  }
};
export const saveOrUpdateSessionNote = async (
  noteData: CreateOrUpdateSessionNoteDto
): Promise<SessionNoteDto> => {
  const { data } = await customAxios.post("/api/notes", noteData);
  return data;
};
