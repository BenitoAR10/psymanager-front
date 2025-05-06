"use client";

import type React from "react";
import {
  Menu,
  MenuItem,
  IconButton,
  Typography,
  Box,
  Tooltip,
  Badge,
  Avatar,
  Button,
  alpha,
  useTheme,
  CircularProgress,
  Stack,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import type { UpcomingAppointmentDto } from "../../features/appointments/types";

export interface NotificationsMenuProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  loading: boolean;
  error: boolean;
  pending: UpcomingAppointmentDto[];
  onClose: () => void;
  onAccept: (id: number) => void;
  onReject: (id: number) => void;
  onViewAll?: () => void;
}

const NotificationsMenu: React.FC<NotificationsMenuProps> = ({
  anchorEl,
  open,
  loading,
  error,
  pending,
  onClose,
  onAccept,
  onReject,
}) => {
  const theme = useTheme();

  // Función para formatear la fecha y hora
  const formatDateTime = (dateTimeStr: string) => {
    const date = new Date(dateTimeStr);
    return date.toLocaleString("es-ES", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
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

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      PaperProps={{
        elevation: 3,
        sx: {
          width: 320,
          maxHeight: 400,
          overflow: "auto",
          borderRadius: 2,
          mt: 1,
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          "&::-webkit-scrollbar": {
            width: "6px",
          },
          "&::-webkit-scrollbar-track": {
            background: "transparent",
          },
          "&::-webkit-scrollbar-thumb": {
            background: theme.palette.grey[300],
            borderRadius: "3px",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            background: theme.palette.grey[400],
          },
        },
      }}
      transformOrigin={{ horizontal: "right", vertical: "top" }}
      anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
    >
      {/* Encabezado del menú */}
      <Box
        sx={{
          px: 2.5,
          py: 1.5,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid",
          borderColor: "divider",
          bgcolor: "background.paper",
          position: "sticky",
          top: 0,
          zIndex: 1,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Badge
            badgeContent={pending.length}
            color="error"
            sx={{
              "& .MuiBadge-badge": {
                fontSize: "0.65rem",
                height: 18,
                minWidth: 18,
                fontWeight: 600,
              },
            }}
          >
            <NotificationsNoneIcon color="primary" fontSize="small" />
          </Badge>
          <Typography variant="subtitle1" fontWeight={600} color="text.primary">
            Solicitudes pendientes
          </Typography>
        </Box>
        {pending.length > 0 && (
          <Typography variant="caption" color="text.secondary" fontWeight={500}>
            {pending.length} {pending.length === 1 ? "nueva" : "nuevas"}
          </Typography>
        )}
      </Box>

      {/* Contenido del menú */}
      {loading ? (
        <Box
          sx={{
            py: 4,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <CircularProgress
            size={32}
            thickness={4}
            color="primary"
            sx={{ mb: 2 }}
          />
          <Typography variant="body2" color="text.secondary">
            Cargando solicitudes...
          </Typography>
        </Box>
      ) : error ? (
        <Box
          sx={{
            py: 4,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <Avatar
            sx={{
              bgcolor: alpha(theme.palette.error.main, 0.1),
              color: theme.palette.error.main,
              width: 48,
              height: 48,
              mb: 2,
            }}
          >
            <ErrorOutlineIcon />
          </Avatar>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Error al cargar las solicitudes
          </Typography>
          <Button
            size="small"
            variant="outlined"
            color="primary"
            onClick={onClose}
            sx={{
              borderRadius: 1.5,
              textTransform: "none",
              fontSize: "0.8rem",
            }}
          >
            Intentar nuevamente
          </Button>
        </Box>
      ) : pending.length === 0 ? (
        <Box
          sx={{
            py: 4,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <Avatar
            sx={{
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              color: theme.palette.primary.main,
              width: 48,
              height: 48,
              mb: 2,
            }}
          >
            <NotificationsNoneIcon />
          </Avatar>
          <Typography variant="body2" color="text.secondary">
            No hay solicitudes pendientes
          </Typography>
        </Box>
      ) : (
        <>
          {pending.slice(0, 5).map((appt, index) => (
            <MenuItem
              key={appt.appointmentId}
              sx={{
                py: 1.5,
                px: 2,
                borderBottom:
                  index < Math.min(pending.length, 5) - 1
                    ? "1px solid"
                    : "none",
                borderColor: "divider",
                "&:hover": {
                  bgcolor: alpha(theme.palette.primary.main, 0.04),
                },
              }}
            >
              <Box sx={{ display: "flex", width: "100%" }}>
                <Avatar
                  sx={{
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    color: theme.palette.primary.main,
                    width: 40,
                    height: 40,
                    mr: 1.5,
                    fontSize: "0.9rem",
                    fontWeight: 600,
                  }}
                >
                  {getInitials(appt.studentName)}
                </Avatar>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    variant="body2"
                    fontWeight={600}
                    color="text.primary"
                    sx={{
                      mb: 0.5,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {appt.studentName}
                  </Typography>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                    >
                      <AccessTimeIcon
                        sx={{ fontSize: 14, color: "text.secondary" }}
                      />
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{
                          fontSize: "0.7rem",
                          textTransform: "capitalize",
                        }}
                      >
                        {formatDateTime(appt.dateTime)}
                      </Typography>
                    </Box>
                  </Stack>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", ml: 1 }}>
                  <Tooltip title="Aceptar solicitud" arrow>
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        onAccept(appt.appointmentId);
                      }}
                      sx={{
                        color: theme.palette.success.main,
                        bgcolor: alpha(theme.palette.success.main, 0.1),
                        mr: 0.5,
                        "&:hover": {
                          bgcolor: alpha(theme.palette.success.main, 0.2),
                        },
                        width: 28,
                        height: 28,
                      }}
                    >
                      <CheckCircleIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Rechazar solicitud" arrow>
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        onReject(appt.appointmentId);
                      }}
                      sx={{
                        color: theme.palette.error.main,
                        bgcolor: alpha(theme.palette.error.main, 0.1),
                        "&:hover": {
                          bgcolor: alpha(theme.palette.error.main, 0.2),
                        },
                        width: 28,
                        height: 28,
                      }}
                    >
                      <CancelIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            </MenuItem>
          ))}
        </>
      )}
    </Menu>
  );
};

export default NotificationsMenu;
