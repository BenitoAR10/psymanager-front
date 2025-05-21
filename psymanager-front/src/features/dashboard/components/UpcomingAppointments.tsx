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
  Tooltip,
  Stack,
} from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import EventNoteIcon from "@mui/icons-material/EventNote";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import { markSessionAsCompleted } from "../services/sessionsService";
import ScheduleIcon from "@mui/icons-material/Schedule";
import TodayIcon from "@mui/icons-material/Today";
import MedicalServicesOutlinedIcon from "@mui/icons-material/MedicalServicesOutlined";
import type { UpcomingAppointmentDto } from "../types";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import UpcomingAppointmentsModal from "./UpcomingAppointmentsModal";
import { useState } from "react";
import { toast } from "sonner";

/**
 * Interfaz que representa una cita programada.
 */
export type Appointment = UpcomingAppointmentDto;
/**
 * Props del componente UpcomingAppointments.
 */
interface UpcomingAppointmentsProps {
  appointments: Appointment[];
  onViewAll?: () => void;
  onStartTreatment?: (
    patientId: number,
    therapistId: number,
    patientName: string
  ) => void;
}

const isInProgress = (dateTimeStr: string) => {
  const now = new Date();
  const start = new Date(dateTimeStr);
  const end = new Date(start.getTime() + 60 * 60 * 1000); // +1h
  return now >= start && now <= end;
};

const isFuture = (dateTimeStr: string) => {
  const now = new Date();
  const start = new Date(dateTimeStr);
  return start > now;
};

