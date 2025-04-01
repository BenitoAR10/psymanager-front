"use client";

import type React from "react";
import { useState } from "react";
import {
  Calendar,
  momentLocalizer,
  type SlotInfo,
  type Event as RBCEvent,
} from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Box, Paper } from "@mui/material";
import type { CalendarEvent } from "../types";
import EventModal from "./EventModal";
import "./calendar-styles.css"; // Importamos los estilos personalizados

const localizer = momentLocalizer(moment);

// Componente personalizado para los eventos
const EventComponent = ({ event }: { event: CalendarEvent }) => (
  <Box
    sx={{
      backgroundColor: "#4DB6AC",
      color: "white",
      padding: "4px 8px",
      borderRadius: "4px",
      fontSize: "0.85rem",
      fontWeight: 500,
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      border: "none",
      boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
    }}
  >
    {event.title}
  </Box>
);

const CalendarView: React.FC = () => {
  // Estado con eventos simulados
  const [events, setEvents] = useState<CalendarEvent[]>([
    {
      id: 1,
      title: "Evento de prueba",
      start: new Date(
        moment().add(1, "days").set({ hour: 9, minute: 0 }).toISOString()
      ),
      end: new Date(
        moment().add(1, "days").set({ hour: 10, minute: 0 }).toISOString()
      ),
    },
  ]);

  // Control del modal
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | undefined>(
    undefined
  );
  const [selectedSlot, setSelectedSlot] = useState<{
    start: Date;
    end: Date;
  } | null>(null);

  const handleSelectSlot = (slotInfo: SlotInfo) => {
    setSelectedSlot({ start: slotInfo.start, end: slotInfo.end });
    setSelectedEvent(undefined);
    setModalOpen(true);
  };

  const handleSelectEvent = (event: RBCEvent) => {
    setSelectedEvent(event as CalendarEvent);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedSlot(null);
    setSelectedEvent(undefined);
  };

  const handleSaveEvent = (newEvent: CalendarEvent) => {
    setEvents((prevEvents) => {
      const exists = prevEvents.find((e) => e.id === newEvent.id);
      if (exists) {
        // Actualiza evento
        return prevEvents.map((e) => (e.id === newEvent.id ? newEvent : e));
      }
      // Agrega nuevo evento
      return [...prevEvents, newEvent];
    });
  };

  // Personalización de los componentes del calendario
  const calendarComponents = {
    event: EventComponent,
  };

  return (
    <Box
      sx={{
        height: "calc(100vh - 120px)", // Altura para ocupar todo el espacio disponible
        width: "100%", // Aseguramos que ocupe todo el ancho
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Paper
        elevation={0}
        sx={{
          flex: 1,
          p: 2,
          borderRadius: 2,
          border: "1px solid #f0f0f0",
          overflow: "hidden",
          width: "100%", // Aseguramos que el Paper ocupe todo el ancho
        }}
      >
        <Box
          sx={{
            width: "100%", // Aseguramos que este Box ocupe todo el ancho
            height: "100%",
            overflow: "hidden",
          }}
        >
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{
              height: "100%",
              width: "100%", // Aseguramos que el calendario ocupe todo el ancho
            }}
            selectable
            onSelectSlot={handleSelectSlot}
            onSelectEvent={handleSelectEvent}
            views={["month", "week", "day"]}
            defaultView="month"
            components={calendarComponents}
            formats={{
              dayHeaderFormat: (date: Date) =>
                moment(date).format("dddd, D MMMM"),
              dayRangeHeaderFormat: ({
                start,
                end,
              }: {
                start: Date;
                end: Date;
              }) =>
                `${moment(start).format("D MMMM")} - ${moment(end).format(
                  "D MMMM YYYY"
                )}`,
            }}
            className="custom-calendar"
          />
        </Box>
      </Paper>
      <EventModal
        open={modalOpen}
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
              }
            : undefined)
        }
      />
    </Box>
  );
};

export default CalendarView;
