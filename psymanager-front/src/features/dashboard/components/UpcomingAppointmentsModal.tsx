"use client";

import React from "react";

import type { FC } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Typography,
  Avatar,
  useTheme,
  Chip,
  Divider,
  Box,
  alpha,
  Tooltip,
  Stack,
  DialogActions,
  Button,
  Paper,
  InputBase,
  InputAdornment,
  Tab,
  Tabs,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import EventNoteIcon from "@mui/icons-material/EventNote";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import ScheduleIcon from "@mui/icons-material/Schedule";
import SearchIcon from "@mui/icons-material/Search";
import TodayIcon from "@mui/icons-material/Today";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import MedicalServicesOutlinedIcon from "@mui/icons-material/MedicalServicesOutlined";
import type { UpcomingAppointmentDto } from "../types";
import { useState, useMemo } from "react";

interface UpcomingAppointmentsModalProps {
  open: boolean;
  onClose: () => void;
  appointments: UpcomingAppointmentDto[];
  highlightedId?: number | null;
  onStartTreatment?: (
    patientId: number,
    therapistId: number,
    patientName: string
  ) => void;
}

// Función para verificar si una cita está en curso
const isInProgress = (dateTimeStr: string) => {
  const now = new Date();
  const start = new Date(dateTimeStr);
  const end = new Date(start.getTime() + 60 * 60 * 1000); // +1h
  return now >= start && now <= end;
};

// Función para verificar si una cita es futura
const isFuture = (dateTimeStr: string) => {
  const now = new Date();
  const start = new Date(dateTimeStr);
  return start > now;
};

function groupByPatient(appointments: UpcomingAppointmentDto[]) {
  const map = new Map<string, UpcomingAppointmentDto[]>();
  for (const appt of appointments) {
    const name = appt.studentName.trim();
    if (!map.has(name)) {
      map.set(name, []);
    }
    map.get(name)!.push(appt);
  }
  return map;
}

