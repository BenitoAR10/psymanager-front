"use client";

import type React from "react";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  CircularProgress,
  Box,
  Typography,
  IconButton,
  Divider,
  alpha,
  useTheme,
  Paper,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import NoteAltIcon from "@mui/icons-material/NoteAlt";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import SaveIcon from "@mui/icons-material/Save";
import { toast } from "sonner";
import { useSessionNoteQuery } from "../hooks/useSessionNoteQuery";
import { useSaveSessionNoteMutation } from "../hooks/useSaveSessionNoteMutation";
import type { CreateOrUpdateSessionNoteDto } from "../types";

interface SessionNoteModalProps {
  open: boolean;
  onClose: () => void;
  sessionId: number;
}

const SessionNoteModal: React.FC<SessionNoteModalProps> = ({
  open,
  onClose,
  sessionId,
}) => {
  const theme = useTheme();

  const {
    data: note,
    isLoading,
    error,
    refetch,
  } = useSessionNoteQuery(sessionId, open); // solo activa si open = true

  const mutation = useSaveSessionNoteMutation();

  const isNewNote = error?.message === "NOT_FOUND";

  const [form, setForm] = useState<CreateOrUpdateSessionNoteDto>({
    treatmentSessionId: sessionId,
    topicAddressed: "",
    sessionSummary: "",
    relevantObservations: "",
    nextTopic: "",
  });

  useEffect(() => {
    if (note) {
      setForm({
        treatmentSessionId: note.treatmentSessionId,
        topicAddressed: note.topicAddressed,
        sessionSummary: note.sessionSummary,
        relevantObservations: note.relevantObservations,
        nextTopic: note.nextTopic,
      });
    } else {
      setForm({
        treatmentSessionId: sessionId,
        topicAddressed: "",
        sessionSummary: "",
        relevantObservations: "",
        nextTopic: "",
      });
    }
  }, [note, sessionId]);

  const handleChange =
    (field: keyof CreateOrUpdateSessionNoteDto) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleSave = async () => {
    try {
      await mutation.mutateAsync(form);
      toast.success("Nota guardada correctamente");
      await refetch();
      onClose();
    } catch {
      toast.error("Error al guardar la nota");
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: theme.shadows[3],
          overflow: "hidden",
        },
      }}
    >
      {/* Encabezado mejorado */}
      <Box
        sx={{
          p: 0,
          m: 0,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            p: 2,
            pb: 1.5,
            backgroundColor: isNewNote
              ? alpha(theme.palette.success.main, 0.05)
              : alpha(theme.palette.primary.main, 0.05),
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: isNewNote
                  ? theme.palette.success.main
                  : theme.palette.primary.main,
                color: "#fff",
              }}
            >
              {isNewNote ? <AddCircleOutlineIcon /> : <NoteAltIcon />}
            </Box>
            <Typography variant="h6" component="div" fontWeight={600}>
              {isNewNote ? "Nueva nota de la sesión" : "Notas de la sesión"}
            </Typography>
          </Box>
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              color: theme.palette.grey[500],
              "&:hover": {
                backgroundColor: alpha(theme.palette.grey[500], 0.1),
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </Box>

      <Divider />

      <DialogContent sx={{ p: 3, pt: 2.5 }}>
        {isLoading ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              py: 6,
              gap: 2,
            }}
          >
            <CircularProgress size={40} thickness={4} color="primary" />
            <Typography variant="body2" color="text.secondary">
              Cargando notas de la sesión...
            </Typography>
          </Box>
        ) : error && !isNewNote ? (
          <Paper
            elevation={0}
            sx={{
              p: 3,
              textAlign: "center",
              borderRadius: 2,
              border: "1px solid",
              borderColor: alpha(theme.palette.error.main, 0.2),
              bgcolor: alpha(theme.palette.error.main, 0.05),
              my: 2,
            }}
          >
            <Typography
              color="error.main"
              variant="subtitle1"
              fontWeight={600}
              gutterBottom
            >
              Error al cargar la nota
            </Typography>
            <Typography color="text.secondary" variant="body2">
              No se pudo cargar la información de la nota. Por favor, intenta
              nuevamente.
            </Typography>
          </Paper>
        ) : (
          <Box sx={{ mt: 1 }}>
            <TextField
              label="Temática abordada"
              value={form.topicAddressed}
              onChange={handleChange("topicAddressed")}
              fullWidth
              multiline
              minRows={2}
              sx={{
                mb: 3,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  transition: "all 0.2s ease",
                  "&:hover": {
                    borderColor: theme.palette.primary.main,
                  },
                  "&.Mui-focused": {
                    boxShadow: `0 0 0 2px ${alpha(
                      theme.palette.primary.main,
                      0.2
                    )}`,
                  },
                },
              }}
              placeholder="Describe la temática principal tratada en la sesión"
            />
            <TextField
              label="Síntesis de la sesión"
              value={form.sessionSummary}
              onChange={handleChange("sessionSummary")}
              fullWidth
              multiline
              minRows={3}
              sx={{
                mb: 3,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  transition: "all 0.2s ease",
                  "&:hover": {
                    borderColor: theme.palette.primary.main,
                  },
                  "&.Mui-focused": {
                    boxShadow: `0 0 0 2px ${alpha(
                      theme.palette.primary.main,
                      0.2
                    )}`,
                  },
                },
              }}
              placeholder="Resume los puntos clave discutidos durante la sesión"
            />
            <TextField
              label="Observaciones relevantes"
              value={form.relevantObservations}
              onChange={handleChange("relevantObservations")}
              fullWidth
              multiline
              minRows={3}
              sx={{
                mb: 3,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  transition: "all 0.2s ease",
                  "&:hover": {
                    borderColor: theme.palette.primary.main,
                  },
                  "&.Mui-focused": {
                    boxShadow: `0 0 0 2px ${alpha(
                      theme.palette.primary.main,
                      0.2
                    )}`,
                  },
                },
              }}
              placeholder="Anota observaciones importantes sobre el comportamiento, avances o dificultades"
            />
            <TextField
              label="Temática para la próxima sesión"
              value={form.nextTopic}
              onChange={handleChange("nextTopic")}
              fullWidth
              multiline
              minRows={2}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  transition: "all 0.2s ease",
                  "&:hover": {
                    borderColor: theme.palette.primary.main,
                  },
                  "&.Mui-focused": {
                    boxShadow: `0 0 0 2px ${alpha(
                      theme.palette.primary.main,
                      0.2
                    )}`,
                  },
                },
              }}
              placeholder="Sugiere temas a tratar en la siguiente sesión"
            />
          </Box>
        )}
      </DialogContent>

      <Divider />

      <DialogActions sx={{ p: 2, justifyContent: "space-between" }}>
        <Button
          onClick={onClose}
          disabled={mutation.isPending}
          variant="outlined"
          sx={{
            borderRadius: 2,
            px: 3,
            borderWidth: "1.5px",
            "&:hover": {
              borderWidth: "1.5px",
            },
          }}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={mutation.isPending || isLoading}
          startIcon={
            mutation.isPending ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              <SaveIcon />
            )
          }
          color={isNewNote ? "success" : "primary"}
          sx={{
            borderRadius: 2,
            px: 3,
            boxShadow: theme.shadows[2],
            "&:hover": {
              boxShadow: theme.shadows[4],
            },
          }}
        >
          {mutation.isPending ? "Guardando..." : "Guardar nota"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SessionNoteModal;
