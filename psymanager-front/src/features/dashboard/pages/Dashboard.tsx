"use client";

import type React from "react";
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
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EventNoteIcon from "@mui/icons-material/EventNote";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";

// Componente para el mini calendario
const MiniCalendar = () => {
  const days = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
  const currentDate = 14; // Día actual (resaltado en turquesa)
  const highlightedDate = 22; // Otro día destacado

  return (
    <Box sx={{ width: "100%" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 1,
        }}
      >
        <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
          Noviembre 2024
        </Typography>
        <Box>
          <IconButton size="small">
            <ChevronLeftIcon fontSize="small" />
          </IconButton>
          <IconButton size="small">
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
              sx={{ display: "block", color: "#9e9e9e", fontSize: "0.7rem" }}
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
                height: 28,
                width: 28,
                borderRadius: "50%",
                margin: "0 auto",
                backgroundColor:
                  day === currentDate
                    ? "#4DB6AC"
                    : day === highlightedDate
                    ? "#4DB6AC80"
                    : "transparent",
                color:
                  day === currentDate
                    ? "#fff"
                    : day === highlightedDate
                    ? "#fff"
                    : "inherit",
              }}
            >
              <Typography variant="caption">{day}</Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

// Componente principal Dashboard
const Dashboard: React.FC = () => {
  return (
    <Box sx={{ width: "100%" }}>
      {/* Banner principal */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 2,
          background: "linear-gradient(to right, #8EA4AA, #A5B5BB)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box sx={{ maxWidth: "60%", zIndex: 1 }}>
          <Typography
            variant="h5"
            sx={{ color: "#fff", fontWeight: 500, mb: 1 }}
          >
            Gestiona horarios de consulta y los historiales de los estudiantes.
          </Typography>
        </Box>

        {/* Logo PSI UCB */}
        <Box sx={{ position: "relative", zIndex: 1 }}>
          <Box
            sx={{
              position: "relative",
              width: 150,
              height: 80,
            }}
          >
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: 120,
                height: 40,
                backgroundColor: "#E63946",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                "&:before": {
                  content: '""',
                  position: "absolute",
                  right: -20,
                  top: 0,
                  width: 0,
                  height: 0,
                  borderTop: "20px solid transparent",
                  borderBottom: "20px solid transparent",
                  borderLeft: "20px solid #E63946",
                },
              }}
            >
              <Typography
                variant="h6"
                component="span"
                sx={{
                  fontWeight: "bold",
                  color: "#D9D9D9",
                }}
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
                backgroundColor: "#1D3557",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
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
                component="span"
                sx={{
                  fontWeight: "bold",
                  color: "#D9D9D9",
                }}
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
              variant="h6"
              sx={{ mb: 2, fontWeight: 500, color: "#424242" }}
            >
              Accesos directos
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6} sm={4}>
                <Card
                  elevation={0}
                  sx={{
                    border: "1px solid #f0f0f0",
                    borderRadius: 2,
                    transition: "all 0.2s",
                    "&:hover": {
                      boxShadow: "0 4px 8px rgba(0,0,0,0.05)",
                      borderColor: "#e0e0e0",
                    },
                  }}
                >
                  <CardContent sx={{ textAlign: "center", p: 2 }}>
                    <Box
                      sx={{
                        width: 50,
                        height: 50,
                        borderRadius: 2,
                        bgcolor: "#000",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto 16px",
                      }}
                    >
                      <AddIcon sx={{ color: "#fff" }} />
                    </Box>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      Historial de estudiantes
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={6} sm={4}>
                <Card
                  elevation={0}
                  sx={{
                    border: "1px solid #f0f0f0",
                    borderRadius: 2,
                    transition: "all 0.2s",
                    "&:hover": {
                      boxShadow: "0 4px 8px rgba(0,0,0,0.05)",
                      borderColor: "#e0e0e0",
                    },
                  }}
                >
                  <CardContent sx={{ textAlign: "center", p: 2 }}>
                    <Box
                      sx={{
                        width: 50,
                        height: 50,
                        borderRadius: 2,
                        bgcolor: "#fff",
                        border: "1px solid #e0e0e0",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto 16px",
                      }}
                    >
                      <EventNoteIcon sx={{ color: "#424242" }} />
                    </Box>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      Añadir Horarios
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>

          {/* Estudiantes asignados */}
          <Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontWeight: 500, color: "#424242" }}
              >
                Estudiantes asignados
              </Typography>
              <Button
                endIcon={<ArrowForwardIosIcon sx={{ fontSize: 14 }} />}
                sx={{
                  color: "#4DB6AC",
                  textTransform: "none",
                  fontWeight: 500,
                  fontSize: "0.875rem",
                  "&:hover": {
                    backgroundColor: "transparent",
                    textDecoration: "underline",
                  },
                }}
              >
                View All
              </Button>
            </Box>

            <Grid container spacing={2}>
              {["Amanda Clara", "Juan Perez", "Jessica"].map((name, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card
                    elevation={0}
                    sx={{
                      border: "1px solid #f0f0f0",
                      borderRadius: 2,
                      height: "100%",
                    }}
                  >
                    <CardContent sx={{ p: 2 }}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 2 }}
                      >
                        <Avatar
                          sx={{
                            width: 50,
                            height: 50,
                            mr: 2,
                            bgcolor: "#f5f5f5",
                            color: "#9e9e9e",
                          }}
                        >
                          {name.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography
                            variant="subtitle2"
                            sx={{ fontWeight: 500 }}
                          >
                            {name}
                          </Typography>
                          <Chip
                            label="Estudiante"
                            size="small"
                            sx={{
                              height: 20,
                              fontSize: "0.7rem",
                              bgcolor: "#E0F2F1",
                              color: "#4DB6AC",
                              fontWeight: 500,
                            }}
                          />
                        </Box>
                      </Box>

                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 2 }}
                      >
                        <AccessTimeIcon
                          sx={{ fontSize: 16, color: "#9e9e9e", mr: 1 }}
                        />
                        <Typography variant="caption" sx={{ color: "#757575" }}>
                          {index === 0
                            ? "Lu, Ma"
                            : index === 1
                            ? "Mi, Ju"
                            : "Vi"}{" "}
                          10:00 AM-01:00 PM
                        </Typography>
                      </Box>

                      <Button
                        fullWidth
                        variant="contained"
                        sx={{
                          bgcolor: "#4DB6AC",
                          color: "#fff",
                          textTransform: "none",
                          "&:hover": {
                            bgcolor: "#3DA599",
                          },
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
            elevation={0}
            sx={{
              border: "1px solid #f0f0f0",
              borderRadius: 2,
            }}
          >
            <CardContent sx={{ p: 2 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 500, color: "#424242" }}
                >
                  Próximas citas
                </Typography>
                <Button
                  endIcon={<ArrowForwardIosIcon sx={{ fontSize: 14 }} />}
                  sx={{
                    color: "#4DB6AC",
                    textTransform: "none",
                    fontWeight: 500,
                    fontSize: "0.875rem",
                    "&:hover": {
                      backgroundColor: "transparent",
                      textDecoration: "underline",
                    },
                  }}
                >
                  Ver todas
                </Button>
              </Box>

              <MiniCalendar />

              <Box sx={{ textAlign: "center", mt: 4, mb: 2 }}>
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: 2,
                    bgcolor: "#E0F2F1",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 16px",
                  }}
                >
                  <CalendarTodayOutlinedIcon
                    sx={{ color: "#4DB6AC", fontSize: 30 }}
                  />
                </Box>
                <Typography variant="body2" sx={{ color: "#757575" }}>
                  No tienes citas próximas
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
