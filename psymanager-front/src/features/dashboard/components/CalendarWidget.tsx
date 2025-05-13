"use client";

import type React from "react";
import { useState, useMemo } from "react";
import {
  Box,
  Grid,
  Typography,
  IconButton,
  useTheme,
  alpha,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

interface CalendarWidgetProps {
  /** Fechas completas a resaltar (p.ej. citas) */
  eventDates?: Date[];
  /** Función opcional al hacer clic en un día */
  onDateClick?: (date: Date) => void;
}

const CalendarWidget: React.FC<CalendarWidgetProps> = ({
  eventDates = [],
  onDateClick,
}) => {
  const theme = useTheme();
  const today = new Date();

  // Estado para mes/año mostrados
  const [displayedMonth, setDisplayedMonth] = useState(today.getMonth());
  const [displayedYear, setDisplayedYear] = useState(today.getFullYear());

  // Cabecera
  const headerLabel = useMemo(
    () =>
      new Date(displayedYear, displayedMonth).toLocaleString("es-ES", {
        month: "long",
        year: "numeric",
      }),
    [displayedYear, displayedMonth]
  );

  // Calcula días en mes y offset para el 1er día
  const daysInMonth = new Date(displayedYear, displayedMonth + 1, 0).getDate();
  const jsFirstDay = new Date(displayedYear, displayedMonth, 1).getDay();
  const offset = (jsFirstDay + 6) % 7; // lunes=0 … domingo=6

  // Prepara un Set de strings "YYYY-MM-DD" para lookup rápido
  const eventSet = useMemo(() => {
    return new Set(
      eventDates.map(
        (d) => d.toISOString().slice(0, 10) // "YYYY-MM-DD"
      )
    );
  }, [eventDates]);

  // Navegación de meses
  const prevMonth = () =>
    displayedMonth === 0
      ? (setDisplayedMonth(11), setDisplayedYear(displayedYear - 1))
      : setDisplayedMonth(displayedMonth - 1);

  const nextMonth = () =>
    displayedMonth === 11
      ? (setDisplayedMonth(0), setDisplayedYear(displayedYear + 1))
      : setDisplayedMonth(displayedMonth + 1);

  // Genera las celdas del calendario (offset + días)
  const calendarCells: (number | null)[] = [
    ...Array(offset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  // Determinar si estamos en el mes actual
  const isCurrentMonth =
    displayedMonth === today.getMonth() &&
    displayedYear === today.getFullYear();

  return (
    <Box sx={{ width: "100%" }}>
      {/* Cabecera con mes/año y flechas */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
          pb: 1,
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 600,
            color: "text.primary",
            textTransform: "capitalize",
          }}
        >
          {headerLabel}
        </Typography>
        <Box sx={{ display: "flex", gap: 0.5 }}>
          <IconButton
            size="small"
            onClick={prevMonth}
            sx={{
              color: "text.secondary",
              p: 0.5,
              "&:hover": {
                color: "primary.main",
              },
            }}
          >
            <ChevronLeftIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={nextMonth}
            sx={{
              color: "text.secondary",
              p: 0.5,
              "&:hover": {
                color: "primary.main",
              },
            }}
          >
            <ChevronRightIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      {/* Encabezado de días de la semana */}
      <Box sx={{ display: "flex", mb: 1 }}>
        {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map((d) => (
          <Box
            key={d}
            sx={{
              width: "14.28%",
              textAlign: "center",
            }}
          >
            <Typography
              variant="caption"
              sx={{
                display: "block",
                color: "text.secondary",
                fontWeight: 600,
                fontSize: "0.7rem",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              {d}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Celdas del calendario */}
      <Grid container spacing={0.5}>
        {calendarCells.map((day, idx) => {
          if (day === null) {
            // Celda en blanco para offset
            return (
              <Box
                key={`blank-${idx}`}
                sx={{
                  width: "14.28%",
                  height: 32,
                }}
              />
            );
          }

          // Fecha completa de la celda
          const cellDate = new Date(displayedYear, displayedMonth, day);
          const iso = cellDate.toISOString().slice(0, 10);

          // Flags
          const isToday = cellDate.toDateString() === today.toDateString();
          const hasEvent = eventSet.has(iso);

          // **Diferenciar colores**:
          let bgColor = "transparent";
          if (isToday) bgColor = theme.palette.primary.main;
          else if (hasEvent) bgColor = theme.palette.secondary.main;

          const textColor =
            isToday || hasEvent
              ? theme.palette.common.white
              : theme.palette.text.primary;

          return (
            <Box
              key={iso}
              sx={{
                width: "14.28%",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Box
                onClick={() => onDateClick?.(cellDate)}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: 32,
                  width: 32,
                  borderRadius: "50%",
                  mx: "auto",
                  cursor: onDateClick ? "pointer" : "default",
                  transition: "all 0.2s ease",
                  bgcolor: bgColor,
                  color: textColor,
                  position: "relative",
                  border: isToday
                    ? "none"
                    : isCurrentMonth && day === today.getDate() && !hasEvent
                    ? `2px solid ${alpha(theme.palette.primary.main, 0.3)}`
                    : "none",
                  "&:hover": onDateClick
                    ? {
                        bgcolor: isToday
                          ? theme.palette.primary.dark
                          : hasEvent
                          ? alpha(theme.palette.primary.main, 0.8)
                          : "grey.100",
                        transform: "scale(1.1)",
                      }
                    : {},
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: isToday || hasEvent ? 600 : 400,
                    fontSize: "0.8rem",
                  }}
                >
                  {day}
                </Typography>
              </Box>
            </Box>
          );
        })}
      </Grid>

      {/* Leyenda simplificada - solo si hay eventos */}
      {eventDates.length > 0 && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 2,
            mt: 2,
            pt: 1,
            borderTop: "1px solid",
            borderColor: "divider",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <Box
              component="span"
              sx={{
                display: "inline-block",
                width: 8,
                height: 8,
                borderRadius: "50%",
                bgcolor: "primary.main",
              }}
            />
            <Typography variant="caption" color="text.secondary">
              Hoy
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <Box
              component="span"
              sx={{
                display: "inline-block",
                width: 8,
                height: 8,
                borderRadius: "50%",
                bgcolor: theme.palette.secondary.main,
              }}
            />
            <Typography variant="caption" color="text.secondary">
              Proximas citas
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default CalendarWidget;
