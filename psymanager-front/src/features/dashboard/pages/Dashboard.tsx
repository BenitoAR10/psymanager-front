"use client";

import React from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Avatar,
  Paper,
  Chip,
  IconButton,
  Divider,
  useTheme,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EventNoteIcon from "@mui/icons-material/EventNote";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";

const MiniCalendar = () => {
  const theme = useTheme();
  const days = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
  const currentDate = 14;
  const highlightedDate = 22;

  return (
    <Box sx={{ width: "100%" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: 600, color: "text.primary" }}
        >
          Noviembre 2024
        </Typography>
        <Box>
          <IconButton
            size="small"
            sx={{
              color: "text.secondary",
              "&:hover": {
                backgroundColor: "rgba(77, 182, 172, 0.08)",
                color: "primary.main",
              },
            }}
          >
            <ChevronLeftIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            sx={{
              color: "text.secondary",
              "&:hover": {
                backgroundColor: "rgba(77, 182, 172, 0.08)",
                color: "primary.main",
              },
            }}
          >
            <ChevronRightIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      <Grid container spacing={1}>
        {days.map((day) => (
          <Grid item xs={12 / 7} key={day}>
            <Typography
              variant="caption"
              align="center"
              sx={{
                display: "block",
                color: "text.secondary",
                fontWeight: 500,
              }}
            >
              {day}
            </Typography>
          </Grid>
        ))}

        {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => (
          <Grid item xs={12 / 7} key={day}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: 32,
                width: 32,
                borderRadius: "50%",
                margin: "0 auto",
                cursor: "pointer",
                transition: "all 0.2s ease",
                bgcolor:
                  day === currentDate
                    ? "primary.main"
                    : day === highlightedDate
                    ? "primary.light"
                    : "transparent",
                color:
                  day === currentDate || day === highlightedDate
                    ? theme.palette.common.white
                    : theme.palette.text.primary,
                "&:hover": {
                  bgcolor:
                    day === currentDate
                      ? "primary.dark"
                      : day === highlightedDate
                      ? "primary.main"
                      : "grey.100",
                  transform: "scale(1.1)",
                },
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  fontWeight: day === currentDate ? 600 : 400,
                }}
              >
                {day}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

const Dashboard: React.FC = () => {
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

        {/* Logo PSI UCB */}
        <Box
          sx={{
            position: "relative",
            zIndex: 1,
            alignSelf: { xs: "center", md: "flex-end" },
          }}
        >
          <Box sx={{ position: "relative", width: 150, height: 80 }}>
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: 120,
                height: 40,
                bgcolor: "error.main",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                boxShadow: "0 4px 12px rgba(229, 57, 53, 0.3)",
                "&:before": {
                  content: '""',
                  position: "absolute",
                  right: -20,
                  top: 0,
                  width: 0,
                  height: 0,
                  borderTop: "20px solid transparent",
                  borderBottom: "20px solid transparent",
                  borderLeft: "20px solid #E53935",
                },
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontWeight: "bold", color: "common.white" }}
              >
                PSI
              </Typography>
            </Box>
            <Box
              sx={{
                position: "absolute",
                bottom: 0,
                right: 0,
                width: 120,
                height: 40,
                bgcolor: "#1D3557",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                boxShadow: "0 4px 12px rgba(29, 53, 87, 0.3)",
                "&:before": {
                  content: '""',
                  position: "absolute",
                  left: -20,
                  top: 0,
                  width: 0,
                  height: 0,
                  borderTop: "20px solid #1D3557",
                  borderBottom: "20px solid #1D3557",
                  borderLeft: "20px solid transparent",
                },
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontWeight: "bold", color: "common.white" }}
              >
                UCB
              </Typography>
            </Box>
          </Box>
        </Box>
      </Paper>

      <Grid container spacing={4}>
        {/* Columna izquierda */}
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
          <Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Typography
                variant="h5"
                sx={{
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
                Estudiantes asignados
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
              >
                Ver todos
              </Button>
            </Box>

            <Grid container spacing={3}>
              {[
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
              ].map((student) => (
                <Grid item xs={12} sm={6} md={4} key={student.name}>
                  <Card
                    elevation={1}
                    sx={{
                      borderRadius: 3,
                      height: "100%",
                      position: "relative",
                      "&::before": {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: 4,
                        backgroundColor:
                          student.status === "Activo"
                            ? "success.main"
                            : "warning.main",
                        borderRadius: "12px 12px 0 0",
                      },
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 2 }}
                      >
                        <Avatar
                          sx={{
                            width: 56,
                            height: 56,
                            mr: 2,
                            bgcolor:
                              student.status === "Activo"
                                ? "success.light"
                                : "warning.light",
                            color:
                              student.status === "Activo"
                                ? "success.dark"
                                : "warning.dark",
                            fontWeight: 600,
                            fontSize: "1.2rem",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                          }}
                        >
                          {student.name.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="h6" fontWeight={600} mb={0.5}>
                            {student.name}
                          </Typography>
                          <Chip
                            label="Estudiante"
                            size="small"
                            sx={{
                              height: 22,
                              fontSize: "0.7rem",
                              bgcolor:
                                student.status === "Activo"
                                  ? "success.light"
                                  : "warning.light",
                              color:
                                student.status === "Activo"
                                  ? "success.dark"
                                  : "warning.dark",
                              fontWeight: 600,
                              borderRadius: 1,
                            }}
                          />
                        </Box>
                      </Box>

                      <Divider sx={{ my: 2 }} />

                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          mb: 2.5,
                          backgroundColor: "grey.50",
                          p: 1.5,
                          borderRadius: 2,
                        }}
                      >
                        <AccessTimeIcon
                          fontSize="small"
                          sx={{ mr: 1, color: "text.secondary" }}
                        />
                        <Box>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            display="block"
                          >
                            Horario
                          </Typography>
                          <Typography variant="body2" fontWeight={500}>
                            {student.days} • {student.time}
                          </Typography>
                        </Box>
                      </Box>

                      <Button
                        variant="contained"
                        fullWidth
                        color="primary"
                        startIcon={<PersonOutlineIcon />}
                        sx={{
                          py: 1,
                          fontWeight: 600,
                        }}
                      >
                        Ver historial
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Grid>

        {/* Columna derecha */}
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
                >
                  Ver todas
                </Button>
              </Box>

              <Box sx={{ p: 3 }}>
                <MiniCalendar />

                <Divider sx={{ my: 3 }} />

                <Box textAlign="center" mt={2}>
                  <Box
                    sx={{
                      width: 64,
                      height: 64,
                      bgcolor: "primary.light",
                      borderRadius: 2,
                      mx: "auto",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mb: 2,
                      boxShadow: "0 4px 12px rgba(77, 182, 172, 0.2)",
                    }}
                  >
                    <CalendarTodayOutlinedIcon
                      sx={{ color: "primary.dark", fontSize: 32 }}
                    />
                  </Box>
                  <Typography variant="h6" fontWeight={600} mb={1}>
                    Sin citas próximas
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 3 }}
                  >
                    No tienes citas programadas para los próximos días
                  </Typography>
                  <Button
                    variant="outlined"
                    color="primary"
                    startIcon={<EventNoteIcon />}
                    sx={{ fontWeight: 600 }}
                  >
                    Añadir nueva cita
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
