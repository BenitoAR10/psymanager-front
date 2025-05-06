import React from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  Divider,
  Button,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";

export interface AssignedStudent {
  name: string;
  days: string;
  time: string;
  status: "Activo" | "Pendiente" | string;
}

interface AssignedStudentsProps {
  students: AssignedStudent[];
  onViewAll: () => void;
}

const AssignedStudents: React.FC<AssignedStudentsProps> = ({
  students,
  onViewAll,
}) => (
  <Box>
    {/* Título y botón “Ver todos” */}
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mb: 3,
      }}
    >
      <Typography
        variant="h5"
        sx={{
          fontWeight: 600,
          color: "text.primary",
          display: "flex",
          alignItems: "center",
          "&::after": {
            content: '""',
            display: "block",
            width: 40,
            height: 3,
            backgroundColor: "primary.main",
            marginLeft: 2,
            borderRadius: 1.5,
          },
        }}
      >
        Estudiantes asignados
      </Typography>
      <Button
        variant="text"
        color="primary"
        endIcon={<ArrowForwardIosIcon sx={{ fontSize: 14 }} />}
        onClick={onViewAll}
        sx={{
          fontWeight: 600,
          "&:hover": { backgroundColor: "rgba(77,182,172,0.08)" },
        }}
      >
        Ver todos
      </Button>
    </Box>

    {/* Grid de tarjetas */}
    <Grid container spacing={3}>
      {students.map((student) => (
        <Grid item xs={12} sm={6} md={4} key={student.name}>
          <Card
            elevation={1}
            sx={{
              borderRadius: 3,
              height: "100%",
              position: "relative",
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: 4,
                backgroundColor:
                  student.status === "Activo" ? "success.main" : "warning.main",
                borderRadius: "12px 12px 0 0",
              },
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Avatar
                  sx={{
                    width: 56,
                    height: 56,
                    mr: 2,
                    bgcolor:
                      student.status === "Activo"
                        ? "success.light"
                        : "warning.light",
                    color:
                      student.status === "Activo"
                        ? "success.dark"
                        : "warning.dark",
                    fontWeight: 600,
                    fontSize: "1.2rem",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  }}
                >
                  {student.name.charAt(0)}
                </Avatar>
                <Box>
                  <Typography variant="h6" fontWeight={600}>
                    {student.name}
                  </Typography>
                  <Chip
                    label="Estudiante"
                    size="small"
                    sx={{
                      height: 22,
                      fontSize: "0.7rem",
                      bgcolor:
                        student.status === "Activo"
                          ? "success.light"
                          : "warning.light",
                      color:
                        student.status === "Activo"
                          ? "success.dark"
                          : "warning.dark",
                      fontWeight: 600,
                      borderRadius: 1,
                    }}
                  />
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: 2.5,
                  backgroundColor: "grey.50",
                  p: 1.5,
                  borderRadius: 2,
                }}
              >
                <AccessTimeIcon
                  fontSize="small"
                  sx={{ mr: 1, color: "text.secondary" }}
                />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Horario
                  </Typography>
                  <Typography variant="body2" fontWeight={500}>
                    {student.days} • {student.time}
                  </Typography>
                </Box>
              </Box>

              <Button
                variant="contained"
                fullWidth
                color="primary"
                startIcon={<PersonOutlineIcon />}
                sx={{ py: 1, fontWeight: 600 }}
              >
                Ver historial
              </Button>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  </Box>
);

export default AssignedStudents;
