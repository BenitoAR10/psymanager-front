"use client";

import type React from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  useTheme,
  alpha,
} from "@mui/material";
import FaqAccordion from "../components/FaqAccordion";
import HelpLinks from "../components/HelpLinks";
import ContactBlock from "../components/ContactBlock";

const HelpPage: React.FC = () => {
  const theme = useTheme();

  return (
    <Container maxWidth="lg" sx={{ py: 0 }}>
      {/* Encabezado */}
      <Paper
        elevation={0}
        sx={{
          p: 4,
          mb: 4,
          borderRadius: 3,
          background: `linear-gradient(135deg, ${alpha(
            theme.palette.primary.main,
            0.05
          )} 0%, ${alpha(theme.palette.primary.main, 0.1)} 100%)`,
          border: "1px solid",
          borderColor: alpha(theme.palette.primary.main, 0.1),
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: -20,
            right: -20,
            width: 150,
            height: 150,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${alpha(
              theme.palette.primary.main,
              0.2
            )} 0%, ${alpha(theme.palette.primary.main, 0)} 70%)`,
          }}
        />

        <Box sx={{ position: "relative", zIndex: 1, maxWidth: "800px" }}>
          <Typography
            variant="h4"
            fontWeight={700}
            gutterBottom
            color="text.primary"
          >
            Centro de Ayuda
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mb: 2, fontSize: "1.1rem", lineHeight: 1.6 }}
          >
            Aquí encontrarás respuestas rápidas a preguntas frecuentes,
            información sobre el uso del calendario, recursos útiles y cómo
            contactar al equipo de soporte.
          </Typography>
        </Box>
      </Paper>

      {/* Preguntas frecuentes */}
      <Box sx={{ mb: 6 }}>
        <Typography
          variant="h5"
          fontWeight={700}
          gutterBottom
          sx={{
            display: "flex",
            alignItems: "center",
            mb: 3,
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
          Preguntas frecuentes
        </Typography>
        <FaqAccordion />
      </Box>

      {/* Recursos útiles */}
      <Box sx={{ mb: 6 }}>
        <HelpLinks />
      </Box>

      {/* Contacto */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h5"
          fontWeight={700}
          gutterBottom
          sx={{
            display: "flex",
            alignItems: "center",
            mb: 3,
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
          Contacto
        </Typography>
        <ContactBlock />
      </Box>
    </Container>
  );
};

export default HelpPage;