const UpcomingAppointmentsModal: FC<UpcomingAppointmentsModalProps> = ({
  open,
  onClose,
  appointments,
  highlightedId,
  onStartTreatment,
}) => {
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState("");
  const [tabValue, setTabValue] = useState(0);

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);

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

  // Función para obtener el texto de estado apropiado
  const getStatusText = (state: string, dateTime: string) => {
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

  const getStatusIcon = (state: string, dateTime: string) => {
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

  const getChipStyles = (state: string, dateTime: string) => {
    if (isInProgress(dateTime)) {
      return {
        bgcolor: alpha(theme.palette.info.main, 0.1),
        color: theme.palette.info.dark,
        border: `1px solid ${alpha(theme.palette.info.main, 0.3)}`,
      };
    }

    switch (state) {
      case "ACCEPTED":
        return {
          bgcolor: alpha(theme.palette.success.main, 0.1),
          color: theme.palette.success.dark,
        };
      case "REJECTED":
        return {
          bgcolor: alpha(theme.palette.error.main, 0.1),
          color: theme.palette.error.dark,
        };
      default:
        return {
          bgcolor: alpha(theme.palette.warning.main, 0.1),
          color: theme.palette.warning.dark,
        };
    }
  };

  // Filtrar y ordenar las citas
  const filteredAppointments = useMemo(() => {
    let filtered = [...appointments];

    // Filtro de búsqueda
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter((appt) =>
        appt.studentName.toLowerCase().includes(term)
      );
    }

    // Filtro por pestaña
    if (tabValue === 0) {
      // "Todas": solo citas individuales
      filtered = filtered.filter((appt) => !appt.isPartOfTreatment);
    } else if (tabValue === 1) {
      // "Programadas": individuales futuras y aceptadas
      filtered = filtered.filter(
        (appt) =>
          !appt.isPartOfTreatment &&
          isFuture(appt.dateTime) &&
          appt.state === "ACCEPTED"
      );
    } else if (tabValue === 2) {
      // "Tratamientos activos": en tratamiento, futuras
      filtered = filtered.filter(
        (appt) => appt.isPartOfTreatment && isFuture(appt.dateTime)
      );
    }

    // Ordenar: En curso primero, luego por fecha
    return filtered.sort((a, b) => {
      const aInProgress = isInProgress(a.dateTime);
      const bInProgress = isInProgress(b.dateTime);
      if (aInProgress && !bInProgress) return -1;
      if (!aInProgress && bInProgress) return 1;
      return new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime();
    });
  }, [appointments, searchTerm, tabValue]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        elevation: 3,
        sx: {
          borderRadius: 2,
          overflow: "hidden",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 2,
          bgcolor: "background.paper",
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <CalendarMonthIcon color="primary" />
          <Typography variant="h6" fontWeight={600} color="text.primary">
            Todas las citas
          </Typography>
          <Chip
            label={`${appointments.length} ${
              appointments.length === 1 ? "cita" : "citas"
            }`}
            size="small"
            sx={{
              ml: 1,
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              color: theme.palette.primary.main,
              fontWeight: 600,
              fontSize: "0.7rem",
              height: 20,
            }}
          />
        </Box>
        <IconButton
          onClick={onClose}
          size="small"
          sx={{ color: "text.secondary" }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <Box
        sx={{
          px: 2,
          pt: 2,
          pb: 1,
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          <Paper
            component="form"
            sx={{
              p: "2px 4px",
              display: "flex",
              alignItems: "center",
              width: 300,
              borderRadius: 1.5,
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              placeholder="Buscar por nombre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              startAdornment={
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" color="action" />
                </InputAdornment>
              }
            />
          </Paper>
        </Box>

        <Tabs
          value={tabValue}
          onChange={(_, newValue) => setTabValue(newValue)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            minHeight: 42,
            "& .MuiTab-root": {
              minHeight: 42,
              textTransform: "none",
              fontWeight: 600,
              fontSize: "0.875rem",
              color: "text.secondary",
              "&.Mui-selected": {
                color: "primary.main",
              },
            },
            "& .MuiTabs-indicator": {
              height: 3,
              borderRadius: "3px 3px 0 0",
            },
          }}
        >
          <Tab label="Citas individuales" />
          <Tab label="Citas individuales programadas" />
          <Tab label="Citas de tratamiento activas" />
        </Tabs>
      </Box>

      <DialogContent
        sx={{
          p: 0,
          minHeight: 400,
          maxHeight: 600,
          overflowY: "auto",
          "&::-webkit-scrollbar": {
            width: "8px",
          },
          "&::-webkit-scrollbar-track": {
            background: "transparent",
          },
          "&::-webkit-scrollbar-thumb": {
            background: theme.palette.grey[300],
            borderRadius: "4px",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            background: theme.palette.grey[400],
          },
        }}
      >
        {filteredAppointments.length === 0 ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              py: 6,
              px: 3,
              textAlign: "center",
            }}
          >
            <Avatar
              sx={{
                width: 64,
                height: 64,
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                color: theme.palette.primary.main,
                mb: 2,
              }}
            >
              <CalendarMonthIcon fontSize="large" />
            </Avatar>
            <Typography
              variant="h6"
              fontWeight={600}
              color="text.primary"
              gutterBottom
            >
              No se encontraron citas
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ maxWidth: 400 }}
            >
              {searchTerm
                ? "No hay citas que coincidan con tu búsqueda. Intenta con otro término."
                : "No tienes citas próximas registradas en este momento."}
            </Typography>
          </Box>
        ) : tabValue === 2 ? (
          // Tratamientos activos agrupados por paciente
          <Box>
            {[...groupByPatient(filteredAppointments)].map(
              ([patientName, citas], i) => (
                <Box key={patientName}>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      px: 2,
                      pt: i === 0 ? 2 : 4,
                      pb: 1,
                      fontWeight: 600,
                      color: "text.primary",
                      textTransform: "uppercase",
                      fontSize: "0.75rem",
                    }}
                  >
                    {patientName}
                  </Typography>
                  <List disablePadding>
                    {citas.map((appt, index) => {
                      const { dateFormatted, timeFormatted } = formatDateTime(
                        appt.dateTime
                      );
                      const isActive = isInProgress(appt.dateTime);
                      const statusText = getStatusText(
                        appt.state,
                        appt.dateTime
                      );

                      return (
                        <React.Fragment key={appt.appointmentId}>
                          <ListItem
                            sx={{
                              px: 2,
                              py: 1.5,
                              bgcolor: isActive
                                ? alpha(theme.palette.info.light, 0.05)
                                : "transparent",
                              borderLeft: isActive
                                ? `4px solid ${theme.palette.info.light}`
                                : "none",
                              pl: isActive ? 1.5 : 2,
                            }}
                          >
                            <Avatar
                              sx={{
                                width: 40,
                                height: 40,
                                fontWeight: 600,
                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                                color: theme.palette.primary.main,
                                mr: 2,
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
                                  >
                                    {appt.studentName}
                                  </Typography>
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
                                      bgcolor: alpha(
                                        theme.palette.grey[600],
                                        0.1
                                      ),
                                      "& .MuiChip-icon": {
                                        color: theme.palette.grey[600],
                                      },
                                    }}
                                  />
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
                                      gap: 0.5,
                                      alignItems: "center",
                                    }}
                                  >
                                    <AccessTimeIcon
                                      sx={{
                                        fontSize: 14,
                                        color: "text.secondary",
                                      }}
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
                                      gap: 0.5,
                                      alignItems: "center",
                                    }}
                                  >
                                    <EventNoteIcon
                                      sx={{
                                        fontSize: 14,
                                        color: "text.secondary",
                                      }}
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
                            />
                            <Tooltip title={statusText} arrow>
                              <Chip
                                icon={getStatusIcon(appt.state, appt.dateTime)}
                                label={statusText}
                                size="small"
                                sx={{
                                  ml: 2,
                                  fontWeight: 600,
                                  fontSize: "0.75rem",
                                  height: 24,
                                  ...getChipStyles(appt.state, appt.dateTime),
                                  "& .MuiChip-icon": {
                                    fontSize: 14,
                                  },
                                }}
                              />
                            </Tooltip>
                          </ListItem>
                          {index < citas.length - 1 && (
                            <Divider sx={{ opacity: 0.6 }} />
                          )}
                        </React.Fragment>
                      );
                    })}
                  </List>
                </Box>
              )
            )}
          </Box>
        ) : (
          // Citas individuales (planas)
          <List disablePadding>
            {filteredAppointments.map((appt, index) => {
              const { dateFormatted, timeFormatted } = formatDateTime(
                appt.dateTime
              );
              const isActive = isInProgress(appt.dateTime);
              const statusText = getStatusText(appt.state, appt.dateTime);

              return (
                <React.Fragment key={appt.appointmentId}>
                  <ListItem
                    sx={{
                      px: 2,
                      py: 1.5,
                      bgcolor:
                        appt.appointmentId === highlightedId
                          ? alpha(theme.palette.info.main, 0.05)
                          : isActive
                          ? alpha(theme.palette.info.light, 0.05)
                          : "transparent",
                      borderLeft:
                        appt.appointmentId === highlightedId
                          ? `4px solid ${theme.palette.info.main}`
                          : isActive
                          ? `4px solid ${theme.palette.info.light}`
                          : "none",
                      pl:
                        appt.appointmentId === highlightedId || isActive
                          ? 1.5
                          : 2,
                      transition: "background-color 0.2s ease",
                      "&:hover": {
                        bgcolor: alpha(
                          appt.appointmentId === highlightedId
                            ? theme.palette.info.main
                            : theme.palette.grey[100],
                          0.1
                        ),
                      },
                      cursor:
                        onStartTreatment && !appt.isPartOfTreatment
                          ? "pointer"
                          : "default",
                    }}
                    onClick={() => {
                      if (onStartTreatment && !appt.isPartOfTreatment) {
                        onStartTreatment(
                          appt.patientId,
                          appt.therapistId,
                          appt.studentName
                        );
                      }
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 40,
                        height: 40,
                        fontWeight: 600,
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        color: theme.palette.primary.main,
                        mr: 2,
                        border: isActive
                          ? `2px solid ${theme.palette.info.main}`
                          : "none",
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
                        >
                          {appt.studentName}
                        </Typography>
                      }
                      secondary={
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Box
                            sx={{
                              display: "flex",
                              gap: 0.5,
                              alignItems: "center",
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
                              gap: 0.5,
                              alignItems: "center",
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
                    />
                    <Tooltip title={statusText} arrow>
                      <Chip
                        icon={getStatusIcon(appt.state, appt.dateTime)}
                        label={statusText}
                        size="small"
                        sx={{
                          ml: 2,
                          fontWeight: 600,
                          fontSize: "0.75rem",
                          height: 24,
                          ...getChipStyles(appt.state, appt.dateTime),
                          "& .MuiChip-icon": {
                            fontSize: 14,
                          },
                        }}
                      />
                    </Tooltip>
                  </ListItem>
                  {index < filteredAppointments.length - 1 && (
                    <Divider sx={{ opacity: 0.6 }} />
                  )}
                </React.Fragment>
              );
            })}
          </List>
        )}
      </DialogContent>

      <DialogActions
        sx={{ p: 2, borderTop: "1px solid", borderColor: "divider" }}
      >
        <Button
          onClick={onClose}
          variant="outlined"
          color="primary"
          sx={{
            borderRadius: 1.5,
            textTransform: "none",
            fontWeight: 600,
            px: 3,
          }}
        >
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpcomingAppointmentsModal;
