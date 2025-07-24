"use client";

import type React from "react";
import { useState, useEffect } from "react";
import {
  Calendar,
  momentLocalizer,
  type SlotInfo,
  type Event as RBCEvent,
  type EventProps,
} from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import {
  Box,
  Paper,
  Typography,
  CircularProgress,
  Alert,
  useTheme,
} from "@mui/material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Tooltip } from "@mui/material";
import { toast } from "sonner";

import type { CalendarEvent } from "../types";
import {
  fetchSchedules,
  createSchedule,
  updateSchedule,
} from "../services/CalendarService";
import EventModal from "./EventModal";
import { useAuth } from "../../../features/auth/context/AuthContext";
import type { CreateScheduleRequestDto } from "../services/CalendarService";

import Legend from "./Legend";
import "moment/locale/es";
import "./calendar-styles.css";

// Configurar momento en español
moment.locale("es");
const localizer = momentLocalizer(moment);

// Componente personalizado para el evento
const EventComponent: React.FC<EventProps<CalendarEvent>> = ({ event }) => {
  const theme = useTheme();
  const { user } = useAuth();
  const isOwnEvent = event.userTherapistId === user?.userId;

  // Truncar el título si es demasiado largo
  const getFormattedName = (fullName: string): string => {
    if (!fullName) return "Horario disponible";

    const parts = fullName.trim().split(" ");
    if (parts.length === 1) return capitalize(parts[0]);

    const firstName = capitalize(parts[0]);
    const lastNames = parts.slice(-2).map(capitalize).join(" ");

    return `${firstName} ${lastNames}`;
  };

  const displayTitle = getFormattedName(event.title || "");

  return (
    <Tooltip title={displayTitle} arrow placement="top">
      <Box
        sx={{
          backgroundColor: isOwnEvent
            ? theme.palette.primary.main
            : theme.palette.secondary.main,
          color: isOwnEvent
            ? theme.palette.primary.contrastText
            : theme.palette.secondary.contrastText,
          borderRadius: 1,
          fontSize: "0.75rem",
          fontWeight: 500,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          boxShadow: isOwnEvent
            ? `0 1px 3px ${theme.palette.primary.main}30`
            : `0 1px 3px ${theme.palette.secondary.main}30`,
          cursor: isOwnEvent ? "pointer" : "not-allowed",
          opacity: isOwnEvent ? 1 : 0.8,
          transition: "all 0.2s ease",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2px 4px",
          "&:hover": {
            opacity: isOwnEvent ? 1 : 0.8,
            transform: isOwnEvent ? "translateY(-1px)" : "none",
            boxShadow: isOwnEvent
              ? `0 2px 5px ${theme.palette.primary.main}40`
              : `0 1px 3px ${theme.palette.secondary.main}30`,
          },
        }}
      >
        {displayTitle}
      </Box>
    </Tooltip>
  );
};

const capitalize = (word: string) =>
  word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();

