"use client";

import type React from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Avatar,
  Chip,
  Divider,
  Stack,
  Paper,
  IconButton,
  useTheme,
  alpha,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import MessageIcon from "@mui/icons-material/Message";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import type { UpcomingAppointmentDto } from "../../features/appointments/types";

interface AppointmentRequestModalProps {
  open: boolean;
  appointment: UpcomingAppointmentDto | null;
  onClose: () => void;
  onAccept: (id: number) => void;
  onReject: (id: number) => void;
}

const AppointmentRequestModal: React.FC<AppointmentRequestModalProps> = ({
  open,
  appointment,
  onClose,
  onAccept,
  onReject,
}) => {
  const theme = useTheme();

  const formatDateTime = (dateTimeStr: string) => {
    const date = new Date(dateTimeStr);
    const dateOptions: Intl.DateTimeFormatOptions = {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    };
    const timeOptions: Intl.DateTimeFormatOptions = {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };

    return {
      date: date.toLocaleDateString("es-ES", dateOptions),
      time: date.toLocaleTimeString("es-ES", timeOptions),
    };
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  if (!appointment) return null;

  const { date, time } = formatDateTime(appointment.dateTime);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: 3,
          overflow: "hidden",
          boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
        },
      }}
    >
      {/* Header con gradiente sutil */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${alpha(
            theme.palette.primary.main,
            0.08
          )} 0%, ${alpha(theme.palette.primary.light, 0.04)} 100%)`,
          p: 3,
          position: "relative",
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: "text.secondary",
          }}
        >
          <CloseIcon />
        </IconButton>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
          <Avatar
            sx={{
              bgcolor: theme.palette.primary.main,
              width: 56,
              height: 56,
              fontSize: "1.2rem",
              fontWeight: 600,
            }}
          >
            {getInitials(appointment.studentName)}
          </Avatar>
          <Box>
            <Typography
              variant="h5"
              fontWeight={600}
              color="text.primary"
              gutterBottom
            >
              Nueva solicitud de cita
            </Typography>
            <Chip
              label="Pendiente de aprobación"
              color="warning"
              size="small"
              sx={{
                fontWeight: 500,
                bgcolor: alpha(theme.palette.warning.main, 0.1),
                color: theme.palette.warning.dark,
              }}
            />
          </Box>
        </Box>
      </Box>

      <DialogContent sx={{ p: 0 }}>
        <Stack spacing={0}>
          {/* Información del estudiante */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              bgcolor: "background.paper",
              borderBottom: "1px solid",
              borderColor: "divider",
            }}
          >
            <Box
              sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}
            >
              <PersonIcon color="primary" fontSize="small" />
              <Typography
                variant="subtitle2"
                color="text.secondary"
                fontWeight={500}
              >
                Información del estudiante
              </Typography>
            </Box>
            <Typography variant="h6" fontWeight={600} color="text.primary">
              {appointment.studentName}
            </Typography>
          </Paper>

          {/* Fecha y hora */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              bgcolor: "background.paper",
              borderBottom: "1px solid",
              borderColor: "divider",
            }}
          >
            <Box
              sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}
            >
              <AccessTimeIcon color="primary" fontSize="small" />
              <Typography
                variant="subtitle2"
                color="text.secondary"
                fontWeight={500}
              >
                Fecha y hora solicitada
              </Typography>
            </Box>
            <Box
              sx={{
                bgcolor: alpha(theme.palette.primary.main, 0.04),
                borderRadius: 2,
                p: 2,
                border: "1px solid",
                borderColor: alpha(theme.palette.primary.main, 0.1),
              }}
            >
              <Typography
                variant="body1"
                fontWeight={600}
                color="text.primary"
                sx={{ textTransform: "capitalize" }}
              >
                {date}
              </Typography>
              <Typography variant="h6" color="primary.main" fontWeight={600}>
                {time}
              </Typography>
            </Box>
          </Paper>

          {/* Motivo de la solicitud */}
          {appointment.reason && (
            <Paper
              elevation={0}
              sx={{
                p: 3,
                bgcolor: "background.paper",
              }}
            >
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}
              >
                <MessageIcon color="primary" fontSize="small" />
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  fontWeight={500}
                >
                  Motivo de la solicitud
                </Typography>
              </Box>
              <Box
                sx={{
                  bgcolor: "grey.50",
                  borderRadius: 2,
                  p: 2.5,
                  border: "1px solid",
                  borderColor: "grey.200",
                }}
              >
                <Typography
                  variant="body1"
                  color="text.primary"
                  sx={{
                    lineHeight: 1.6,
                  }}
                >
                  {appointment.reason}
                </Typography>
              </Box>
            </Paper>
          )}
        </Stack>
      </DialogContent>

      <Divider />

      <DialogActions
        sx={{
          p: 3,
          gap: 1,
          justifyContent: "space-between",
          bgcolor: alpha(theme.palette.grey[50], 0.5),
        }}
      >
        <Button
          onClick={onClose}
          variant="text"
          color="inherit"
          sx={{
            borderRadius: 2,
            px: 3,
            fontWeight: 500,
          }}
        >
          Cerrar
        </Button>

        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            onClick={() => {
              onReject(appointment.appointmentId);
              onClose();
            }}
            color="error"
            variant="outlined"
            startIcon={<CancelIcon />}
            sx={{
              borderRadius: 2,
              px: 3,
              fontWeight: 500,
              borderWidth: 1.5,
              "&:hover": {
                borderWidth: 1.5,
              },
            }}
          >
            Rechazar
          </Button>
          <Button
            onClick={() => {
              onAccept(appointment.appointmentId);
              onClose();
            }}
            color="primary"
            variant="contained"
            startIcon={<CheckCircleIcon />}
            sx={{
              borderRadius: 2,
              px: 3,
              fontWeight: 600,
              boxShadow: "0 2px 8px rgba(77, 182, 172, 0.3)",
              "&:hover": {
                boxShadow: "0 4px 12px rgba(77, 182, 172, 0.4)",
              },
            }}
          >
            Aceptar
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default AppointmentRequestModal;
