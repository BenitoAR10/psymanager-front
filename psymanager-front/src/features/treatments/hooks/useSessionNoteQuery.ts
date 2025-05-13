import { useQuery } from "@tanstack/react-query";
import { getSessionNoteBySessionId } from "../services/sessionNotesService";
import type { SessionNoteDto } from "../types";

export const useSessionNoteQuery = (
  sessionId: number | null,
  enabled = true
) => {
  const shouldFetch = enabled && sessionId !== null;

  return useQuery<SessionNoteDto>({
    queryKey: ["session-note", sessionId],
    queryFn: () => getSessionNoteBySessionId(sessionId!),
    enabled: shouldFetch,
    retry: false,
    staleTime: 1000 * 60 * 3,
  });
};
