import React from "react";
import dayjs from "dayjs";
import { Box, Typography, CircularProgress, useTheme } from "@mui/material";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import type {
  DailySeriesResponseDto,
  DailyCountResponseDto,
} from "../../types";

interface DailyExercisesChartProps {
  data?: DailySeriesResponseDto;
  loading?: boolean;
  error?: string;
}

/**
 * Gráfica de líneas que muestra ejercicios completados por día.
 * El eje X muestra la fecha en formato DD/MM.
 */
const DailyExercisesChart: React.FC<DailyExercisesChartProps> = ({
  data,
  loading,
  error,
}) => {
  const theme = useTheme();

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        sx={{ height: 240 }}
      >
        <CircularProgress />
      </Box>
    );
  }
  if (error) {
    return <Typography color="error">{error}</Typography>;
  }
  if (!data || !data.series.length) {
    return (
      <Typography>
        No hay datos disponibles para el rango seleccionado.
      </Typography>
    );
  }

  const chartData: { dayLabel: string; count: number }[] = data.series.map(
    (d: DailyCountResponseDto) => ({
      dayLabel: dayjs(d.day).format("DD/MM"),
      count: d.count,
    })
  );

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Ejercicios diarios
      </Typography>
      <ResponsiveContainer width="100%" height={240}>
        <LineChart
          data={chartData}
          margin={{ top: 0, right: 16, bottom: 0, left: 0 }}
        >
          <XAxis
            dataKey="dayLabel"
            tick={{ fill: theme.palette.text.secondary }}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fill: theme.palette.text.secondary }}
          />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="count"
            stroke={theme.palette.primary.main}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
      <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
        Total: {data.total} ejercicios en el rango.
      </Typography>
    </Box>
  );
};

export default DailyExercisesChart;
