"use client";

import type React from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Stack,
  Card,
  Button,
  Chip,
  Avatar,
  alpha,
  useTheme,
  Divider,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { useClosedTreatmentDetailQuery } from "../hooks/useClosedTreatmentDetailQuery";
import dayjs from "dayjs";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import HistoryEduIcon from "@mui/icons-material/HistoryEdu";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import SummarizeOutlinedIcon from "@mui/icons-material/SummarizeOutlined";
import RecommendOutlinedIcon from "@mui/icons-material/RecommendOutlined";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import NoteAltOutlinedIcon from "@mui/icons-material/NoteAltOutlined";
import TopicOutlinedIcon from "@mui/icons-material/TopicOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import NextPlanOutlinedIcon from "@mui/icons-material/NextPlanOutlined";

const ClosedTreatmentDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const treatmentId = Number(id);
  const navigate = useNavigate();
  const theme = useTheme();

  const { data, isLoading, isError, error } =
    useClosedTreatmentDetailQuery(treatmentId);

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "60vh",
          p: 4,
        }}
      >
        <CircularProgress size={48} thickness={4} sx={{ mb: 3 }} />
        <Typography variant="h6" color="text.secondary" fontWeight={500}>
          Cargando historial del tratamiento...
        </Typography>
      </Box>
    );
  }

  if (isError || !data) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "60vh",
          p: 4,
        }}
      >
        <Avatar
          sx={{
            bgcolor: alpha(theme.palette.error.main, 0.1),
            color: theme.palette.error.main,
            width: 64,
            height: 64,
            mb: 2,
          }}
        >
          <ErrorOutlineIcon fontSize="large" />
        </Avatar>
        <Typography
          variant="h5"
          color="error.main"
          fontWeight={600}
          sx={{ mb: 1 }}
        >
          Error al cargar los datos
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          align="center"
          sx={{ maxWidth: 500, mb: 3 }}
        >
          {(error as Error)?.message ||
            "No se pudo cargar el historial del tratamiento. Intenta nuevamente más tarde."}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate(-1)}
          startIcon={<ArrowBackIcon />}
          sx={{
            borderRadius: 2,
            px: 3,
            py: 1,
            fontWeight: 600,
          }}
        >
          Volver a tratamientos
        </Button>
      </Box>
    );
  }

  return (
    <Box maxWidth="lg" mx="auto" p={{ xs: 2, md: 4 }} pb={6}>
      {/* Botón de regreso y título */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "flex-start", sm: "center" },
          justifyContent: "space-between",
          mb: 4,
          gap: 2,
        }}
      >
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          sx={{
            textTransform: "none",
            fontWeight: 600,
            borderRadius: 2,
            px: 2,
            py: 1,
            bgcolor: alpha(theme.palette.primary.main, 0.05),
            color: "primary.main",
            border: "none",
            "&:hover": {
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              border: "none",
            },
          }}
          variant="outlined"
        >
          Volver a tratamientos
        </Button>

        <Chip
          icon={<CheckCircleOutlineIcon />}
          label="Tratamiento finalizado"
          color="success"
          sx={{
            fontWeight: 600,
            px: 1,
            "& .MuiChip-icon": {
              color: "inherit",
            },
          }}
        />
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 3,
        }}
      >
        {/* Columna izquierda */}
        <Box sx={{ width: { xs: "100%", md: "33.333%" } }}>
          {/* Información general */}
          <Card
            elevation={0}
            sx={{
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
              mb: 3,
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                p: 2,
                bgcolor: alpha(theme.palette.primary.main, 0.05),
                borderBottom: "1px solid",
                borderColor: "divider",
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <PersonOutlineIcon color="primary" />
              <Typography variant="h6" fontWeight={600} color="text.primary">
                Información del estudiante
              </Typography>
            </Box>

            <Box sx={{ p: 3 }}>
              <Stack spacing={2.5}>
                <Box
                  sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}
                >
                  <Avatar
                    sx={{
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      color: theme.palette.primary.main,
                      width: 36,
                      height: 36,
                    }}
                  >
                    {data.studentName.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Nombre del estudiante
                    </Typography>
                    <Typography variant="subtitle1" fontWeight={600}>
                      {data.studentName}
                    </Typography>
                  </Box>
                </Box>

                <Box
                  sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}
                >
                  <SchoolOutlinedIcon
                    sx={{
                      color: theme.palette.info.main,
                      bgcolor: alpha(theme.palette.info.main, 0.1),
                      p: 0.7,
                      borderRadius: 1,
                      width: 36,
                      height: 36,
                    }}
                  />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Semestre
                    </Typography>
                    <Typography variant="subtitle1" fontWeight={600}>
                      {data.semester}
                    </Typography>
                  </Box>
                </Box>

                <Box
                  sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}
                >
                  <HistoryEduIcon
                    sx={{
                      color: theme.palette.warning.main,
                      bgcolor: alpha(theme.palette.warning.main, 0.1),
                      p: 0.7,
                      borderRadius: 1,
                      width: 36,
                      height: 36,
                    }}
                  />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Motivo del tratamiento
                    </Typography>
                    <Typography variant="subtitle1" fontWeight={600}>
                      {data.reason}
                    </Typography>
                  </Box>
                </Box>
              </Stack>
            </Box>
          </Card>

          {/* Fechas y cierre */}
          <Card
            elevation={0}
            sx={{
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                p: 2,
                bgcolor: alpha(theme.palette.primary.main, 0.05),
                borderBottom: "1px solid",
                borderColor: "divider",
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <CalendarTodayOutlinedIcon color="primary" />
              <Typography variant="h6" fontWeight={600} color="text.primary">
                Fechas del tratamiento
              </Typography>
            </Box>

            <Box sx={{ p: 3 }}>
              <Stack spacing={2.5}>
                <Box
                  sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}
                >
                  <CalendarTodayOutlinedIcon
                    sx={{
                      color: theme.palette.primary.main,
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      p: 0.7,
                      borderRadius: 1,
                      width: 36,
                      height: 36,
                    }}
                  />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Fecha de inicio
                    </Typography>
                    <Typography variant="subtitle1" fontWeight={600}>
                      {dayjs(data.startDate).format("DD MMMM, YYYY")}
                    </Typography>
                  </Box>
                </Box>

                <Box
                  sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}
                >
                  <EventAvailableIcon
                    sx={{
                      color: theme.palette.success.main,
                      bgcolor: alpha(theme.palette.success.main, 0.1),
                      p: 0.7,
                      borderRadius: 1,
                      width: 36,
                      height: 36,
                    }}
                  />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Fecha de cierre
                    </Typography>
                    <Typography variant="subtitle1" fontWeight={600}>
                      {dayjs(data.closingDate).format("DD MMMM, YYYY")}
                    </Typography>
                  </Box>
                </Box>

                <Box
                  sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}
                >
                  <AssignmentOutlinedIcon
                    sx={{
                      color: theme.palette.error.main,
                      bgcolor: alpha(theme.palette.error.main, 0.1),
                      p: 0.7,
                      borderRadius: 1,
                      width: 36,
                      height: 36,
                    }}
                  />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Motivo de cierre
                    </Typography>
                    <Typography variant="subtitle1" fontWeight={600}>
                      {data.closureReason}
                    </Typography>
                  </Box>
                </Box>
              </Stack>
            </Box>
          </Card>
        </Box>

        {/* Columna derecha */}
        <Box sx={{ width: { xs: "100%", md: "66.666%" } }}>
          {/* Ficha clínica final */}
          {data.caseFile && (
            <Card
              elevation={0}
              sx={{
                borderRadius: 3,
                border: "1px solid",
                borderColor: "divider",
                mb: 3,
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  p: 2,
                  bgcolor: alpha(theme.palette.primary.main, 0.05),
                  borderBottom: "1px solid",
                  borderColor: "divider",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <SummarizeOutlinedIcon color="primary" />
                <Typography variant="h6" fontWeight={600} color="text.primary">
                  Ficha clínica final
                </Typography>
              </Box>

              <Box sx={{ p: 3 }}>
                <Stack spacing={3}>
                  <Box>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 1,
                      }}
                    >
                      <SummarizeOutlinedIcon
                        fontSize="small"
                        sx={{ color: theme.palette.primary.main }}
                      />
                      <Typography
                        variant="subtitle1"
                        fontWeight={600}
                        color="text.primary"
                      >
                        Resumen del tratamiento
                      </Typography>
                    </Box>
                    <Typography
                      variant="body1"
                      sx={{
                        bgcolor: alpha(theme.palette.background.default, 0.5),
                        p: 2,
                        borderRadius: 2,
                        border: "1px solid",
                        borderColor: "divider",
                      }}
                    >
                      {data.caseFile.summary}
                    </Typography>
                  </Box>

                  <Box>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 1,
                      }}
                    >
                      <RecommendOutlinedIcon
                        fontSize="small"
                        sx={{ color: theme.palette.primary.main }}
                      />
                      <Typography
                        variant="subtitle1"
                        fontWeight={600}
                        color="text.primary"
                      >
                        Recomendaciones
                      </Typography>
                    </Box>
                    <Typography
                      variant="body1"
                      sx={{
                        bgcolor: alpha(theme.palette.background.default, 0.5),
                        p: 2,
                        borderRadius: 2,
                        border: "1px solid",
                        borderColor: "divider",
                      }}
                    >
                      {data.caseFile.recommendations}
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            </Card>
          )}

          {/* Notas de sesión */}
          <Card
            elevation={0}
            sx={{
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                p: 2,
                bgcolor: alpha(theme.palette.primary.main, 0.05),
                borderBottom: "1px solid",
                borderColor: "divider",
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <NoteAltOutlinedIcon color="primary" />
              <Typography variant="h6" fontWeight={600} color="text.primary">
                Historial de sesiones
              </Typography>
              <Chip
                label={`${data.sessionNotes.length} sesiones`}
                size="small"
                sx={{
                  ml: 1,
                  fontWeight: 600,
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  color: theme.palette.primary.main,
                }}
              />
            </Box>

            <Box sx={{ p: 3 }}>
              {data.sessionNotes.length === 0 ? (
                <Box
                  sx={{
                    textAlign: "center",
                    py: 4,
                    bgcolor: alpha(theme.palette.background.default, 0.5),
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="body1" color="text.secondary">
                    No hay notas de sesión registradas para este tratamiento.
                  </Typography>
                </Box>
              ) : (
                <Stack spacing={3}>
                  {data.sessionNotes.map((note, index) => (
                    <Card
                      key={index}
                      elevation={0}
                      sx={{
                        borderRadius: 2,
                        border: "1px solid",
                        borderColor: "divider",
                        bgcolor: alpha(theme.palette.background.default, 0.5),
                        position: "relative",
                        pl: 3,
                        "&::before": {
                          content: '""',
                          position: "absolute",
                          left: 0,
                          top: 0,
                          bottom: 0,
                          width: 4,
                          bgcolor: "primary.main",
                          borderRadius: "4px 0 0 4px",
                        },
                      }}
                    >
                      <Box sx={{ p: 2 }}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            mb: 2,
                          }}
                        >
                          <Typography variant="subtitle1" fontWeight={600}>
                            Sesión {index + 1}
                          </Typography>
                          <Chip
                            label={dayjs(note.sessionDate).format(
                              "DD MMM, YYYY"
                            )}
                            size="small"
                            sx={{
                              fontWeight: 500,
                              bgcolor: alpha(theme.palette.primary.main, 0.1),
                              color: theme.palette.primary.main,
                            }}
                          />
                        </Box>

                        <Divider sx={{ mb: 2 }} />

                        <Stack spacing={1.5}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "flex-start",
                              gap: 1,
                            }}
                          >
                            <TopicOutlinedIcon
                              fontSize="small"
                              sx={{
                                color: theme.palette.primary.main,
                                mt: 0.3,
                              }}
                            />
                            <Box>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                Temática abordada
                              </Typography>
                              <Typography variant="body2">
                                {note.topicAddressed || "-"}
                              </Typography>
                            </Box>
                          </Box>

                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "flex-start",
                              gap: 1,
                            }}
                          >
                            <SummarizeOutlinedIcon
                              fontSize="small"
                              sx={{ color: theme.palette.info.main, mt: 0.3 }}
                            />
                            <Box>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                Resumen de la sesión
                              </Typography>
                              <Typography variant="body2">
                                {note.sessionSummary || "-"}
                              </Typography>
                            </Box>
                          </Box>

                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "flex-start",
                              gap: 1,
                            }}
                          >
                            <VisibilityOutlinedIcon
                              fontSize="small"
                              sx={{
                                color: theme.palette.warning.main,
                                mt: 0.3,
                              }}
                            />
                            <Box>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                Observaciones relevantes
                              </Typography>
                              <Typography variant="body2">
                                {note.relevantObservations || "-"}
                              </Typography>
                            </Box>
                          </Box>

                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "flex-start",
                              gap: 1,
                            }}
                          >
                            <NextPlanOutlinedIcon
                              fontSize="small"
                              sx={{
                                color: theme.palette.success.main,
                                mt: 0.3,
                              }}
                            />
                            <Box>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                Próxima temática
                              </Typography>
                              <Typography variant="body2">
                                {note.nextTopic || "-"}
                              </Typography>
                            </Box>
                          </Box>
                        </Stack>
                      </Box>
                    </Card>
                  ))}
                </Stack>
              )}
            </Box>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

export default ClosedTreatmentDetailPage;
