"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
  Divider,
  useTheme,
  alpha,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import EditCalendarIcon from "@mui/icons-material/EditCalendar";
import AddIcon from "@mui/icons-material/Add";
import type { CalendarEvent } from "../types";

interface EventModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (event: CalendarEvent) => void;
  eventData?: CalendarEvent;
  therapistName: string;
}

// Helper para capitalizar cada palabra
const capitalizeWord = (word: string) =>
  word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();

// Convierte Date a "yyyy-MM-ddThh:mm"
const toLocalDatetime = (date: Date) => {
  const tzOffset = date.getTimezoneOffset() * 60000;
  const local = new Date(date.getTime() - tzOffset);
  return local.toISOString().slice(0, 16);
};

const EventModal: React.FC<EventModalProps> = ({
  open,
  onClose,
  onSave,
  eventData,
  therapistName,
}) => {
  const theme = useTheme();
  // Sólo edición si viene title no vacío
  const isEditMode = Boolean(eventData?.title);

  const [title, setTitle] = useState<string>(therapistName);
  const [start, setStart] = useState<string>("");
  const [end, setEnd] = useState<string>("");

  useEffect(() => {
    // Sólo (re)inicializar cuando el modal se abre
    if (!open) return;

    if (isEditMode && eventData) {
      // Capitaliza cada palabra del título existente
      const cleaned = eventData
        .title!.split(" ")
        .filter(Boolean)
        .map(capitalizeWord)
        .join(" ");
      setTitle(cleaned);
    } else {
      // Nuevo horario: título por defecto
      setTitle(therapistName);
    }

    if (eventData) {
      // En edición o creación a partir de slot, siempre rellena start/end
      setStart(toLocalDatetime(eventData.start));
      setEnd(toLocalDatetime(eventData.end));
    } else {
      setStart("");
      setEnd("");
    }
  }, [open, eventData, therapistName, isEditMode]);

  const handleSave = () => {
    onSave({
      id: eventData?.id ?? Date.now(),
      title,
      start: new Date(start),
      end: new Date(end),
      userTherapistId: eventData!.userTherapistId,
    });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: theme.shadows[3],
          overflow: "hidden",
        },
      }}
    >
      {/* HEADER */}
      <DialogTitle sx={{ p: 0, m: 0 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            p: 2,
            pb: 1,
            backgroundColor: isEditMode
              ? alpha(theme.palette.primary.main, 0.05)
              : alpha(theme.palette.success.main, 0.05),
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
                backgroundColor: isEditMode
                  ? theme.palette.primary.main
                  : theme.palette.success.main,
                color: "#fff",
              }}
            >
              {isEditMode ? <EditCalendarIcon /> : <AddIcon />}
            </Box>
            <Typography variant="h6" fontWeight={600}>
              {isEditMode ? "Editar Horario" : "Nuevo Horario"}
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
      </DialogTitle>

      <Divider />

      {/* BODY */}
      <DialogContent sx={{ p: 3, pt: 2 }}>
        <TextField
          label="Terapeuta"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          margin="normal"
          variant="outlined"
          InputProps={{ sx: { borderRadius: 2 } }}
        />

        <Box sx={{ mt: 2, mb: 1 }}>
          <Typography
            variant="subtitle2"
            color="text.secondary"
            sx={{ mb: 1, display: "flex", alignItems: "center", gap: 0.5 }}
          >
            <AccessTimeIcon fontSize="small" /> Período de tiempo
          </Typography>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              flexDirection: { xs: "column", sm: "row" },
            }}
          >
            <TextField
              label="Fecha y hora de inicio"
              type="datetime-local"
              fullWidth
              value={start}
              onChange={(e) => setStart(e.target.value)}
              margin="dense"
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: { borderRadius: 2 } }}
            />
            <TextField
              label="Fecha y hora de fin"
              type="datetime-local"
              fullWidth
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              margin="dense"
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: { borderRadius: 2 } }}
            />
          </Box>
        </Box>
      </DialogContent>

      {/* FOOTER */}
      <DialogActions sx={{ p: 2, pt: 0 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            borderRadius: 2,
            px: 3,
            borderWidth: "1.5px",
            "&:hover": { borderWidth: "1.5px" },
          }}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          color={isEditMode ? "primary" : "success"}
          sx={{
            borderRadius: 2,
            px: 3,
            boxShadow: theme.shadows[2],
            "&:hover": { boxShadow: theme.shadows[4] },
          }}
        >
          {isEditMode ? "Actualizar" : "Crear"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EventModal;
