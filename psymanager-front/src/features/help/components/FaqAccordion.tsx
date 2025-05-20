"use client";

import type React from "react";
import { useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  useTheme,
  alpha,
  Paper,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import ColorLensOutlinedIcon from "@mui/icons-material/ColorLensOutlined";
import EditCalendarOutlinedIcon from "@mui/icons-material/EditCalendarOutlined";
import PersonOffOutlinedIcon from "@mui/icons-material/PersonOffOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import NoteAltOutlinedIcon from "@mui/icons-material/NoteAltOutlined";
import AssignmentTurnedInOutlinedIcon from "@mui/icons-material/AssignmentTurnedInOutlined";

interface FaqItem {
  question: string;
  answer: string;
  category: "calendario" | "estudiantes" | "sesiones" | "general";
  icon: React.ReactNode;
}

const faqItems: FaqItem[] = [
  {
    question: "¿Cómo creo mis horarios de atención?",
    answer:
      "Dirígete a la pestaña 'Calendario'. Puedes cambiar entre vistas mensual, semanal o diaria. Luego, haz clic sobre un espacio vacío del calendario en el día y hora deseados. Se abrirá un modal donde puedes definir o ajustar la fecha y hora del nuevo horario de atención.",
    category: "calendario",
    icon: <CalendarTodayOutlinedIcon />,
  },
  {
    question: "¿Qué significan los colores en el calendario?",
    answer:
      "En el calendario del terapeuta se utilizan dos colores: Verde representa tus propios horarios disponibles. Azul indica horarios ya ocupados por otros terapeutas (solo visibles como referencia).",
    category: "calendario",
    icon: <ColorLensOutlinedIcon />,
  },
  {
    question: "¿Cómo edito un horario?",
    answer:
      "Haz clic sobre uno de tus horarios en color verde en el calendario. Se abrirá un modal que te permite modificar la hora, duración o eliminar el horario.",
    category: "calendario",
    icon: <EditCalendarOutlinedIcon />,
  },
  {
    question: "¿Qué pasa si un estudiante no asiste?",
    answer:
      "Puedes registrar la inasistencia desde la ficha del tratamiento, en el detalle de la sesión correspondiente.",
    category: "sesiones",
    icon: <PersonOffOutlinedIcon />,
  },
  {
    question: "¿Dónde veo los datos de mis pacientes?",
    answer:
      "Ve a la pestaña 'Estudiantes'. Al hacer clic sobre un estudiante, accederás a su detalle, incluyendo citas, notas y estado del tratamiento.",
    category: "estudiantes",
    icon: <PeopleAltOutlinedIcon />,
  },
  {
    question: "¿Puedo agregar notas a una sesión?",
    answer:
      "Sí. Dentro del detalle del tratamiento, cada sesión tiene una opción para agregar o editar una nota relacionada.",
    category: "sesiones",
    icon: <NoteAltOutlinedIcon />,
  },
  {
    question: "¿Cómo cierro un tratamiento?",
    answer:
      "Accede a la ficha del estudiante y haz clic en el botón 'Cerrar tratamiento'. Se generará un resumen final con sus sesiones registradas.",
    category: "estudiantes",
    icon: <AssignmentTurnedInOutlinedIcon />,
  },
];

const FaqAccordion: React.FC = () => {
  const theme = useTheme();
  const [expanded, setExpanded] = useState<string | false>(false);

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  // Función para obtener el color de la categoría
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "calendario":
        return theme.palette.primary.main;
      case "estudiantes":
        return theme.palette.info.main;
      case "sesiones":
        return theme.palette.success.main;
      default:
        return theme.palette.secondary.main;
    }
  };

  return (
    <Box>
      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          overflow: "hidden",
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        {faqItems.map((item, index) => (
          <Accordion
            key={`faq-${index}`}
            expanded={expanded === `panel${index}`}
            onChange={handleChange(`panel${index}`)}
            disableGutters
            elevation={0}
            sx={{
              "&:before": {
                display: "none",
              },
              borderBottom: index < faqItems.length - 1 ? "1px solid" : "none",
              borderColor: "divider",
            }}
          >
            <AccordionSummary
              expandIcon={
                <ExpandMoreIcon
                  sx={{
                    color:
                      expanded === `panel${index}`
                        ? getCategoryColor(item.category)
                        : "text.secondary",
                    transition: "transform 0.3s",
                    transform:
                      expanded === `panel${index}`
                        ? "rotate(180deg)"
                        : "rotate(0)",
                  }}
                />
              }
              sx={{
                minHeight: 56,
                px: 3,
                py: 1,
                transition: "all 0.2s",
                bgcolor:
                  expanded === `panel${index}`
                    ? alpha(getCategoryColor(item.category), 0.05)
                    : "transparent",
                "&:hover": {
                  bgcolor:
                    expanded === `panel${index}`
                      ? alpha(getCategoryColor(item.category), 0.08)
                      : alpha(theme.palette.grey[100], 0.5),
                },
                "& .MuiAccordionSummary-content": {
                  margin: 0,
                },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 36,
                    height: 36,
                    borderRadius: 1.5,
                    bgcolor: alpha(getCategoryColor(item.category), 0.1),
                    color: getCategoryColor(item.category),
                  }}
                >
                  {item.icon}
                </Box>
                <Typography
                  fontWeight={600}
                  color={
                    expanded === `panel${index}`
                      ? getCategoryColor(item.category)
                      : "text.primary"
                  }
                >
                  {item.question}
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails
              sx={{
                px: 3,
                py: 2,
                bgcolor: alpha(theme.palette.background.default, 0.5),
                borderTop: "1px solid",
                borderColor: alpha(theme.palette.divider, 0.5),
              }}
            >
              <Box sx={{ pl: 7 }}>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ lineHeight: 1.7 }}
                >
                  {item.answer}
                </Typography>
              </Box>
            </AccordionDetails>
          </Accordion>
        ))}
      </Paper>
    </Box>
  );
};

export default FaqAccordion;
