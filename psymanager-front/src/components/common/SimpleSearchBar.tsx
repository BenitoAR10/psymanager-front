"use client";

import type React from "react";
import {
  Box,
  Paper,
  InputBase,
  IconButton,
  Tooltip,
  Chip,
  useTheme,
  alpha,
  Typography,
  MenuItem,
  TextField,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import ClearIcon from "@mui/icons-material/Clear";

interface SimpleSearchBarProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  placeholder?: string;
  totalResults?: number;
  selectedCareer?: string;
  setSelectedCareer?: (value: string) => void;
  careerOptions?: string[];
}

const SimpleSearchBar: React.FC<SimpleSearchBarProps> = ({
  searchTerm,
  setSearchTerm,
  selectedCareer,
  setSelectedCareer,
  careerOptions,
  placeholder = "Buscar por nombre...",
  totalResults,
}) => {
  const theme = useTheme();

  const handleReset = () => {
    setSearchTerm("");
  };

  const hasActiveSearch = !!searchTerm || !!selectedCareer;

  return (
    <Box sx={{ mb: 4 }}>
      {/* Encabezado */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="subtitle1" fontWeight={500} color="text.secondary">
          Buscar estudiantes
        </Typography>
        {totalResults !== undefined && (
          <Chip
            label={`${totalResults} ${
              totalResults === 1 ? "resultado" : "resultados"
            }`}
            size="small"
            color="primary"
            variant="outlined"
          />
        )}
      </Box>

      {/* Barra de búsqueda y selector */}
      <Paper
        elevation={1}
        sx={{
          p: 2,
          borderRadius: 3,
          bgcolor: "background.paper",
          border: "1px solid",
          borderColor: alpha(theme.palette.divider, 0.5),
          display: "flex",
          gap: 2,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        {/* Buscar por nombre */}
        <Box sx={{ flex: 1, minWidth: 220 }}>
          <Paper
            elevation={0}
            sx={{
              display: "flex",
              alignItems: "center",
              p: "8px 12px",
              borderRadius: 2,
              border: "1px solid",
              borderColor: "divider",
              bgcolor: "grey.50",
              "&:hover, &:focus-within": {
                borderColor: "primary.main",
                bgcolor: "background.paper",
                boxShadow: `0 0 0 2px ${alpha(
                  theme.palette.primary.main,
                  0.08
                )}`,
              },
            }}
          >
            <SearchIcon sx={{ color: "text.secondary", mr: 1 }} />
            <InputBase
              placeholder={placeholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ flex: 1, fontSize: "0.95rem" }}
            />
            {searchTerm && (
              <IconButton
                size="small"
                onClick={() => setSearchTerm("")}
                sx={{
                  ml: 1,
                  color: "text.secondary",
                  "&:hover": {
                    color: "error.main",
                    bgcolor: alpha(theme.palette.error.main, 0.1),
                  },
                }}
              >
                <ClearIcon fontSize="small" />
              </IconButton>
            )}
          </Paper>
        </Box>

        {/* Filtrar por carrera */}
        {setSelectedCareer && selectedCareer !== undefined && careerOptions && (
          <TextField
            select
            size="small"
            label="Filtrar por carrera"
            value={selectedCareer}
            onChange={(e) => setSelectedCareer(e.target.value)}
            sx={{ minWidth: 220, flexShrink: 0 }}
          >
            <MenuItem value="">Todas las carreras</MenuItem>
            {careerOptions.map((career) => (
              <MenuItem key={career} value={career}>
                {career}
              </MenuItem>
            ))}
          </TextField>
        )}

        {/* Botón de reset */}
        <Tooltip title="Limpiar filtros">
          <span>
            <IconButton
              onClick={handleReset}
              disabled={!hasActiveSearch}
              sx={{
                color: hasActiveSearch ? "primary.main" : "text.disabled",
                bgcolor: hasActiveSearch
                  ? alpha(theme.palette.primary.main, 0.1)
                  : "transparent",
                "&:hover": {
                  bgcolor: hasActiveSearch
                    ? alpha(theme.palette.primary.main, 0.2)
                    : "transparent",
                },
              }}
            >
              <RefreshIcon />
            </IconButton>
          </span>
        </Tooltip>
      </Paper>

      {/* Chips de filtros activos */}
      {hasActiveSearch && (
        <Box
          sx={{
            mt: 2,
            pt: 2,
            borderTop: "1px solid",
            borderColor: "divider",
            display: "flex",
            gap: 1,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <Typography variant="caption" color="text.secondary" sx={{ mr: 1 }}>
            Filtros activos:
          </Typography>

          {searchTerm && (
            <Chip
              label={`Nombre: "${searchTerm}"`}
              onDelete={() => setSearchTerm("")}
              size="small"
              variant="outlined"
              color="primary"
            />
          )}

          {selectedCareer && setSelectedCareer && (
            <Chip
              label={`Carrera: "${selectedCareer}"`}
              onDelete={() => setSelectedCareer("")}
              size="small"
              variant="outlined"
              color="primary"
            />
          )}
        </Box>
      )}
    </Box>
  );
};

export default SimpleSearchBar;
