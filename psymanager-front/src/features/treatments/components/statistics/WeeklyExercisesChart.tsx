// src/features/treatments/components/statistics/WeeklyExercisesChart.tsx
import React from "react";
import { Box, Typography } from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { WeeklyCountResponseDto } from "../../types";

interface WeeklyExercisesChartProps {
  series: WeeklyCountResponseDto[];
}

/**
 * Gráfica de línea que muestra ejercicios completados por semana,
 * con etiquetas simplificadas ("Sem 21", "Sem 22", …).
 */
const WeeklyExercisesChart: React.FC<WeeklyExercisesChartProps> = ({
  series,
}) => {
  // Transformamos la serie para usar etiquetas legibles
  const data = series.map((item) => ({
    weekLabel: `Sem ${item.week}`,
    count: item.count,
  }));

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Ejercicios por semana
      </Typography>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart
          data={data}
          margin={{ top: 0, right: 20, bottom: 0, left: 0 }}
        >
          <XAxis dataKey="weekLabel" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="count"
            stroke="#1976d2"
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default WeeklyExercisesChart;
