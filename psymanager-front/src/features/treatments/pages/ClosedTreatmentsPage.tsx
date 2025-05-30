"use client";

import React, { useState, useMemo } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Chip,
  Stack,
  useTheme,
  Avatar,
  Divider,
  Card,
  alpha,
  Button,
  Tooltip,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import HistoryEduIcon from "@mui/icons-material/HistoryEdu";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";
import { useAuth } from "../../auth/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useClosedTreatmentsQuery } from "../hooks/useClosedTreatmentsQuery";
import dayjs from "dayjs";
import SimpleSearchBar from "../../../components/common/SimpleSearchBar";

const ClosedTreatmentsPage: React.FC = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const therapistId = user?.userId ?? 0;

  // Estado para el buscador
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  const {
    data: treatments,
    isLoading,
    isError,
    error,
  } = useClosedTreatmentsQuery(therapistId);

  // Filtrar tratamientos según el término de búsqueda
  const filteredTreatments = useMemo(() => {
    if (!treatments) return [];

    return treatments.filter(
      (treatment) =>
        treatment.studentName
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        treatment.reason.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [treatments, searchTerm]);

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", pb: 4 }}>
      {/* Encabezado con descripción */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            mb: 2,
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <HistoryEduIcon sx={{ color: "primary.main" }} />
          Tratamientos Finalizados
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ maxWidth: 800 }}
        >
          Consulta los tratamientos que han sido finalizados junto con sus
          detalles de cierre. Puedes buscar por nombre de estudiante o razón de
          cierre.
        </Typography>
      </Box>

      {/* Barra de búsqueda mejorada */}
      <SimpleSearchBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        placeholder="Buscar por nombre o razón de cierre..."
        totalResults={filteredTreatments.length}
      />

      {/* Contenido principal */}
      {isLoading ? (
        <Card
          elevation={0}
          sx={{
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
            p: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: 300,
          }}
        >
          <CircularProgress size={48} thickness={4} sx={{ mb: 2 }} />
          <Typography variant="body1" color="text.secondary">
            Cargando tratamientos finalizados...
          </Typography>
        </Card>
      ) : isError ? (
        <Card
          elevation={0}
          sx={{
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
            p: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: 300,
            bgcolor: alpha(theme.palette.error.light, 0.05),
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
            <SentimentDissatisfiedIcon fontSize="large" />
          </Avatar>
          <Typography
            variant="h6"
            color="error.main"
            sx={{ mb: 1, fontWeight: 600 }}
          >
            Error al cargar datos
          </Typography>
          <Typography
            color="text.secondary"
            variant="body2"
            component="span"
            sx={{ mb: 3, textAlign: "center", maxWidth: 500 }}
          >
            {error instanceof Error
              ? error.message
              : "No se pudieron cargar los tratamientos. Intenta nuevamente."}
          </Typography>

          <Button variant="outlined" color="primary">
            Reintentar
          </Button>
        </Card>
      ) : filteredTreatments.length > 0 ? (
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
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography
              variant="subtitle1"
              fontWeight={600}
              color="text.primary"
            >
              {filteredTreatments.length} tratamientos encontrados
            </Typography>
            {searchTerm && (
              <Chip
                label={`Búsqueda: "${searchTerm}"`}
                onDelete={() => setSearchTerm("")}
                size="small"
                color="primary"
                variant="outlined"
              />
            )}
          </Box>
          <List disablePadding>
            {filteredTreatments.map((treatment, index) => (
              <React.Fragment key={treatment.treatmentId}>
                <ListItem
                  sx={{
                    px: 3,
                    py: 2.5,
                    transition: "background-color 0.2s",
                    "&:hover": {
                      backgroundColor: alpha(theme.palette.primary.main, 0.03),
                    },
                  }}
                >
                  <Avatar
                    sx={{
                      bgcolor: alpha(theme.palette.success.main, 0.1),
                      color: theme.palette.success.main,
                      mr: 2,
                    }}
                  >
                    <CheckCircleOutlineIcon />
                  </Avatar>
                  <ListItemText
                    primary={
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 0.5 }}
                      >
                        <Typography
                          variant="subtitle1"
                          fontWeight={600}
                          color="text.primary"
                        >
                          {treatment.studentName}
                        </Typography>
                        <Chip
                          label={treatment.reason}
                          size="small"
                          icon={<HistoryEduIcon />}
                          sx={{
                            ml: 2,
                            bgcolor: alpha(theme.palette.info.main, 0.1),
                            color: theme.palette.info.dark,
                            fontWeight: 500,
                            "& .MuiChip-icon": {
                              color: theme.palette.info.main,
                            },
                          }}
                        />
                      </Box>
                    }
                    secondary={
                      <Stack
                        direction={{ xs: "column", sm: "row" }}
                        spacing={{ xs: 1, sm: 2 }}
                        mt={0.5}
                        alignItems={{ xs: "flex-start", sm: "center" }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                          }}
                        >
                          <CalendarTodayOutlinedIcon
                            fontSize="small"
                            sx={{
                              color: theme.palette.text.secondary,
                              fontSize: 16,
                            }}
                          />
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            component="span"
                          >
                            Inicio:{" "}
                            {dayjs(treatment.startDate).format("DD/MM/YYYY")}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                          }}
                        >
                          <EventAvailableIcon
                            fontSize="small"
                            sx={{
                              color: theme.palette.success.main,
                              fontSize: 16,
                            }}
                          />
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            component="span"
                          >
                            Cierre:{" "}
                            {dayjs(treatment.closingDate).format("DD/MM/YYYY")}
                          </Typography>
                        </Box>
                        <Chip
                          size="small"
                          label={`${treatment.completedSessions} sesiones`}
                          variant="outlined"
                          color="primary"
                          sx={{ height: 24 }}
                        />
                      </Stack>
                    }
                  />
                  <Box
                    sx={{
                      display: { xs: "none", md: "flex" },
                      alignItems: "center",
                      ml: 2,
                    }}
                  >
                    <Tooltip title="Ver detalles completos">
                      <Button
                        variant="outlined"
                        size="small"
                        color="primary"
                        startIcon={<PersonOutlineIcon />}
                        sx={{
                          borderRadius: 1.5,
                          textTransform: "none",
                          fontWeight: 600,
                        }}
                        onClick={() =>
                          navigate(
                            `/dashboard/historiales/${treatment.treatmentId}`
                          )
                        }
                      >
                        Ver historial
                      </Button>
                    </Tooltip>
                  </Box>
                </ListItem>
                {index < filteredTreatments.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </Card>
      ) : (
        <Card
          elevation={0}
          sx={{
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
            p: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: 300,
          }}
        >
          <Avatar
            sx={{
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              color: theme.palette.primary.main,
              width: 64,
              height: 64,
              mb: 2,
            }}
          >
            <HistoryEduIcon fontSize="large" />
          </Avatar>

          <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
            {searchTerm
              ? "No se encontraron resultados"
              : "No hay tratamientos finalizados"}
          </Typography>

          <Typography
            color="text.secondary"
            variant="body2"
            sx={{ textAlign: "center", maxWidth: 500 }}
          >
            {searchTerm
              ? `No se encontraron tratamientos que coincidan con "${searchTerm}". Intenta con otra búsqueda.`
              : "Cuando finalices tratamientos con tus estudiantes, aparecerán en esta lista."}
          </Typography>

          {searchTerm && (
            <Box sx={{ mt: 3 }}>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => setSearchTerm("")}
              >
                Limpiar búsqueda
              </Button>
            </Box>
          )}
        </Card>
      )}
    </Box>
  );
};

export default ClosedTreatmentsPage;
