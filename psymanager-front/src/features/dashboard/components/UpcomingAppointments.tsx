"use client";

import React from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
  Chip,
  Divider,
  alpha,
  useTheme,
  Avatar,
  Stack,
} from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import EventNoteIcon from "@mui/icons-material/EventNote";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import ScheduleIcon from "@mui/icons-material/Schedule";
import type { UpcomingAppointmentDto } from "../types";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";

/**
 * Interfaz que representa una cita programada.
 */
export type Appointment = UpcomingAppointmentDto;

/**
 * Props del componente UpcomingAppointments.
 */
interface UpcomingAppointmentsProps {
  /** Lista de hasta 5 próximas citas */
  appointments: Appointment[];
  /** Manejador para el botón "Ver todas" */
  onViewAll?: () => void;
}

/**
 * UpcomingAppointments muestra una lista de las próximas citas programadas.
 * Si no hay citas, muestra un mensaje de fallback.
 * Incluye un botón "Ver todas" para manejar la navegación.
 */
const UpcomingAppointments: React.FC<UpcomingAppointmentsProps> = ({
  appointments,
  onViewAll,
}) => {
  const theme = useTheme();

  // Función para formatear la fecha y hora de manera más legible
  const formatDateTime = (dateTimeStr: string) => {
    const date = new Date(dateTimeStr);

    // Formatear fecha: "lun, 5 may"
    const dateFormatted = date.toLocaleDateString("es-ES", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });

    // Formatear hora: "15:30"
    const timeFormatted = date.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    });

    return { dateFormatted, timeFormatted };
  };

  // Función para obtener las iniciales del nombre
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  // Función para obtener el color del avatar según el estado
  const getAvatarColor = (state: Appointment["state"]) => {
    switch (state) {
      case "ACCEPTED":
        return {
          bgcolor: alpha(theme.palette.success.main, 0.1),
          color: theme.palette.success.main,
        };
      case "REJECTED":
        return {
          bgcolor: alpha(theme.palette.error.main, 0.1),
          color: theme.palette.error.main,
        };
      default:
        return {
          bgcolor: alpha(theme.palette.warning.main, 0.1),
          color: theme.palette.warning.main,
        };
    }
  };

  // Función para obtener el icono según el estado
  const getStatusIcon = (state: Appointment["state"]) => {
    switch (state) {
      case "ACCEPTED":
        return <CheckCircleOutlineIcon fontSize="small" />;
      case "REJECTED":
        return <CancelOutlinedIcon fontSize="small" />;
      default:
        return <ScheduleIcon fontSize="small" />;
    }
  };

  return (
    <Box sx={{ mt: 2 }}>
      {appointments.length === 0 ? (
        <Box
          sx={{
            textAlign: "center",
            py: 4,
            px: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: 2,
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 1,
            }}
          >
            <CalendarTodayOutlinedIcon
              sx={{ color: theme.palette.primary.main, fontSize: 28 }}
            />
          </Box>
          <Typography variant="h6" fontWeight={600} color="text.primary">
            Sin citas próximas
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ maxWidth: 280, mx: "auto" }}
          >
            No tienes citas programadas para los próximos días. Puedes revisar
            todas tus citas en el calendario.
          </Typography>
          <Button
            variant="outlined"
            color="primary"
            endIcon={<ArrowForwardIosIcon sx={{ fontSize: 14 }} />}
            onClick={onViewAll}
            sx={{
              mt: 1,
              borderRadius: 2,
              px: 3,
              py: 0.75,
              fontWeight: 600,
              borderWidth: "1.5px",
              "&:hover": {
                borderWidth: "1.5px",
                bgcolor: alpha(theme.palette.primary.main, 0.05),
              },
            }}
          >
            Ver todas
          </Button>
        </Box>
      ) : (
        <Box>
          <List disablePadding>
            {appointments.map((appt, index) => {
              const { dateFormatted, timeFormatted } = formatDateTime(
                appt.dateTime
              );

              return (
                <React.Fragment key={appt.appointmentId}>
                  <ListItem
                    disableGutters
                    sx={{
                      py: 1.5,
                      px: 0.5,
                      borderRadius: 1,
                      transition: "all 0.2s ease",
                      "&:hover": {
                        bgcolor: alpha(theme.palette.background.default, 0.6),
                      },
                    }}
                  >
                    <Avatar
                      sx={{
                        ...getAvatarColor(appt.state),
                        width: 40,
                        height: 40,
                        mr: 2,
                        fontWeight: 600,
                      }}
                    >
                      {getInitials(appt.studentName)}
                    </Avatar>
                    <ListItemText
                      primary={
                        <Typography
                          variant="body1"
                          fontWeight={600}
                          color="text.primary"
                          sx={{ mb: 0.5, lineHeight: 1.2 }}
                        >
                          {appt.studentName}
                        </Typography>
                      }
                      secondary={
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 0.5,
                            }}
                          >
                            <AccessTimeIcon
                              sx={{ fontSize: 14, color: "text.secondary" }}
                            />
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {timeFormatted}
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 0.5,
                            }}
                          >
                            <EventNoteIcon
                              sx={{ fontSize: 14, color: "text.secondary" }}
                            />
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{ textTransform: "capitalize" }}
                            >
                              {dateFormatted}
                            </Typography>
                          </Box>
                        </Stack>
                      }
                      secondaryTypographyProps={{
                        component: "div",
                      }}
                    />

                    <Chip
                      icon={getStatusIcon(appt.state)}
                      label={
                        appt.state === "PENDING"
                          ? "Pendiente"
                          : appt.state === "ACCEPTED"
                          ? "Confirmada"
                          : "Rechazada"
                      }
                      size="small"
                      sx={{
                        ml: 1,
                        textTransform: "capitalize",
                        fontWeight: 600,
                        fontSize: "0.7rem",
                        height: 24,
                        bgcolor:
                          appt.state === "PENDING"
                            ? alpha(theme.palette.warning.main, 0.1)
                            : appt.state === "ACCEPTED"
                            ? alpha(theme.palette.success.main, 0.1)
                            : alpha(theme.palette.error.main, 0.1),
                        color:
                          appt.state === "PENDING"
                            ? theme.palette.warning.dark
                            : appt.state === "ACCEPTED"
                            ? theme.palette.success.dark
                            : theme.palette.error.dark,
                        "& .MuiChip-icon": {
                          fontSize: 14,
                        },
                      }}
                    />
                  </ListItem>
                  {index < appointments.length - 1 && (
                    <Divider sx={{ opacity: 0.6 }} />
                  )}
                </React.Fragment>
              );
            })}
          </List>
          <Box sx={{ textAlign: "right", mt: 2 }}>
            <Button
              variant="text"
              color="primary"
              endIcon={<ArrowForwardIosIcon sx={{ fontSize: 14 }} />}
              onClick={onViewAll}
              sx={{
                fontWeight: 600,
                "&:hover": {
                  bgcolor: alpha(theme.palette.primary.main, 0.05),
                },
              }}
            >
              Ver todas
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default UpcomingAppointments;