const UpcomingAppointments: React.FC<UpcomingAppointmentsProps> = ({
  appointments,
  onViewAll,
  onStartTreatment,
}) => {
  const theme = useTheme();

  const [modalOpen, setModalOpen] = useState(false);

  const [completingId, setCompletingId] = useState<number | null>(null);

  const handleMarkCompleted = async (sessionId: number) => {
    setCompletingId(sessionId);
    try {
      await markSessionAsCompleted(sessionId);
      toast.success("Sesión marcada como completada");

      onViewAll?.();
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "No se pudo completar la sesión";
      toast.error(message);
    } finally {
      setCompletingId(null);
    }
  };

  const formatDateTime = (dateTimeStr: string) => {
    const date = new Date(dateTimeStr);
    return {
      dateFormatted: date.toLocaleDateString("es-ES", {
        weekday: "short",
        day: "numeric",
        month: "short",
      }),
      timeFormatted: date.toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  };

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);

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

  const getStatusIcon = (state: Appointment["state"], dateTime: string) => {
    if (isInProgress(dateTime)) {
      return <TodayIcon fontSize="small" />;
    }

    switch (state) {
      case "ACCEPTED":
        return <CheckCircleOutlineIcon fontSize="small" />;
      case "REJECTED":
        return <CancelOutlinedIcon fontSize="small" />;
      default:
        return <ScheduleIcon fontSize="small" />;
    }
  };

  // Función para obtener el texto de estado apropiado
  const getStatusText = (state: Appointment["state"], dateTime: string) => {
    if (isInProgress(dateTime)) {
      return "En curso";
    }

    if (state === "ACCEPTED" && isFuture(dateTime)) {
      return "Programada";
    }

    switch (state) {
      case "ACCEPTED":
        return "Confirmada";
      case "REJECTED":
        return "Cancelada";
      default:
        return "Pendiente";
    }
  };

  // Reordenar: primero en curso, luego las demás por fecha
  const sortedAppointments = [...appointments].sort((a, b) => {
    const aInProgress = isInProgress(a.dateTime);
    const bInProgress = isInProgress(b.dateTime);
    if (aInProgress && !bInProgress) return -1;
    if (!aInProgress && bInProgress) return 1;
    return new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime();
  });

  return (
    <Box sx={{ mt: 2 }}>
      {sortedAppointments.length === 0 ? (
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
            onClick={() => {
              setModalOpen(true);
              onViewAll?.();
            }}
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
            {sortedAppointments.map((appt, index) => {
              const { dateFormatted, timeFormatted } = formatDateTime(
                appt.dateTime
              );
              const status = getStatusText(appt.state, appt.dateTime);
              const isActive = isInProgress(appt.dateTime);

              return (
                <React.Fragment key={appt.appointmentId}>
                  <Tooltip
                    title={
                      appt.isPartOfTreatment
                        ? "Esta sesión ya forma parte de un tratamiento"
                        : "Iniciar tratamiento"
                    }
                    arrow
                  >
                    <ListItem
                      disableGutters
                      sx={{
                        py: 1.5,
                        px: 0.5,
                        borderRadius: 2,
                        transition:
                          "transform 0.25s ease, box-shadow 0.25s ease",
                        cursor: appt.isPartOfTreatment ? "default" : "pointer",
                        backgroundColor: isActive
                          ? alpha(theme.palette.info.light, 0.1)
                          : appt.isPartOfTreatment
                          ? alpha(theme.palette.grey[300], 0.2)
                          : "transparent",
                        "&:hover": appt.isPartOfTreatment
                          ? {}
                          : {
                              bgcolor: alpha(
                                theme.palette.background.default,
                                0.6
                              ),
                              transform: "translateY(-2px)",
                              boxShadow: theme.shadows[2],
                            },
                      }}
                      onClick={() => {
                        if (!appt.isPartOfTreatment) {
                          onStartTreatment?.(
                            appt.patientId,
                            appt.therapistId,
                            appt.studentName
                          );
                        }
                      }}
                    >
                      <Avatar
                        sx={{
                          ...getAvatarColor(appt.state),
                          width: 40,
                          height: 40,
                          mr: 2,
                          fontWeight: 600,
                          border: isActive
                            ? `2px solid ${theme.palette.info.main}`
                            : "none",
                        }}
                      >
                        {getInitials(appt.studentName)}
                      </Avatar>
                      <ListItemText
                        primary={
                          <Box display="flex" alignItems="center" gap={1}>
                            <Typography
                              variant="body1"
                              fontWeight={600}
                              color="text.primary"
                              sx={{ mb: 0.5, lineHeight: 1.2 }}
                            >
                              {appt.studentName}
                            </Typography>
                            {isInProgress(appt.dateTime) &&
                              !appt.isPartOfTreatment && (
                                <Button
                                  size="small"
                                  variant="outlined"
                                  color="success"
                                  disabled={completingId === appt.appointmentId}
                                  onClick={() =>
                                    handleMarkCompleted(appt.appointmentId)
                                  }
                                  sx={{
                                    ml: 2,
                                    textTransform: "none",
                                    borderRadius: 2,
                                  }}
                                >
                                  {completingId === appt.appointmentId
                                    ? "Guardando..."
                                    : "Completar"}
                                </Button>
                              )}

                            {appt.isPartOfTreatment && (
                              <Chip
                                icon={
                                  <MedicalServicesOutlinedIcon
                                    style={{ fontSize: 12 }}
                                  />
                                }
                                label="Tratamiento"
                                color="default"
                                size="small"
                                sx={{
                                  fontWeight: 600,
                                  fontSize: "0.7rem",
                                  height: 20,
                                  bgcolor: alpha(theme.palette.grey[600], 0.1),
                                  "& .MuiChip-icon": {
                                    color: theme.palette.grey[600],
                                  },
                                }}
                              />
                            )}
                          </Box>
                        }
                        secondary={
                          <Stack
                            direction="row"
                            spacing={2}
                            alignItems="center"
                          >
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
                        secondaryTypographyProps={{ component: "div" }}
                      />

                      <Chip
                        icon={getStatusIcon(appt.state, appt.dateTime)}
                        label={status}
                        size="small"
                        sx={{
                          ml: 1,
                          textTransform: "capitalize",
                          fontWeight: 600,
                          fontSize: "0.7rem",
                          height: 24,
                          bgcolor: isActive
                            ? alpha(theme.palette.info.main, 0.1)
                            : appt.state === "PENDING"
                            ? alpha(theme.palette.warning.main, 0.1)
                            : appt.state === "ACCEPTED"
                            ? alpha(theme.palette.success.main, 0.1)
                            : alpha(theme.palette.error.main, 0.1),
                          color: isActive
                            ? theme.palette.info.dark
                            : appt.state === "PENDING"
                            ? theme.palette.warning.dark
                            : appt.state === "ACCEPTED"
                            ? theme.palette.success.dark
                            : theme.palette.error.dark,
                          "& .MuiChip-icon": {
                            fontSize: 14,
                          },
                          border: isActive
                            ? `1px solid ${alpha(theme.palette.info.main, 0.3)}`
                            : "none",
                        }}
                      />
                    </ListItem>
                  </Tooltip>
                  {index < sortedAppointments.length - 1 && (
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
          <UpcomingAppointmentsModal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            appointments={appointments}
          />
        </Box>
      )}
    </Box>
  );
};

export default UpcomingAppointments;
