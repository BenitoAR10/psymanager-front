"use client";

import type React from "react";
import {
  Box,
  Typography,
  useTheme,
  alpha,
  Card,
  CardContent,
} from "@mui/material";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import PieChartIcon from "@mui/icons-material/PieChart";
import type { CategoryCountResponseDto } from "../../types";

const COLORS = [
  "#64b5f6", // Azul claro
  "#1976d2", // Azul
  "#ffb74d", // Naranja
  "#81c784", // Verde
  "#e57373", // Rojo claro
  "#ba68c8", // Púrpura
  "#4db6ac", // Teal
];

interface CategoryDistributionChartProps {
  byCategory: CategoryCountResponseDto[];
}

/**
 * Gráfica de torta que muestra distribución de ejercicios por categoría.
 */
const CategoryDistributionChart: React.FC<CategoryDistributionChartProps> = ({
  byCategory,
}) => {
  const theme = useTheme();

  const total = byCategory.reduce((sum, item) => sum + item.count, 0);
  const maxCategory = byCategory.reduce(
    (max, item) => (item.count > max.count ? item : max),
    byCategory[0]
  );

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const percentage = ((data.value / total) * 100).toFixed(1);
      return (
        <Box
          sx={{
            bgcolor: theme.palette.background.paper,
            p: 1.5,
            borderRadius: 1,
            boxShadow: `0 4px 12px ${alpha(theme.palette.common.black, 0.1)}`,
            border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
          }}
        >
          <Typography variant="body2" fontWeight={600}>
            {data.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {data.value} ejercicios ({percentage}%)
          </Typography>
        </Box>
      );
    }
    return null;
  };

  return (
    <Card
      elevation={0}
      sx={{
        height: "100%",
        borderRadius: 3,
        bgcolor: alpha(theme.palette.background.paper, 0.8),
        boxShadow: `0 4px 20px ${alpha(theme.palette.common.black, 0.08)}`,
        transition: "all 0.3s ease",
        "&:hover": {
          boxShadow: `0 6px 24px ${alpha(theme.palette.common.black, 0.12)}`,
        },
      }}
    >
      <CardContent
        sx={{ p: 3, height: "100%", display: "flex", flexDirection: "column" }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                bgcolor: alpha(theme.palette.warning.main, 0.1),
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <PieChartIcon
                sx={{
                  color: theme.palette.warning.main,
                  fontSize: 20,
                }}
              />
            </Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: "text.primary",
              }}
            >
              Distribución por categoría
            </Typography>
          </Box>
        </Box>

        <Box sx={{ flex: 1, minHeight: 200 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={byCategory}
                dataKey="count"
                nameKey="category"
                cx="50%"
                cy="50%"
                outerRadius={70}
                innerRadius={25}
                paddingAngle={2}
                strokeWidth={2}
                stroke={theme.palette.background.paper}
              >
                {byCategory.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </Box>

        <Box
          sx={{
            mt: 2,
            pt: 2,
            borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 1,
            }}
          >
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontWeight: 500 }}
            >
              Categoría principal
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
                color: theme.palette.primary.main,
              }}
            >
              {maxCategory?.category}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {byCategory.map((item, index) => (
              <Box
                key={item.category}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  fontSize: "0.75rem",
                }}
              >
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    bgcolor: COLORS[index % COLORS.length],
                  }}
                />
                <Typography variant="caption" color="text.secondary">
                  {item.category} ({item.count})
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CategoryDistributionChart;
