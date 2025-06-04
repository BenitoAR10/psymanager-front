"use client";

import type React from "react";
import {
  Box,
  Typography,
  useTheme,
  alpha,
  LinearProgress,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import type { AssignedPatientDto } from "../types";

export interface StudentsListProps {
  students: AssignedPatientDto[];
  onSelect?: (treatmentId: number, patientId: number, name: string) => void;
}

const StudentsList: React.FC<StudentsListProps> = ({ students, onSelect }) => {
  const theme = useTheme();

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();

  const isActive = (endDate?: string) => {
    if (!endDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const [y, m, d] = endDate.split("-").map(Number);
    const end = new Date(y, m - 1, d);
    return end >= today;
  };

  const formatDate = (isoDate?: string) => {
    if (!isoDate) return "-";
    const [year, month, day] = isoDate.split("-").map(Number);
    return new Date(year, month - 1, day).toLocaleDateString("es-BO", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Calcular el progreso de las sesiones
  const calculateProgress = (completed: number, total: number) => {
    if (total === 0) return 0;
    return (completed / total) * 100;
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {students.map((student) => {
        const active = student.endDate ? isActive(student.endDate) : false;
        const progress = calculateProgress(
          student.completedSessions,
          student.totalSessions
        );
        const bgColor = active ? "#f5f9f9" : "#fff";
        const borderColor = active ? "#4DB6AC" : "transparent";

        return (
          <Box
            key={student.treatmentId}
            sx={{
              display: "flex",
              alignItems: "center",
              bgcolor: bgColor,
              borderRadius: "12px",
              p: 2,
              cursor: "pointer",
              position: "relative",
              borderLeft: `4px solid ${borderColor}`,
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
              transition: "all 0.2s ease",
              "&:hover": {
                boxShadow: "0 3px 6px rgba(0,0,0,0.08)",
                transform: "translateY(-2px)",
              },
            }}
            onClick={() =>
              onSelect?.(
                student.treatmentId,
                student.patientId,
                student.studentName
              )
            }
          >
            {/* Iniciales */}
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                bgcolor: alpha(theme.palette.primary.light, 0.15),
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mr: 3,
                color: theme.palette.primary.main,
                fontWeight: 600,
                fontSize: "1rem",
              }}
            >
              {getInitials(student.studentName)}
            </Box>

            {/* Nombre e ID */}
            <Box sx={{ minWidth: 200, flex: 1 }}>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 600,
                  color: "#2A3548",
                  fontSize: "1rem",
                }}
              >
                {student.studentName}
              </Typography>
            </Box>

            {/* Fecha de inicio */}
            <Box
              sx={{
                minWidth: 140,
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M19 4H18V2H16V4H8V2H6V4H5C3.89 4 3.01 4.9 3.01 6L3 20C3 21.1 3.89 22 5 22H19C20.1 22 21 21.1 21 20V6C21 4.9 20.1 4 19 4ZM19 20H5V10H19V20ZM19 8H5V6H19V8Z"
                    fill="#9AA4B8"
                  />
                </svg>
                <Typography
                  variant="caption"
                  sx={{
                    color: "#9AA4B8",
                    ml: 1,
                  }}
                >
                  Inicio:
                </Typography>
              </Box>
              <Typography
                variant="body2"
                sx={{
                  color: "#2A3548",
                  fontWeight: 500,
                  fontSize: "0.875rem",
                }}
              >
                {formatDate(student.startDate)}
              </Typography>
            </Box>

            {/* Fecha de fin */}
            <Box
              sx={{
                minWidth: 140,
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M19 4H18V2H16V4H8V2H6V4H5C3.89 4 3.01 4.9 3.01 6L3 20C3 21.1 3.89 22 5 22H19C20.1 22 21 21.1 21 20V6C21 4.9 20.1 4 19 4ZM19 20H5V10H19V20ZM19 8H5V6H19V8Z"
                    fill="#9AA4B8"
                  />
                </svg>
                <Typography
                  variant="caption"
                  sx={{
                    color: "#9AA4B8",
                    ml: 1,
                  }}
                >
                  Fin:
                </Typography>
              </Box>
              <Typography
                variant="body2"
                sx={{
                  color: "#2A3548",
                  fontWeight: 500,
                  fontSize: "0.875rem",
                }}
              >
                {student.endDate ? formatDate(student.endDate) : "-"}
              </Typography>
            </Box>

            {/* Progreso */}
            <Box sx={{ flex: 1, minWidth: 200, mr: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M19 3H14.82C14.4 1.84 13.3 1 12 1C10.7 1 9.6 1.84 9.18 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM12 3C12.55 3 13 3.45 13 4C13 4.55 12.55 5 12 5C11.45 5 11 4.55 11 4C11 3.45 11.45 3 12 3ZM19 19H5V5H7V7H17V5H19V19Z"
                    fill="#9AA4B8"
                  />
                </svg>
                <Typography
                  variant="caption"
                  sx={{
                    color: "#9AA4B8",
                    ml: 1,
                  }}
                >
                  Progreso:
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: "#E53935",
                    ml: 0.5,
                    fontWeight: 600,
                  }}
                >
                  {student.completedSessions}/{student.totalSessions}
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{
                  height: 6,
                  borderRadius: 3,
                  bgcolor: "#FFEBEE",
                  "& .MuiLinearProgress-bar": {
                    bgcolor: "#E53935",
                  },
                }}
              />
            </Box>

            {/* Estado */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                color: active ? "#4DB6AC" : "#9E9E9E",
              }}
            >
              <VisibilityIcon sx={{ fontSize: 18 }} />
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  fontSize: "0.875rem",
                }}
              >
                {active ? "Activo" : "Finalizado"}
              </Typography>
            </Box>
          </Box>
        );
      })}
    </Box>
  );
};

export default StudentsList;
