"use client";

import type React from "react";
import {
  Box,
  Button,
  Typography,
  Grid,
  Paper,
  useTheme,
  alpha,
} from "@mui/material";
import AssignmentIcon from "@mui/icons-material/Assignment";

import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";

interface ResourceLink {
  title: string;
  description: string;
  icon: React.ReactNode;
  url: string;
  buttonText: string;
  color: string;
}

const resources: ResourceLink[] = [
  {
    title: "Guía del usuario",
    description:
      "Manual completo con instrucciones detalladas sobre todas las funcionalidades de la plataforma.",
    icon: <AssignmentIcon />,
    url: "https://docs.google.com/document/d/1ixM6VDPDK9S-XNRYccwJxV6h-j7HA5HdZWi5JJfyKNA/edit?usp=sharing",
    buttonText: "Descargar PDF",
    color: "#4DB6AC", // Teal
  },

  {
    title: "Capacitación",
    description:
      "Solicita una sesión de capacitación personalizada para ti o tu equipo.",
    icon: <SchoolOutlinedIcon />,
    url: "https://calendly.com/psymanager/capacitacion",
    buttonText: "Agendar sesión",
    color: "#FF9800", // Orange
  },
];

const HelpLinks: React.FC = () => {
  const theme = useTheme();

  return (
    <Box sx={{ mt: 4 }}>
      <Typography
        variant="h5"
        fontWeight={700}
        color="text.primary"
        gutterBottom
      >
        Recursos útiles
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Encuentra documentación, tutoriales y otros recursos para sacar el
        máximo provecho de la plataforma.
      </Typography>

      <Grid container spacing={3}>
        {resources.map((resource, index) => (
          <Box
            key={index}
            sx={{
              width: { xs: "100%", sm: "calc(50% - 12px)" }, // Aproximadamente 6 columnas con separación
              mb: 3,
            }}
          >
            <Paper
              elevation={0}
              sx={{
                p: 3,
                height: "100%",
                borderRadius: 3,
                border: "1px solid",
                borderColor: "divider",
                transition: "all 0.3s ease",
                "&:hover": {
                  boxShadow: theme.shadows[2],
                  transform: "translateY(-4px)",
                  borderColor: alpha(resource.color, 0.3),
                },
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    bgcolor: alpha(resource.color, 0.1),
                    color: resource.color,
                    mr: 2,
                    flexShrink: 0,
                  }}
                >
                  {resource.icon}
                </Box>
                <Box>
                  <Typography
                    variant="h6"
                    fontWeight={600}
                    color="text.primary"
                  >
                    {resource.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 0.5 }}
                  >
                    {resource.description}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ mt: "auto", pt: 2 }}>
                <Button
                  variant="outlined"
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  startIcon={resource.icon}
                  sx={{
                    borderColor: alpha(resource.color, 0.5),
                    color: resource.color,
                    "&:hover": {
                      borderColor: resource.color,
                      bgcolor: alpha(resource.color, 0.05),
                    },
                    borderRadius: 2,
                    fontWeight: 600,
                  }}
                >
                  {resource.buttonText}
                </Button>
              </Box>
            </Paper>
          </Box>
        ))}
      </Grid>
    </Box>
  );
};

export default HelpLinks;
