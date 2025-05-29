"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  Button,
  Chip,
  Divider,
  alpha,
  useTheme,
  Avatar,
  Stack,
  Skeleton,
  Fade,
} from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import EventNoteIcon from "@mui/icons-material/EventNote";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import { markSessionAsCompleted } from "../services/sessionsService";
import ScheduleIcon from "@mui/icons-material/Schedule";
import TodayIcon from "@mui/icons-material/Today";
import type { UpcomingAppointmentDto } from "../types";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import UpcomingAppointmentsModal from "./UpcomingAppointmentsModal";
import { toast } from "sonner";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import CheckIcon from "@mui/icons-material/Check";

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
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);

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

  const shouldKeepVisible = (appt: Appointment) => {
    const start = new Date(appt.dateTime);
    const end = new Date(start.getTime() + 60 * 60 * 1000); // duración 1h
    const now = new Date();

    // Mostrar si la sesión está en curso
    if (now >= start && now <= end) return true;

    // Mostrar si la sesión fue completada y estamos dentro de 10 minutos después
    if (
      appt.state === "COMPLETED" &&
      now <= new Date(end.getTime() + 10 * 60 * 1000)
    ) {
      return true;
    }

    // Mostrar si todavía no terminó
    return now <= end;
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
  const sortedAppointments = appointments
    .filter(shouldKeepVisible)
    .sort((a, b) => {
      const aInProgress = isInProgress(a.dateTime);
      const bInProgress = isInProgress(b.dateTime);
      if (aInProgress && !bInProgress) return -1;
      if (!aInProgress && bInProgress) return 1;
      return new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime();
    })
    .slice(0, 5);

  return (
    <Box sx={{ height: "100%" }}>
      {sortedAppointments.length === 0 ? (
        <Fade in={true} timeout={800}>
          <Box
            sx={{
              textAlign: "center",
              py: 4,
              px: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
              borderRadius: 3,
              bgcolor: alpha(theme.palette.background.paper, 0.8),
              boxShadow: `0 4px 20px ${alpha(
                theme.palette.common.black,
                0.08
              )}`,
            }}
          >
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: 2,
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 1,
                boxShadow: `0 4px 12px ${alpha(
                  theme.palette.primary.main,
                  0.15
                )}`,
              }}
            >
              <CalendarTodayOutlinedIcon
                sx={{ color: theme.palette.primary.main, fontSize: 32 }}
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
                  transform: "translateY(-2px)",
                  boxShadow: `0 4px 8px ${alpha(
                    theme.palette.primary.main,
                    0.15
                  )}`,
                },
                transition: "all 0.2s ease",
              }}
            >
              Ver todas
            </Button>
          </Box>
        </Fade>
      ) : (
        <Box>
          <List
            disablePadding
            sx={{
              borderRadius: 3,
              overflow: "hidden",
              bgcolor: alpha(theme.palette.background.paper, 0.8),
              boxShadow: `0 4px 20px ${alpha(
                theme.palette.common.black,
                0.08
              )}`,
            }}
          >
            {sortedAppointments.map((appt, index) => {
              const { dateFormatted, timeFormatted } = formatDateTime(
                appt.dateTime
              );
              const now = new Date();
              const startTime = new Date(appt.dateTime);
              const canMarkComplete = now >= startTime;
              const canStartTreatment =
                appt.state === "COMPLETED" && !appt.isPartOfTreatment;

              const status = getStatusText(appt.state, appt.dateTime);
              const isActive = isInProgress(appt.dateTime);
              const isHovered = hoveredItem === appt.appointmentId;

              return (
                <React.Fragment key={appt.appointmentId}>
                  <ListItem
                    disableGutters
                    onMouseEnter={() => setHoveredItem(appt.appointmentId)}
                    onMouseLeave={() => setHoveredItem(null)}
                    sx={{
                      py: 2,
                      px: 2,
                      transition: "all 0.25s ease",
                      backgroundColor: isActive
                        ? alpha(theme.palette.info.light, 0.08)
                        : appt.isPartOfTreatment
                        ? alpha(theme.palette.grey[300], 0.1)
                        : isHovered
                        ? alpha(theme.palette.primary.light, 0.05)
                        : "transparent",
                      alignItems: "flex-start",
                      flexWrap: "wrap",
                      position: "relative",
                      boxShadow: isActive
                        ? `0 0 0 1px ${alpha(
                            theme.palette.info.main,
                            0.2
                          )}, 0 4px 12px ${alpha(
                            theme.palette.info.main,
                            0.15
                          )}`
                        : isHovered
                        ? `0 2px 8px ${alpha(theme.palette.primary.main, 0.1)}`
                        : "none",
                      "&:hover": {
                        boxShadow: isActive
                          ? `0 0 0 1px ${alpha(
                              theme.palette.info.main,
                              0.3
                            )}, 0 6px 16px ${alpha(
                              theme.palette.info.main,
                              0.2
                            )}`
                          : `0 4px 12px ${alpha(
                              theme.palette.primary.main,
                              0.15
                            )}`,
                      },
                    }}
                  >
                    {/* Indicador visual para citas en curso */}
                    {isActive && (
                      <Box
                        sx={{
                          position: "absolute",
                          top: 0,
                          right: 0,
                          width: 0,
                          height: 0,
                          borderStyle: "solid",
                          borderWidth: "0 24px 24px 0",
                          borderColor: `transparent ${theme.palette.info.main} transparent transparent`,
                          zIndex: 1,
                        }}
                      />
                    )}

                    <Avatar
                      sx={{
                        ...getAvatarColor(appt.state),
                        width: 44,
                        height: 44,
                        mr: 2,
                        fontWeight: 600,
                        border: isActive
                          ? `2px solid ${theme.palette.info.main}`
                          : "none",
                        boxShadow: isActive
                          ? `0 0 0 2px ${alpha(theme.palette.info.main, 0.2)}`
                          : "none",
                        transition: "all 0.2s ease",
                        transform: isHovered ? "scale(1.05)" : "scale(1)",
                      }}
                    >
                      {getInitials(appt.studentName)}
                    </Avatar>

                    <Box sx={{ flexGrow: 1 }}>
                      <Typography
                        variant="body1"
                        fontWeight={600}
                        color={isActive ? "info.dark" : "text.primary"}
                        sx={{
                          transition: "color 0.2s ease",
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        {(() => {
                          const parts = appt.studentName?.trim().split(" ").filter(Boolean) ?? [];
                          return parts.length >= 2
                              ? `${parts[0]} ${parts[1][0]}.`
                              : parts[0] ?? "Sin nombre";
                        })()}
                        {isActive && (
                          <Box
                            component="span"
                            sx={{
                              display: "inline-flex",
                              alignItems: "center",
                              fontSize: "0.75rem",
                              fontWeight: 500,
                              color: "info.main",
                              bgcolor: alpha(theme.palette.info.main, 0.1),
                              px: 1,
                              py: 0.25,
                              borderRadius: 1,
                              ml: 1,
                            }}
                          >
                            <Box
                              component="span"
                              sx={{
                                width: 6,
                                height: 6,
                                borderRadius: "50%",
                                bgcolor: "info.main",
                                mr: 0.5,
                                animation: "pulse 1.5s infinite",
                                "@keyframes pulse": {
                                  "0%": {
                                    transform: "scale(0.95)",
                                    boxShadow:
                                      "0 0 0 0 rgba(66, 165, 245, 0.7)",
                                  },
                                  "70%": {
                                    transform: "scale(1)",
                                    boxShadow:
                                      "0 0 0 6px rgba(66, 165, 245, 0)",
                                  },
                                  "100%": {
                                    transform: "scale(0.95)",
                                    boxShadow: "0 0 0 0 rgba(66, 165, 245, 0)",
                                  },
                                },
                              }}
                            />
                            En curso
                          </Box>
                        )}
                      </Typography>

                      <Stack
                        direction="row"
                        spacing={2}
                        alignItems="center"
                        mt={0.5}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                            color: isActive ? "info.dark" : "text.secondary",
                          }}
                        >
                          <AccessTimeIcon sx={{ fontSize: 14 }} />
                          <Typography
                            variant="caption"
                            sx={{
                              fontWeight: isActive ? 600 : 400,
                            }}
                          >
                            {timeFormatted}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                            color: isActive ? "info.dark" : "text.secondary",
                          }}
                        >
                          <EventNoteIcon sx={{ fontSize: 14 }} />
                          <Typography
                            variant="caption"
                            sx={{
                              textTransform: "capitalize",
                              fontWeight: isActive ? 600 : 400,
                            }}
                          >
                            {dateFormatted}
                          </Typography>
                        </Box>
                      </Stack>
                    </Box>

                    <Chip
                      icon={getStatusIcon(appt.state, appt.dateTime)}
                      label={status}
                      size="small"
                      sx={{
                        mr: 1,
                        mt: 0.5,
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
                        boxShadow: isActive
                          ? `0 2px 4px ${alpha(theme.palette.info.main, 0.15)}`
                          : "none",
                      }}
                    />

                    {/* Acciones si no está en tratamiento */}
                    {!appt.isPartOfTreatment && (
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: { xs: "column", sm: "row" },
                          alignItems: "center",
                          gap: 1,
                          ml: 2,
                          mt: 0.5,
                        }}
                      >
                        <Fade
                          in={canMarkComplete && appt.state !== "COMPLETED"}
                          timeout={300}
                          unmountOnExit
                        >
                          <Button
                            variant="outlined"
                            size="small"
                            color="success"
                            disabled={completingId === appt.appointmentId}
                            onClick={() =>
                              handleMarkCompleted(appt.appointmentId)
                            }
                            startIcon={<CheckIcon fontSize="small" />}
                            sx={{
                              textTransform: "none",
                              borderRadius: 2,
                              borderWidth: "1.5px",
                              "&:hover": {
                                borderWidth: "1.5px",
                                bgcolor: alpha(
                                  theme.palette.success.main,
                                  0.08
                                ),
                              },
                              transition: "all 0.2s ease",
                              px: 1.5,
                            }}
                          >
                            {completingId === appt.appointmentId ? (
                              <>
                                <Skeleton
                                  width={16}
                                  height={16}
                                  sx={{ mr: 1 }}
                                />
                                Guardando...
                              </>
                            ) : (
                              "Completar"
                            )}
                          </Button>
                        </Fade>

                        <Fade
                          in={canStartTreatment}
                          timeout={300}
                          unmountOnExit
                        >
                          <Button
                            variant="contained"
                            size="small"
                            color="primary"
                            onClick={() =>
                              onStartTreatment?.(
                                appt.patientId,
                                appt.therapistId,
                                appt.studentName
                              )
                            }
                            startIcon={<PlayArrowIcon fontSize="small" />}
                            sx={{
                              textTransform: "none",
                              borderRadius: 2,
                              boxShadow: isHovered
                                ? `0 4px 8px ${alpha(
                                    theme.palette.primary.main,
                                    0.25
                                  )}`
                                : `0 2px 4px ${alpha(
                                    theme.palette.primary.main,
                                    0.15
                                  )}`,
                              transition: "all 0.2s ease",
                              "&:hover": {
                                transform: "translateY(-2px)",
                                boxShadow: `0 6px 12px ${alpha(
                                  theme.palette.primary.main,
                                  0.3
                                )}`,
                              },
                              px: 1.5,
                            }}
                          >
                            Iniciar tratamiento
                          </Button>
                        </Fade>
                      </Box>
                    )}
                  </ListItem>

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
                  transform: "translateX(4px)",
                },
                transition: "all 0.2s ease",
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
