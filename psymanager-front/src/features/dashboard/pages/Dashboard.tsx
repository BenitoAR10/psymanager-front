"use client";

import React from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Paper,
  Divider,
  CircularProgress,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EventNoteIcon from "@mui/icons-material/EventNote";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import AssignedStudents, {
  AssignedStudent,
} from "../components/AssignedStudents";
import CalendarWidget from "../components/CalendarWidget";
import UpcomingAppointments from "../components/UpcomingAppointments";
import { useUpcomingAppointmentsQuery } from "../hooks/useUpcomingAppointmentsQuery";

const Dashboard: React.FC = () => {
  // React Query hook para cargar las próximas 5 citas
  const {
    data: upcomingAppointments = [],
    isLoading,
    isError,
  } = useUpcomingAppointmentsQuery(5);

  // Datos de ejemplo para la sección de estudiantes asignados
  const assignedStudents: AssignedStudent[] = [
    {
      name: "Amanda Clara",
      days: "Lu, Ma",
      time: "10:00 AM - 01:00 PM",
      status: "Activo",
    },
    {
      name: "Juan Perez",
      days: "Mi, Ju",
      time: "10:00 AM - 01:00 PM",
      status: "Pendiente",
    },
    {
      name: "Jessica Morales",
      days: "Vi",
      time: "10:00 AM - 01:00 PM",
      status: "Activo",
    },
  ];

  // Extraer las fechas completas de cada cita para marcar eventos
  const eventDates = upcomingAppointments.map(
    (appt) => new Date(appt.dateTime)
  );

  const handleViewAll = () => {
    console.log("Ver todas las citas");
    // TODO: navegar a la página completa de citas
  };

  const handleViewStudents = () => {
    console.log("Ver todos los estudiantes asignados");
    // TODO: navegar a la lista de estudiantes
  };

  return (
    <Box sx={{ width: "100%", pb: 6 }}>
      {/* Banner principal */}
      <Paper
        elevation={3}
        sx={{
          p: { xs: 3, md: 4 },
          mb: 4,
          borderRadius: 3,
          background: "linear-gradient(135deg, #4DB6AC, #26A69A)",
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", md: "center" },
          gap: { xs: 4, md: 0 },
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            right: 0,
            width: "40%",
            height: "100%",
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0))",
            borderRadius: "50% 0 0 50%",
          },
        }}
      >
        <Box sx={{ maxWidth: { xs: "100%", md: "60%" }, zIndex: 1 }}>
          <Typography
            variant="h4"
            sx={{
              color: "common.white",
              fontWeight: 700,
              mb: 2,
              fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2rem" },
            }}
          >
            Gestiona horarios de consulta y los historiales de los estudiantes
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "rgba(255, 255, 255, 0.9)",
              maxWidth: "90%",
            }}
          >
            Organiza tu agenda, visualiza tus citas y accede al historial de tus
            estudiantes en un solo lugar.
          </Typography>
        </Box>
      </Paper>

      <Grid container spacing={4}>
        {/* Columna izquierda: accesos y estudiantes asignados */}
        <Grid item xs={12} md={8}>
          {/* Accesos directos */}
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h5"
              sx={{
                mb: 3,
                fontWeight: 600,
                color: "text.primary",
                display: "flex",
                alignItems: "center",
                "&::after": {
                  content: '""',
                  display: "block",
                  width: 40,
                  height: 3,
                  backgroundColor: "primary.main",
                  marginLeft: 2,
                  borderRadius: 1.5,
                },
              }}
            >
              Accesos directos
            </Typography>
            <Grid container spacing={3}>
              {[
                {
                  icon: <AddIcon />,
                  label: "Historial de estudiantes",
                  description:
                    "Accede y gestiona los historiales de tus estudiantes",
                  color: "#4DB6AC",
                },
                {
                  icon: <EventNoteIcon />,
                  label: "Añadir Horarios",
                  description: "Configura tus horarios de disponibilidad",
                  color: "#64B5F6",
                },
                {
                  icon: <SchoolOutlinedIcon />,
                  label: "Recursos académicos",
                  description: "Material de apoyo para tus sesiones",
                  color: "#FDD835",
                },
              ].map(({ icon, label, description, color }) => (
                <Grid item xs={12} sm={6} md={4} key={label}>
                  <Card
                    elevation={2}
                    sx={{
                      borderRadius: 3,
                      transition: "all 0.3s",
                      height: "100%",
                      "&:hover": {
                        boxShadow: 6,
                        transform: "translateY(-4px)",
                      },
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Box
                        sx={{
                          width: 56,
                          height: 56,
                          borderRadius: 2,
                          bgcolor: color,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          mb: 2,
                          boxShadow: `0 4px 12px ${color}40`,
                        }}
                      >
                        {React.cloneElement(icon, {
                          style: { color: "white", fontSize: 28 },
                        })}
                      </Box>
                      <Typography variant="h6" fontWeight={600} mb={1}>
                        {label}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Estudiantes asignados */}
          <AssignedStudents
            students={assignedStudents}
            onViewAll={handleViewStudents}
          />
        </Grid>

        {/* Columna derecha: calendario y próximas citas */}
        <Grid item xs={12} md={4}>
          <Card
            elevation={2}
            sx={{
              borderRadius: 3,
              position: "sticky",
              top: 24,
            }}
          >
            <CardContent sx={{ p: 0 }}>
              <Box
                sx={{
                  p: 3,
                  borderBottom: "1px solid",
                  borderColor: "divider",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 600, color: "text.primary" }}
                >
                  Próximas citas
                </Typography>
                <Button
                  variant="text"
                  color="primary"
                  endIcon={<ArrowForwardIosIcon sx={{ fontSize: 14 }} />}
                  sx={{
                    fontWeight: 600,
                    "&:hover": {
                      backgroundColor: "rgba(77, 182, 172, 0.08)",
                    },
                  }}
                  onClick={handleViewAll}
                >
                  Ver todas
                </Button>
              </Box>

              <Box sx={{ p: 3 }}>
                {/* Mini calendario con puntos en días de cita */}
                <CalendarWidget eventDates={eventDates} />

                <Divider sx={{ my: 3 }} />

                {/* Carga / Error / Lista de próximas citas */}
                {isLoading ? (
                  <Box textAlign="center" mt={2}>
                    <CircularProgress />
                    <Typography variant="body2" color="text.secondary" mt={1}>
                      Cargando citas...
                    </Typography>
                  </Box>
                ) : isError ? (
                  <Box textAlign="center" mt={2}>
                    <Typography variant="body2" color="error">
                      Error al cargar citas
                    </Typography>
                  </Box>
                ) : (
                  <UpcomingAppointments
                    appointments={upcomingAppointments}
                    onViewAll={handleViewAll}
                  />
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
