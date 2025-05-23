"use client";

import type React from "react";
import { useState, useMemo } from "react";
import {
  Box,
  Typography,
  IconButton,
  useTheme,
  alpha,
  Tooltip,
  Fade,
  Badge,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";

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
  const [hoveredDay, setHoveredDay] = useState<string | null>(null);

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
  const offset = jsFirstDay === 0 ? 6 : jsFirstDay - 1;

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

  // Función para obtener el número de eventos en un día específico
  const getEventCount = (day: number) => {
    const date = new Date(displayedYear, displayedMonth, day);
    const iso = date.toISOString().slice(0, 10);

    // Contar cuántos eventos hay en este día
    return eventDates.filter((d) => d.toISOString().slice(0, 10) === iso)
      .length;
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        borderRadius: 3,
        p: 2,
        bgcolor: alpha(theme.palette.background.paper, 0.8),
        boxShadow: `0 4px 20px ${alpha(theme.palette.common.black, 0.08)}`,
        transition: "box-shadow 0.3s ease",
        display: "flex",
        flexDirection: "column",
        "&:hover": {
          boxShadow: `0 6px 24px ${alpha(theme.palette.common.black, 0.12)}`,
        },
      }}
    >
      {/* Cabecera con mes/año y flechas */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
          pb: 1.5,
          borderBottom: "1px solid",
          borderColor: alpha(theme.palette.divider, 0.6),
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: 1.5,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: alpha(theme.palette.primary.main, 0.1),
            }}
          >
            <EventAvailableIcon
              sx={{ color: theme.palette.primary.main, fontSize: 18 }}
            />
          </Box>
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
        </Box>
        <Box sx={{ display: "flex", gap: 0.5 }}>
          <Tooltip title="Mes anterior" arrow>
            <IconButton
              size="small"
              onClick={prevMonth}
              sx={{
                color: "text.secondary",
                p: 0.5,
                "&:hover": {
                  color: "primary.main",
                  bgcolor: alpha(theme.palette.primary.main, 0.08),
                },
                transition: "all 0.2s ease",
              }}
            >
              <ChevronLeftIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Mes siguiente" arrow>
            <IconButton
              size="small"
              onClick={nextMonth}
              sx={{
                color: "text.secondary",
                p: 0.5,
                "&:hover": {
                  color: "primary.main",
                  bgcolor: alpha(theme.palette.primary.main, 0.08),
                },
                transition: "all 0.2s ease",
              }}
            >
              <ChevronRightIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Encabezado de días de la semana */}
      <Box sx={{ display: "flex", mb: 1.5 }}>
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
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: "6px", // similar a spacing={0.75}
          justifyContent: "flex-start",
        }}
      >
        {calendarCells.map((day, idx) => {
          const cellWidth = "calc((100% - 6 * 6px) / 7)"; // 7 columnas, 6 gaps

          if (day === null) {
            return (
              <Box
                key={`blank-${idx}`}
                sx={{
                  width: cellWidth,
                  height: 36,
                }}
              />
            );
          }

          const cellDate = new Date(displayedYear, displayedMonth, day);
          const iso = cellDate.toISOString().slice(0, 10);
          const isHovered = hoveredDay === iso;

          const isToday = cellDate.toDateString() === today.toDateString();
          const hasEvent = eventSet.has(iso);
          const eventCount = getEventCount(day);

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
                width: cellWidth,
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Tooltip
                title={
                  isToday
                    ? "Hoy"
                    : hasEvent
                    ? `${eventCount} ${eventCount === 1 ? "cita" : "citas"}`
                    : ""
                }
                arrow
                placement="top"
                open={isHovered || undefined}
              >
                <Box
                  onMouseEnter={() => setHoveredDay(iso)}
                  onMouseLeave={() => setHoveredDay(null)}
                  onClick={() => onDateClick?.(cellDate)}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: 36,
                    width: 36,
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
                            ? alpha(theme.palette.secondary.main, 0.8)
                            : alpha(theme.palette.grey[200], 0.8),
                          transform: "scale(1.1)",
                          boxShadow:
                            isToday || hasEvent
                              ? `0 2px 6px ${alpha(
                                  theme.palette.primary.main,
                                  0.3
                                )}`
                              : "none",
                        }
                      : {},
                  }}
                >
                  {hasEvent && eventCount > 1 ? (
                    <Badge
                      badgeContent={eventCount}
                      color="error"
                      sx={{
                        "& .MuiBadge-badge": {
                          fontSize: "0.6rem",
                          height: 16,
                          minWidth: 16,
                          top: -2,
                          right: -2,
                        },
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{
                          fontWeight: isToday || hasEvent ? 600 : 400,
                          fontSize: "0.85rem",
                        }}
                      >
                        {day}
                      </Typography>
                    </Badge>
                  ) : (
                    <Typography
                      variant="caption"
                      sx={{
                        fontWeight: isToday || hasEvent ? 600 : 400,
                        fontSize: "0.85rem",
                      }}
                    >
                      {day}
                    </Typography>
                  )}
                </Box>
              </Tooltip>
            </Box>
          );
        })}
      </Box>

      {/* Leyenda simplificada - solo si hay eventos */}
      {eventDates.length > 0 && (
        <Fade in={true} timeout={800}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: 2,
              mt: 2,
              pt: 1.5,
              borderTop: "1px solid",
              borderColor: alpha(theme.palette.divider, 0.6),
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
                  bgcolor: theme.palette.primary.main,
                  boxShadow: `0 0 0 2px ${alpha(
                    theme.palette.primary.main,
                    0.2
                  )}`,
                }}
              />
              <Typography
                variant="caption"
                color="text.secondary"
                fontWeight={500}
              >
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
                  boxShadow: `0 0 0 2px ${alpha(
                    theme.palette.secondary.main,
                    0.2
                  )}`,
                }}
              />
              <Typography
                variant="caption"
                color="text.secondary"
                fontWeight={500}
              >
                Próximas citas
              </Typography>
            </Box>
          </Box>
        </Fade>
      )}
    </Box>
  );
};

export default CalendarWidget;
