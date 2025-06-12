"use client";

import type React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  useTheme,
  alpha,
} from "@mui/material";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

interface TotalExercisesCardProps {
  total: number;
}

/**
 * Card que muestra el número total de ejercicios completados.
 */
const TotalExercisesCard: React.FC<TotalExercisesCardProps> = ({ total }) => {
  const theme = useTheme();

  return (
    <Card
      elevation={0}
      sx={{
        height: "100%",
        borderRadius: 3,
        bgcolor: alpha(theme.palette.background.paper, 0.8),
        boxShadow: `0 4px 20px ${alpha(theme.palette.common.black, 0.08)}`,
        transition: "all 0.3s ease",
        position: "relative",
        overflow: "hidden",
        "&:hover": {
          boxShadow: `0 6px 24px ${alpha(theme.palette.common.black, 0.12)}`,
          transform: "translateY(-2px)",
        },
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
        },
      }}
    >
      <CardContent
        sx={{
          p: 3,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 2,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: "text.primary",
              }}
            >
              Total de ejercicios
            </Typography>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 2,
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FitnessCenterIcon
                sx={{
                  color: theme.palette.primary.main,
                  fontSize: 24,
                }}
              />
            </Box>
          </Box>

          <Typography
            variant="h2"
            component="p"
            sx={{
              fontWeight: 700,
              color: theme.palette.primary.main,
              mb: 1,
              fontSize: { xs: "2.5rem", md: "3rem" },
              lineHeight: 1,
            }}
          >
            {total.toLocaleString()}
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
            <TrendingUpIcon
              sx={{
                color: theme.palette.success.main,
                fontSize: 16,
              }}
            />
            <Typography
              variant="caption"
              sx={{
                color: theme.palette.success.main,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Período activo
            </Typography>
          </Box>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontWeight: 500 }}
          >
            En el período seleccionado
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default TotalExercisesCard;
