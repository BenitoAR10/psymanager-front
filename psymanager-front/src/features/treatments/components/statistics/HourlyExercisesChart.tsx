"use client";

import type React from "react";
import dayjs from "dayjs";
import "dayjs/locale/es"; // Importar locale español
import {
  Box,
  Typography,
  CircularProgress,
  useTheme,
  alpha,
  Card,
  CardContent,
} from "@mui/material";
import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Area,
  AreaChart,
} from "recharts";
import TimelineIcon from "@mui/icons-material/Timeline";
import type {
  HourlySeriesResponseDto,
  HourlyCountResponseDto,
} from "../../types";

interface HourlyExercisesChartProps {
  data?: HourlySeriesResponseDto;
  loading?: boolean;
  error?: string;
}

// Definir tipos específicos para los datos procesados
interface ProcessedChartData {
  dayKey: string;
  dayOfWeek: string;
  fullDate: string;
  fullDateTime: string; // Nueva propiedad para fecha y hora completa
  count: number;
  originalDate: string;
}

// Tipo para el tooltip
interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    payload: ProcessedChartData;
  }>;
  label?: string;
}

const HourlyExercisesChart: React.FC<HourlyExercisesChartProps> = ({
  data,
  loading,
  error,
}) => {
  const theme = useTheme();

  // Configurar dayjs para español
  dayjs.locale("es");

  if (loading) {
    return (
      <Card
        elevation={0}
        sx={{
          height: "100%",
          borderRadius: 3,
          bgcolor: alpha(theme.palette.background.paper, 0.8),
          boxShadow: `0 4px 20px ${alpha(theme.palette.common.black, 0.08)}`,
        }}
      >
        <CardContent
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <CircularProgress />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card
        elevation={0}
        sx={{
          height: "100%",
          borderRadius: 3,
          bgcolor: alpha(theme.palette.error.main, 0.05),
          border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
        }}
      >
        <CardContent
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <Typography color="error">{error}</Typography>
        </CardContent>
      </Card>
    );
  }

  if (!data?.series.length) {
    return (
      <Card
        elevation={0}
        sx={{
          height: "100%",
          borderRadius: 3,
          bgcolor: alpha(theme.palette.background.paper, 0.8),
          boxShadow: `0 4px 20px ${alpha(theme.palette.common.black, 0.08)}`,
        }}
      >
        <CardContent
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <Typography>No hay datos disponibles</Typography>
        </CardContent>
      </Card>
    );
  }

  // Procesar datos para agrupar por día de la semana con tipos específicos
  const processedData = data.series.reduce(
    (acc: ProcessedChartData[], item: HourlyCountResponseDto) => {
      const date = dayjs(item.hour);
      const dayOfWeek = date.format("ddd"); // Lun, Mar, Mié, etc.
      const dayKey = date.format("YYYY-MM-DD"); // Para agrupar por día único

      // Buscar si ya existe este día en el acumulador
      const existingDay = acc.find((d) => d.dayKey === dayKey);

      if (existingDay) {
        // Si ya existe, sumar el count
        existingDay.count += item.count;
      } else {
        // Si no existe, crear nueva entrada
        acc.push({
          dayKey,
          dayOfWeek: dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1), // Capitalizar primera letra
          fullDate: date.format("DD/MM/YYYY"),
          fullDateTime: date.format(
            "dddd, DD [de] MMMM [de] YYYY [a las] HH:mm"
          ), // Fecha y hora completa
          count: item.count,
          originalDate: item.hour,
        });
      }

      return acc;
    },
    []
  );

  // Ordenar por fecha para mantener orden cronológico
  const chartData = processedData.sort(
    (a, b) => dayjs(a.originalDate).valueOf() - dayjs(b.originalDate).valueOf()
  );

  const maxValue = Math.max(...chartData.map((d) => d.count));
  const avgValue =
    chartData.reduce((sum, d) => sum + d.count, 0) / chartData.length;

  // Componente personalizado para el tooltip
  const CustomTooltip: React.FC<TooltipProps> = ({ active, payload }) => {
    if (active && payload && payload.length > 0) {
      const data = payload[0].payload;
      return (
        <Box
          sx={{
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
            borderRadius: 2,
            p: 2,
            boxShadow: `0 4px 12px ${alpha(theme.palette.common.black, 0.1)}`,
            minWidth: 200,
          }}
        >
          <Typography
            variant="subtitle2"
            sx={{ fontWeight: 600, mb: 1, color: theme.palette.text.primary }}
          >
            {data.dayOfWeek} ({data.fullDate})
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: theme.palette.text.secondary, mb: 0.5 }}
          >
            {data.fullDateTime}
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: theme.palette.secondary.main, fontWeight: 600 }}
          >
            Cantidad: {data.count}{" "}
            {data.count === 1 ? "ejercicio" : "ejercicios"}
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
            mb: 3,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                bgcolor: alpha(theme.palette.secondary.main, 0.1),
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <TimelineIcon
                sx={{
                  color: theme.palette.secondary.main,
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
              Ejercicios por día
            </Typography>
          </Box>

          <Box sx={{ textAlign: "right" }}>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: "block", fontWeight: 500 }}
            >
              Pico máximo
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: theme.palette.secondary.main,
                fontWeight: 600,
              }}
            >
              {maxValue}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ flex: 1, minHeight: 200 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
            >
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={theme.palette.secondary.main}
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor={theme.palette.secondary.main}
                    stopOpacity={0.05}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={alpha(theme.palette.divider, 0.3)}
                vertical={false}
              />
              <XAxis
                dataKey="dayOfWeek"
                tick={{
                  fill: theme.palette.text.secondary,
                  fontSize: 12,
                }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                allowDecimals={false}
                tick={{
                  fill: theme.palette.text.secondary,
                  fontSize: 12,
                }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="count"
                stroke={theme.palette.secondary.main}
                strokeWidth={3}
                fill="url(#colorGradient)"
                dot={{
                  fill: theme.palette.secondary.main,
                  strokeWidth: 2,
                  stroke: theme.palette.background.paper,
                  r: 4,
                }}
                activeDot={{
                  r: 6,
                  fill: theme.palette.secondary.main,
                  stroke: theme.palette.background.paper,
                  strokeWidth: 2,
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mt: 2,
            pt: 2,
            borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          }}
        >
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontWeight: 500 }}
          >
            Total: {data.total} ejercicios
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontWeight: 500 }}
          >
            Promedio: {avgValue.toFixed(1)} por día
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default HourlyExercisesChart;
