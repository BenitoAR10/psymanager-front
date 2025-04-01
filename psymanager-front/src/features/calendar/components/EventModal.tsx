import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import { CalendarEvent } from "../types";

interface EventModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (event: CalendarEvent) => void;
  eventData?: CalendarEvent;
}

const EventModal: React.FC<EventModalProps> = ({
  open,
  onClose,
  onSave,
  eventData,
}) => {
  // Si se edita un evento, se inicializan con sus valores; si no, quedan vacíos.
  const [title, setTitle] = useState(eventData ? eventData.title : "");
  const [start, setStart] = useState(
    eventData ? eventData.start.toISOString().substring(0, 16) : ""
  );
  const [end, setEnd] = useState(
    eventData ? eventData.end.toISOString().substring(0, 16) : ""
  );

  useEffect(() => {
    if (eventData) {
      setTitle(eventData.title);
      setStart(eventData.start.toISOString().substring(0, 16));
      setEnd(eventData.end.toISOString().substring(0, 16));
    } else {
      setTitle("");
      setStart("");
      setEnd("");
    }
  }, [eventData]);

  const handleSave = () => {
    const newEvent: CalendarEvent = {
      id: eventData ? eventData.id : Date.now(), // Genera un id único
      title,
      start: new Date(start),
      end: new Date(end),
    };
    onSave(newEvent);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{eventData ? "Editar Evento" : "Nuevo Evento"}</DialogTitle>
      <DialogContent>
        <TextField
          label="Título"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          margin="dense"
        />
        <TextField
          label="Inicio"
          type="datetime-local"
          fullWidth
          value={start}
          onChange={(e) => setStart(e.target.value)}
          margin="dense"
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Fin"
          type="datetime-local"
          fullWidth
          value={end}
          onChange={(e) => setEnd(e.target.value)}
          margin="dense"
          InputLabelProps={{ shrink: true }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EventModal;