const CalendarView: React.FC = () => {
  const { accessToken } = useAuth();
  const theme = useTheme();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | undefined>(
    undefined
  );

  const payload = accessToken
    ? JSON.parse(atob(accessToken.split(".")[1]))
    : { firstName: "", lastName: "" };

  const therapistName = [payload.firstName, payload.lastName]
    .filter(Boolean)
    .map(capitalize)
    .join(" ");

  const [selectedSlot, setSelectedSlot] = useState<{
    start: Date;
    end: Date;
  } | null>(null);

  const queryClient = useQueryClient();

  const { user } = useAuth();
  const therapistId = user?.userId;

  // Asegurarse de que moment esté configurado en español
  useEffect(() => {
    moment.locale("es");
  }, []);

  const {
    data: events = [],
    isLoading,
    isError,
  } = useQuery<CalendarEvent[], Error>({
    queryKey: ["schedules"],
    queryFn: fetchSchedules,
  });

  // Mutación para crear un nuevo horario
  const createScheduleMutation = useMutation({
    mutationFn: createSchedule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
      toast.success("Horario creado exitosamente");
      handleModalClose();
    },
    onError: (error) => {
      toast.error(
        `Error al crear horario: ${error.message || "Intenta nuevamente"}`
      );
    },
  });

  // Mutación para actualizar un horario
  const updateScheduleMutation = useMutation({
    mutationFn: (variables: {
      scheduleId: number;
      data: CreateScheduleRequestDto;
    }) => updateSchedule(variables.scheduleId, variables.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
      toast.success("Horario actualizado exitosamente");
      handleModalClose();
    },
    onError: (error) => {
      toast.error(
        `Error al actualizar horario: ${error.message || "Intenta nuevamente"}`
      );
    },
  });

  const handleSelectSlot = (slotInfo: SlotInfo) => {
    setSelectedSlot({ start: slotInfo.start, end: slotInfo.end });
    setSelectedEvent(undefined);
    setModalOpen(true);
  };

  const handleSelectEvent = (event: RBCEvent) => {
    const calendarEvent = event as CalendarEvent;

    // Solo permitir abrir si el evento pertenece al terapeuta autenticado
    if (calendarEvent.userTherapistId !== therapistId) {
      toast.info("No puedes editar horarios de otros terapeutas");
      return;
    }

    setSelectedEvent(calendarEvent);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedSlot(null);
    setSelectedEvent(undefined);
  };

  const handleSaveEvent = (newEvent: CalendarEvent) => {
    if (!therapistId) {
      toast.error("No se pudo identificar al terapeuta");
      return;
    }

    const payload = {
      userTherapistId: therapistId,
      date: moment(newEvent.start).format("YYYY-MM-DD"),
      startTime: moment(newEvent.start).format("HH:mm"),
      endTime: moment(newEvent.end).format("HH:mm"),
    };

    if (selectedEvent) {
      // Si se está editando un horario existente
      updateScheduleMutation.mutate({
        scheduleId: selectedEvent.id,
        data: payload,
      });
    } else {
      // Si se está creando uno nuevo
      createScheduleMutation.mutate(payload);
    }
  };

  // Estados de carga y error
  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "calc(100vh - 140px)",
          gap: 2,
        }}
      >
        <CircularProgress color="primary" size={40} thickness={4} />
        <Typography variant="h6" color="text.secondary">
          Cargando horarios...
        </Typography>
      </Box>
    );
  }

  if (isError) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "calc(100vh - 140px)",
          p: 4,
        }}
      >
        <Alert
          severity="error"
          variant="filled"
          sx={{
            width: "100%",
            maxWidth: 500,
            borderRadius: 2,
            boxShadow: theme.shadows[1],
          }}
        >
          Ocurrió un error al cargar los horarios. Por favor, intenta
          nuevamente.
        </Alert>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "calc(100vh - 140px)",
        gap: 2,
      }}
    >
      {/* Leyenda */}
      <Legend />

      {/* Contenedor del calendario con posición relativa */}
      <Paper
        elevation={1}
        sx={{
          flex: 1,
          position: "relative",
          borderRadius: 2,
          overflow: "hidden",
          width: "100%",
          minHeight: "600px",
        }}
      >
        <Calendar<CalendarEvent>
          localizer={localizer}
          culture="es"
          events={events}
          startAccessor="start"
          endAccessor="end"
          selectable
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent}
          views={["month", "week", "day"]}
          defaultView="month"
          components={{ event: EventComponent }}
          messages={{
            allDay: "Todo el día",
            previous: "Anterior",
            next: "Siguiente",
            today: "Hoy",
            month: "Mes",
            week: "Semana",
            day: "Día",
            agenda: "Agenda",
            date: "Fecha",
            time: "Hora",
            event: "Evento",
            noEventsInRange: "No hay eventos en este rango",
            showMore: (count) => `+${count} más`,
          }}
          formats={{
            monthHeaderFormat: "MMMM YYYY",
            dayHeaderFormat: "dddd, D MMMM YYYY",
            dayRangeHeaderFormat: ({ start, end }) =>
              `${moment(start).format("D MMMM")} - ${moment(end).format(
                "D MMMM YYYY"
              )}`,
            dayFormat: "ddd D",
            weekdayFormat: "ddd",
          }}
          step={30}
          timeslots={2}
          min={new Date(0, 0, 0, 8, 0)} // 08:00
          max={new Date(0, 0, 0, 18, 0)} // 18:00
          className="custom-calendar"
        />
      </Paper>

      <EventModal
        open={modalOpen}
        therapistName={therapistName}
        onClose={handleModalClose}
        onSave={handleSaveEvent}
        eventData={
          selectedEvent ||
          (selectedSlot
            ? {
                id: Date.now(),
                title: "",
                start: selectedSlot.start,
                end: selectedSlot.end,
                userTherapistId: therapistId!,
              }
            : undefined)
        }
      />
    </Box>
  );
};

export default CalendarView;
