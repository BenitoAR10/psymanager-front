"use client";

import type React from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Button,
  alpha,
  useTheme,
  Paper,
  Alert,
  Chip,
  LinearProgress,
  Divider,
} from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import EventNoteOutlinedIcon from "@mui/icons-material/EventNoteOutlined";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { useNavigate } from "react-router-dom";

export interface AssignedStudent {
  patientId: number;
  therapistId: number;
  name: string;
  status: string;
  startDate: string;
  endDate?: string;
  assignedSessions: number;
  completedSessions: number;
  treatmentId: number;
}

interface AssignedStudentsProps {
  students: AssignedStudent[];
  onViewAll: () => void;
  onStartTreatment?: (
    patientId: number,
    therapistId: number,
    patientName: string
  ) => void;
}

const AssignedStudents: React.FC<AssignedStudentsProps> = ({
  students,
  onViewAll,
}) => {
  const theme = useTheme();

  const navigate = useNavigate();

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const getWeeksLeft = (
    startDate: string,
    endDate?: string,
    totalSessions?: number
  ): string => {
    if (!endDate || totalSessions === 0) {
      return "Aún no tiene fecha de finalización";
    }

    const start = new Date(startDate + "T00:00:00");
    const end = new Date(endDate + "T00:00:00");

    if (start.getTime() === end.getTime()) {
      return "Finaliza el mismo día del inicio";
    }

    const diffInMs = end.getTime() - start.getTime();
    const weeks = Math.ceil(diffInMs / (7 * 24 * 60 * 60 * 1000));

    return weeks <= 1
      ? `Finaliza: ${end.toLocaleDateString("es-BO")}`
      : `Finaliza en ${weeks} semanas`;
  };

  // Función para formatear la fecha en un formato más legible
  const formatDate = (dateString: string): string => {
    const [year, month, day] = dateString.split("-");
    const date = new Date(Number(year), Number(month) - 1, Number(day));
    return date.toLocaleDateString("es-BO", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Calcular el progreso de las sesiones
  const calculateProgress = (completed: number, total: number): number => {
    if (total === 0) return 0;
    return (completed / total) * 100;
  };

  return (
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
            fontWeight: 700,
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
          Pacientes en tratamiento
        </Typography>
        <Button
          variant="text"
          color="primary"
          endIcon={<ArrowForwardIosIcon sx={{ fontSize: 14 }} />}
          onClick={onViewAll}
          sx={{
            fontWeight: 600,
            "&:hover": {
              backgroundColor: alpha(theme.palette.primary.main, 0.08),
            },
          }}
        >
          Ver todos
        </Button>
      </Box>

      {students.length === 0 ? (
        <Paper
          elevation={0}
          sx={{
            py: 6,
            px: 4,
            textAlign: "center",
            borderRadius: 3,
            bgcolor: alpha(theme.palette.background.paper, 0.7),
            border: "1px dashed",
            borderColor: alpha(theme.palette.primary.main, 0.2),
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Avatar
            sx={{
              width: 80,
              height: 80,
              mb: 3,
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              color: theme.palette.primary.main,
            }}
          >
            <PeopleAltOutlinedIcon sx={{ fontSize: 40 }} />
          </Avatar>

          <Typography
            variant="h5"
            fontWeight={700}
            color="text.primary"
            sx={{ mb: 1 }}
          >
            No hay pacientes en tratamiento
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mb: 4, maxWidth: 500, mx: "auto" }}
          >
            Aún no tienes pacientes con un tratamiento activo. Puedes comenzar
            desde la lista de estudiantes con citas confirmadas.
          </Typography>

          <Box
            sx={{
              display: "flex",
              gap: 2,
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <Button
              variant="contained"
              color="primary"
              startIcon={<PersonOutlineIcon />}
              onClick={onViewAll}
              sx={{
                py: 1.2,
                px: 3,
                fontWeight: 600,
                borderRadius: 2,
                boxShadow: `0 4px 12px ${alpha(
                  theme.palette.primary.main,
                  0.2
                )}`,
                "&:hover": {
                  boxShadow: `0 6px 16px ${alpha(
                    theme.palette.primary.main,
                    0.3
                  )}`,
                  transform: "translateY(-2px)",
                },
                transition: "all 0.2s ease",
              }}
            >
              Ver listado de estudiantes
            </Button>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<CalendarMonthOutlinedIcon />}
              sx={{
                py: 1.2,
                px: 3,
                fontWeight: 600,
                borderRadius: 2,
                borderWidth: "1.5px",
                "&:hover": {
                  borderWidth: "1.5px",
                  bgcolor: alpha(theme.palette.primary.main, 0.05),
                  transform: "translateY(-2px)",
                },
                transition: "all 0.2s ease",
              }}
            >
              Crear horarios disponibles
            </Button>
          </Box>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {students.map((student) => {
            const progress = calculateProgress(
              student.completedSessions,
              student.assignedSessions
            );

            return (
              <Box
                key={student.treatmentId}
                sx={{ width: { xs: "100%", sm: "50%", md: "33.333%" }, p: 1.5 }}
              >
                <Card
                  elevation={1}
                  sx={{
                    borderRadius: 3,
                    height: "100%",
                    position: "relative",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: theme.shadows[3],
                    },
                    overflow: "hidden",
                  }}
                >
                  {/* Barra de estado en la parte superior */}
                  <Box
                    key={student.treatmentId}
                    sx={{
                      height: 4,
                      width: "100%",
                      bgcolor: student.endDate
                        ? alpha(theme.palette.primary.main, 0.2)
                        : alpha(theme.palette.warning.main, 0.2),
                    }}
                  >
                    <Box
                      sx={{
                        height: "100%",
                        width: `${progress}%`,
                        bgcolor: student.endDate
                          ? theme.palette.primary.main
                          : theme.palette.warning.main,
                        transition: "width 0.5s ease",
                      }}
                    />
                  </Box>

                  <CardContent
                    sx={{
                      p: 3,
                      display: "flex",
                      flexDirection: "column",
                      height: "100%",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <Avatar
                        sx={{
                          width: 48,
                          height: 48,
                          mr: 2,
                          bgcolor: alpha(theme.palette.primary.main, 0.1),
                          color: theme.palette.primary.main,
                          fontWeight: 600,
                          fontSize: "1rem",
                          border: "2px solid",
                          borderColor: alpha(theme.palette.primary.main, 0.3),
                        }}
                      >
                        {getInitials(student.name)}
                      </Avatar>
                      <Box>
                        <Typography
                          variant="subtitle1"
                          fontWeight={600}
                          sx={{ color: "text.primary", lineHeight: 1.2 }}
                        >
                          {student.name}
                        </Typography>
                        <Chip
                          label={
                            student.endDate && student.assignedSessions > 0
                              ? "En tratamiento"
                              : "Sin sesiones"
                          }
                          size="small"
                          sx={{
                            height: 20,
                            fontSize: "0.7rem",
                            mt: 0.5,
                            bgcolor:
                              student.endDate && student.assignedSessions > 0
                                ? alpha(theme.palette.success.main, 0.1)
                                : alpha(theme.palette.warning.main, 0.1),
                            color:
                              student.endDate && student.assignedSessions > 0
                                ? theme.palette.success.dark
                                : theme.palette.warning.dark,
                            fontWeight: 600,
                          }}
                        />
                      </Box>
                    </Box>

                    <Divider sx={{ my: 1.5, opacity: 0.6 }} />

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        mb: 1.5,
                        gap: 1,
                      }}
                    >
                      <EventNoteOutlinedIcon
                        fontSize="small"
                        color="action"
                        sx={{ opacity: 0.7 }}
                      />
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ fontWeight: 500 }}
                      >
                        Inicio: {formatDate(student.startDate)}
                      </Typography>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          mb: 0.5,
                        }}
                      >
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ fontWeight: 500 }}
                        >
                          Progreso de sesiones
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.primary"
                          sx={{ fontWeight: 600 }}
                        >
                          {student.completedSessions}/{student.assignedSessions}
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={progress}
                        sx={{
                          height: 6,
                          borderRadius: 3,
                          bgcolor: alpha(theme.palette.primary.main, 0.1),
                          "& .MuiLinearProgress-bar": {
                            borderRadius: 3,
                          },
                        }}
                      />
                    </Box>

                    {student.endDate ? (
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          mb: 2,
                          gap: 1,
                          bgcolor: alpha(theme.palette.info.main, 0.05),
                          p: 1.5,
                          borderRadius: 2,
                        }}
                      >
                        <AccessTimeIcon
                          fontSize="small"
                          color="info"
                          sx={{ opacity: 0.8 }}
                        />
                        <Typography
                          variant="body2"
                          color="info.main"
                          sx={{ fontWeight: 500 }}
                        >
                          {getWeeksLeft(student.startDate, student.endDate)}
                        </Typography>
                      </Box>
                    ) : (
                      <Alert
                        severity="info"
                        sx={{
                          mb: 2,
                          borderRadius: 2,
                          "& .MuiAlert-icon": {
                            alignItems: "center",
                          },
                        }}
                        icon={<CalendarMonthOutlinedIcon fontSize="inherit" />}
                      >
                        <Typography variant="body2">
                          Aún no se agendaron sesiones
                        </Typography>
                      </Alert>
                    )}

                    <Box sx={{ flexGrow: 1 }} />

                    <Button
                      variant="contained"
                      fullWidth
                      color="primary"
                      startIcon={<PersonOutlineIcon />}
                      onClick={() => {
                        if (
                          !student.treatmentId ||
                          isNaN(student.treatmentId)
                        ) {
                          console.warn(
                            "❌ treatmentId no válido para estudiante:",
                            student
                          );
                          return;
                        }

                        navigate(
                          `/dashboard/tratamientos/${student.treatmentId}`,
                          {
                            state: { studentName: student.name },
                          }
                        );
                      }}
                      sx={{
                        py: 1.2,
                        fontWeight: 600,
                        borderRadius: 2,
                        boxShadow: `0 4px 12px ${alpha(
                          theme.palette.primary.main,
                          0.2
                        )}`,
                        "&:hover": {
                          boxShadow: `0 6px 16px ${alpha(
                            theme.palette.primary.main,
                            0.3
                          )}`,
                          transform: "translateY(-2px)",
                        },
                        transition: "all 0.3s ease",
                      }}
                    >
                      Seguir tratamiento
                    </Button>
                  </CardContent>
                </Card>
              </Box>
            );
          })}
        </Grid>
      )}
    </Box>
  );
};

export default AssignedStudents;
