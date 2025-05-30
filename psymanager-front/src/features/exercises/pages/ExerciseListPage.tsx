"use client";

import type React from "react";
import { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Chip,
  Stack,
  TextField,
  InputAdornment,
  Card,
  CardContent,
  IconButton,
  Divider,
  Skeleton,
  Alert,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Tooltip,
  Badge,
} from "@mui/material";
import { useExercises } from "../hooks/useExercises";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import MovieIcon from "@mui/icons-material/Movie";
import SearchIcon from "@mui/icons-material/Search";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import FilterListIcon from "@mui/icons-material/FilterList";
import RefreshIcon from "@mui/icons-material/Refresh";

const ExerciseListPage: React.FC = () => {
  const { data: exercises, isLoading, isError, refetch } = useExercises();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("todos");
  const [sortOrder] = useState<string>("recientes");

  // Función para filtrar y ordenar ejercicios
  const getFilteredExercises = () => {
    if (!exercises) return [];

    let filtered = [...exercises];

    // Filtrar por término de búsqueda
    if (searchTerm) {
      filtered = filtered.filter((ex) =>
        ex.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrar por categoría
    if (categoryFilter !== "todos") {
      filtered = filtered.filter((ex) => ex.category === categoryFilter);
    }

    // Ordenar
    switch (sortOrder) {
      case "puntos-mayor":
        filtered.sort((a, b) => b.pointsReward - a.pointsReward);
        break;
      case "puntos-menor":
        filtered.sort((a, b) => a.pointsReward - b.pointsReward);
        break;
      case "alfabetico":
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
    }

    return filtered;
  };

  // Obtener categorías únicas para el filtro
  const getUniqueCategories = () => {
    if (!exercises) return [];
    const categories = new Set(exercises.map((ex) => ex.category));
    return Array.from(categories);
  };

  // Función para obtener el color del chip según la categoría
  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "ansiedad":
        return "primary";
      case "estrés":
        return "secondary";
      case "relajación":
        return "success";
      default:
        return "default";
    }
  };

  // Función para truncar texto largo
  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text;
  };

  // Renderizar esqueletos durante la carga
  const renderSkeletons = () => {
    return Array(3)
      .fill(0)
      .map((_, index) => (
        <Paper key={index} elevation={2} sx={{ p: 3, borderRadius: 2 }}>
          <Box display="flex" justifyContent="space-between" mb={1}>
            <Skeleton variant="text" width="60%" height={32} />
            <Skeleton variant="rounded" width={80} height={24} />
          </Box>
          <Skeleton variant="text" width="40%" />
          <Box mt={1} display="flex" alignItems="center" gap={1}>
            <Skeleton variant="circular" width={20} height={20} />
            <Skeleton variant="text" width="30%" />
          </Box>
        </Paper>
      ));
  };

  const filteredExercises = getFilteredExercises();

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", px: { xs: 2, md: 3 } }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          mb: 4,
          gap: 2,
        }}
      >
        <Typography
          variant="h4"
          fontWeight={700}
          sx={{
            position: "relative",
            "&:after": {
              content: '""',
              position: "absolute",
              bottom: -8,
              left: 0,
              width: 60,
              height: 4,
              bgcolor: "primary.main",
              borderRadius: 2,
            },
          }}
        >
          Ejercicios de bienestar
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center" }}>
          {isLoading ? (
            <Skeleton variant="rounded" width={120} height={36} />
          ) : (
            <Badge
              badgeContent={filteredExercises.length}
              color="primary"
              sx={{ mr: 2 }}
            >
              <Typography variant="subtitle1">
                {filteredExercises.length === 1 ? "Ejercicio" : "Ejercicios"}
              </Typography>
            </Badge>
          )}

          <Tooltip title="Actualizar">
            <IconButton
              onClick={() => refetch()}
              color="primary"
              disabled={isLoading}
            >
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Filtros y búsqueda */}
      <Box
        sx={{
          mb: 4,
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 2,
          alignItems: "center",
          justifyContent: "space-between",
          bgcolor: "background.paper",
          p: 2,
          borderRadius: 2,
          boxShadow: 1,
        }}
      >
        <TextField
          placeholder="Buscar ejercicios..."
          variant="outlined"
          size="small"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
            sx: { borderRadius: 2 },
          }}
          sx={{ flex: 2 }}
        />

        <Box
          sx={{
            display: "flex",
            gap: 2,
            width: { xs: "100%", md: "auto" },
            flexWrap: { xs: "wrap", md: "nowrap" },
          }}
        >
          <FormControl size="small" sx={{ minWidth: 120, flex: 1 }}>
            <InputLabel id="category-filter-label">
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <FilterListIcon fontSize="small" />
                <span>Categoría</span>
              </Box>
            </InputLabel>
            <Select
              labelId="category-filter-label"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <FilterListIcon fontSize="small" />
                  <span>Categoría</span>
                </Box>
              }
              sx={{ borderRadius: 2 }}
            >
              <MenuItem value="todos">Todas</MenuItem>
              {getUniqueCategories().map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* Estado de carga */}
      {isLoading ? (
        <Stack spacing={3}>{renderSkeletons()}</Stack>
      ) : isError ? (
        <Alert
          severity="error"
          sx={{
            borderRadius: 2,
            mb: 3,
            display: "flex",
            alignItems: "center",
          }}
          action={
            <IconButton color="inherit" size="small" onClick={() => refetch()}>
              <RefreshIcon />
            </IconButton>
          }
        >
          Error al cargar los ejercicios. Por favor, intenta nuevamente.
        </Alert>
      ) : filteredExercises.length === 0 ? (
        <Box
          sx={{
            textAlign: "center",
            py: 8,
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 1,
          }}
        >
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No se encontraron ejercicios
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {searchTerm || categoryFilter !== "todos"
              ? "Prueba con otros filtros de búsqueda"
              : "Aún no hay ejercicios disponibles"}
          </Typography>
        </Box>
      ) : (
        <Box display="flex" flexWrap="wrap" gap={3}>
          {filteredExercises.map((exercise) => (
            <Box
              key={exercise.id}
              sx={{
                width: {
                  xs: "100%", // 1 por fila en pantallas pequeñas
                  sm: "calc(50% - 12px)", // 2 por fila con gap de 24px
                  md: "calc(33.33% - 16px)", // 3 por fila
                },
                display: "flex",
              }}
            >
              <Card
                elevation={2}
                sx={{
                  borderRadius: 3,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: 4,
                  },
                  position: "relative",
                  overflow: "visible",
                  flexGrow: 1,
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    top: -10,
                    right: 16,
                    zIndex: 1,
                  }}
                >
                  <Chip
                    label={exercise.category}
                    color={getCategoryColor(exercise.category)}
                    size="small"
                    sx={{ fontWeight: 500 }}
                  />
                </Box>

                <CardContent
                  sx={{
                    p: 3,
                    flexGrow: 1,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Typography
                    variant="h6"
                    fontWeight={600}
                    gutterBottom
                    title={exercise.title}
                  >
                    {truncateText(exercise.title, 40)}
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 2,
                      color: "text.secondary",
                    }}
                  >
                    <EmojiEventsIcon fontSize="small" color="primary" />
                    <Typography variant="body2">
                      {exercise.pointsReward}{" "}
                      {exercise.pointsReward === 1 ? "punto" : "puntos"}
                    </Typography>
                  </Box>

                  <Divider sx={{ my: 1.5 }} />

                  <Box
                    sx={{
                      mt: "auto",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      {exercise.audioUrl.endsWith(".mp4") ||
                      exercise.audioUrl.endsWith(".webm") ? (
                        <MovieIcon fontSize="small" color="action" />
                      ) : (
                        <MusicNoteIcon fontSize="small" color="action" />
                      )}
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{
                          maxWidth: "150px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                        title={exercise.audioUrl.split("/").pop()}
                      >
                        {exercise.audioUrl.split("/").pop()}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default ExerciseListPage;
