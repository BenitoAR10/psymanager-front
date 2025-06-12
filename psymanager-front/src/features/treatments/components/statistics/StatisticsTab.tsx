"use client";

import type React from "react";
import {
  Box,
  CircularProgress,
  Typography,
  useTheme,
  alpha,
  Fade,
} from "@mui/material";
import type {
  HourlySeriesResponseDto,
  CategoryCountResponseDto,
} from "../../types";
import TotalExercisesCard from "./TotalExercisesCard";
import HourlyExercisesChart from "./HourlyExercisesChart";
import CategoryDistributionChart from "./CategoryDistributionChart";

interface StatisticsTabProps {
  data?: HourlySeriesResponseDto;
  loading?: boolean;
  error?: string;
  categoryData?: CategoryCountResponseDto[];
  categoryLoading?: boolean;
}

/**
 * Pestaña de estadísticas que agrupa:
 *   - Conteo total
 *   - Serie horaria (línea)
 *   - Distribución por categoría (torta)
 */
const StatisticsTab: React.FC<StatisticsTabProps> = ({
  data,
  loading,
  error,
  categoryData,
  categoryLoading,
}) => {
  const theme = useTheme();

  if (loading) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        sx={{
          height: 400,
          borderRadius: 3,
          bgcolor: alpha(theme.palette.background.paper, 0.8),
          boxShadow: `0 4px 20px ${alpha(theme.palette.common.black, 0.08)}`,
        }}
      >
        <CircularProgress
          size={48}
          thickness={4}
          sx={{
            color: theme.palette.primary.main,
            mb: 2,
          }}
        />
        <Typography
          variant="h6"
          color="text.secondary"
          sx={{ fontWeight: 500 }}
        >
          Cargando estadísticas...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          p: 4,
          textAlign: "center",
          borderRadius: 3,
          bgcolor: alpha(theme.palette.error.main, 0.05),
          border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
        }}
      >
        <Typography color="error" variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
          Error al cargar datos
        </Typography>
        <Typography color="text.secondary">{error}</Typography>
      </Box>
    );
  }

  if (!data) {
    return (
      <Box
        sx={{
          p: 4,
          textAlign: "center",
          borderRadius: 3,
          bgcolor: alpha(theme.palette.background.paper, 0.8),
          boxShadow: `0 4px 20px ${alpha(theme.palette.common.black, 0.08)}`,
        }}
      >
        <Typography
          variant="h6"
          color="text.secondary"
          sx={{ fontWeight: 500 }}
        >
          No hay datos disponibles
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Selecciona un período diferente para ver las estadísticas
        </Typography>
      </Box>
    );
  }

  return (
    <Fade in={true} timeout={600}>
      <Box
        sx={{
          p: 3,
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "300px 1fr 300px",
          },
          gap: 3,
          minHeight: 400,
        }}
      >
        {/* Total */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
          }}
        >
          <TotalExercisesCard total={data.total} />
        </Box>

        {/* Serie horaria */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            minHeight: 350,
          }}
        >
          <HourlyExercisesChart data={data} loading={false} error={undefined} />
        </Box>

        {/* Torta por categoría */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
          }}
        >
          {categoryLoading ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
                borderRadius: 3,
                bgcolor: alpha(theme.palette.background.paper, 0.8),
                boxShadow: `0 4px 20px ${alpha(
                  theme.palette.common.black,
                  0.08
                )}`,
                p: 3,
              }}
            >
              <CircularProgress size={32} thickness={4} sx={{ mb: 2 }} />
              <Typography variant="body2" color="text.secondary">
                Cargando categorías...
              </Typography>
            </Box>
          ) : categoryData && categoryData.length > 0 ? (
            <CategoryDistributionChart byCategory={categoryData} />
          ) : (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
                borderRadius: 3,
                bgcolor: alpha(theme.palette.background.paper, 0.8),
                boxShadow: `0 4px 20px ${alpha(
                  theme.palette.common.black,
                  0.08
                )}`,
                p: 3,
                textAlign: "center",
              }}
            >
              <Typography
                variant="h6"
                color="text.secondary"
                sx={{ fontWeight: 500, mb: 1 }}
              >
                Sin datos por categoría
              </Typography>
              <Typography variant="body2" color="text.secondary">
                No hay ejercicios categorizados en este período
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Fade>
  );
};

export default StatisticsTab;
