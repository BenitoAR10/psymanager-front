"use client";

import type React from "react";
import {
  Typography,
  Box,
  Skeleton,
  Alert,
  Button,
  useTheme,
  alpha,
  Paper,
  Container,
} from "@mui/material";
import { useAuth } from "../../auth/context/AuthContext";
import { useStudentsQuery } from "../hooks/useStudentsQuery";
import StudentsList from "../components/StudentsList";
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import SimpleSearchBar from "../../../components/common/SimpleSearchBar";

const StudentsPage: React.FC = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const therapistId = user?.userId ?? 0;
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const {
    data: students = [],
    isLoading,
    isError,
    refetch,
  } = useStudentsQuery(therapistId);

  const [selectedCareer, setSelectedCareer] = useState("");

  const careerOptions = useMemo(() => {
    const careers = students.map((s) => s.careerName).filter(Boolean);
    return Array.from(new Set(careers)).sort();
  }, [students]);

  // Filtrar estudiantes según búsqueda
  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const matchesName = student.studentName
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesCareer = selectedCareer
        ? student.careerName === selectedCareer
        : true;

      return matchesName && matchesCareer;
    });
  }, [students, searchTerm, selectedCareer]);

  // Renderizar skeletons durante la carga
  const renderSkeletons = () => {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {[1, 2, 3, 4].map((item) => (
          <Skeleton
            key={item}
            variant="rectangular"
            height={70}
            sx={{ borderRadius: 2 }}
          />
        ))}
      </Box>
    );
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Encabezado con título y descripción */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: "8px",
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mr: 2,
            }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 3L1 9L5 11.18V17.18L12 21L19 17.18V11.18L21 10.09V17H23V9L12 3ZM18.82 9L12 12.72L5.18 9L12 5.28L18.82 9ZM17 15.99L12 18.72L7 15.99V12.27L12 15L17 12.27V15.99Z"
                fill="#4DB6AC"
              />
            </svg>
          </Box>
          <Typography variant="h5" fontWeight={600} color="#2A3548">
            Estudiantes atendidos
          </Typography>
        </Box>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ ml: 7, maxWidth: 800 }}
        >
          Consulta los estudiantes que te han sido asignados. Puedes buscar por
          nombre y acceder a sus tratamientos.
        </Typography>
      </Box>

      {/* Barra de búsqueda mejorada */}
      <SimpleSearchBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCareer={selectedCareer}
        setSelectedCareer={setSelectedCareer}
        careerOptions={careerOptions}
        totalResults={filteredStudents.length}
      />

      {/* Contenido principal */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
          overflow: "hidden",
        }}
      >
        {isLoading ? (
          <Box sx={{ p: 3 }}>{renderSkeletons()}</Box>
        ) : isError ? (
          <Box sx={{ p: 3 }}>
            <Alert
              severity="error"
              variant="outlined"
              action={
                <Button color="inherit" size="small" onClick={() => refetch()}>
                  Reintentar
                </Button>
              }
              sx={{ borderRadius: 2 }}
            >
              Ocurrió un error al cargar los estudiantes. Por favor, intenta
              nuevamente.
            </Alert>
          </Box>
        ) : filteredStudents.length === 0 ? (
          <Box
            sx={{
              textAlign: "center",
              py: 8,
              px: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 1,
              }}
            >
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 3L1 9L5 11.18V17.18L12 21L19 17.18V11.18L21 10.09V17H23V9L12 3ZM18.82 9L12 12.72L5.18 9L12 5.28L18.82 9ZM17 15.99L12 18.72L7 15.99V12.27L12 15L17 12.27V15.99Z"
                  fill="#4DB6AC"
                />
              </svg>
            </Box>
            <Typography variant="h6" fontWeight={600} color="text.primary">
              {searchTerm
                ? "No se encontraron estudiantes con ese nombre"
                : "No tienes estudiantes asignados"}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ maxWidth: 500, mx: "auto" }}
            >
              {searchTerm
                ? "Intenta con otro término de búsqueda."
                : "Cuando se te asignen estudiantes, aparecerán en esta lista."}
            </Typography>
            {searchTerm && (
              <Button
                variant="outlined"
                color="primary"
                onClick={() => setSearchTerm("")}
                sx={{
                  mt: 2,
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 500,
                  px: 3,
                  py: 0.75,
                  borderWidth: "1.5px",
                  "&:hover": {
                    borderWidth: "1.5px",
                    bgcolor: alpha(theme.palette.primary.main, 0.05),
                  },
                }}
              >
                Limpiar búsqueda
              </Button>
            )}
          </Box>
        ) : (
          <StudentsList
            students={filteredStudents}
            onSelect={(treatmentId, _patientId, name) => {
              navigate(`/dashboard/tratamientos/${treatmentId}`, {
                state: { studentName: name },
              });
            }}
          />
        )}
      </Paper>
    </Container>
  );
};

export default StudentsPage;
