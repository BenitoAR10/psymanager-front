"use client";

import type React from "react";
import { useState, useEffect } from "react";
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
}

/**
 * Formatea un Date a yyyy-MM-ddThh:mm en zona local
 */
const toLocalDatetime = (date: Date) => {
  const tzOffset = date.getTimezoneOffset() * 60000; // en ms
  const local = new Date(date.getTime() - tzOffset);
  return local.toISOString().slice(0, 16);
};

const EventModal: React.FC<EventModalProps> = ({
  open,
  onClose,
  onSave,
  eventData,
}) => {
  const theme = useTheme();
  const isEditMode = Boolean(eventData?.title);

  // estados para los campos
  const [title, setTitle] = useState(eventData?.title ?? "");
  const [start, setStart] = useState(
    eventData ? toLocalDatetime(eventData.start) : ""
  );
  const [end, setEnd] = useState(
    eventData ? toLocalDatetime(eventData.end) : ""
  );

  // Cuando cambie eventData, reinicializamos
  useEffect(() => {
    if (eventData) {
      setTitle(eventData.title || "");
      setStart(toLocalDatetime(eventData.start));
      setEnd(toLocalDatetime(eventData.end));
    } else {
      setTitle("");
      setStart("");
      setEnd("");
    }
  }, [eventData]);

  const handleSave = () => {
    const newEvent: CalendarEvent = {
      id: eventData?.id ?? Date.now(),
      title,
      start: new Date(start),
      end: new Date(end),
      userTherapistId: eventData!.userTherapistId,
    };
    onSave(newEvent);
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
      <DialogTitle
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
            <Typography variant="h6" component="div" fontWeight={600}>
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

      <DialogContent sx={{ p: 3, pt: 2 }}>
        <TextField
          label="Título del horario"
          placeholder="Ej: Horario de consulta"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          margin="normal"
          variant="outlined"
          InputProps={{
            sx: {
              borderRadius: 2,
            },
          }}
        />

        <Box sx={{ mt: 2, mb: 1 }}>
          <Typography
            variant="subtitle2"
            color="text.secondary"
            sx={{ mb: 1, display: "flex", alignItems: "center", gap: 0.5 }}
          >
            <AccessTimeIcon fontSize="small" />
            Período de tiempo
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
              InputProps={{
                sx: {
                  borderRadius: 2,
                },
              }}
            />
            <TextField
              label="Fecha y hora de fin"
              type="datetime-local"
              fullWidth
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              margin="dense"
              InputLabelProps={{ shrink: true }}
              InputProps={{
                sx: {
                  borderRadius: 2,
                },
              }}
            />
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2, pt: 0 }}>
        <Button
          onClick={onClose}
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
          color={isEditMode ? "primary" : "success"}
          sx={{
            borderRadius: 2,
            px: 3,
            boxShadow: theme.shadows[2],
            "&:hover": {
              boxShadow: theme.shadows[4],
            },
          }}
        >
          {isEditMode ? "Actualizar" : "Crear"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EventModal;
