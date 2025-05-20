"use client";

import type React from "react";
import {
  Box,
  Typography,
  Paper,
  useTheme,
  alpha,
  Button,
  Grid,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";

const ContactBlock: React.FC = () => {
  const theme = useTheme();

  const contactMethods = [
    {
      icon: <EmailIcon />,
      title: "Correo electrónico",
      content: "soporte@psymanager.app",
      action: "Enviar correo",
      link: "mailto:soporte@psymanager.app",
      color: theme.palette.primary.main,
    },
    {
      icon: <PhoneOutlinedIcon />,
      title: "Teléfono",
      content: "+591 2 2782222",
      action: "Llamar",
      link: "tel:+59122782222",
      color: theme.palette.success.main,
    },
    {
      icon: <WhatsAppIcon />,
      title: "WhatsApp",
      content: "+591 70000000",
      action: "Enviar mensaje",
      link: "https://wa.me/59170000000",
      color: "#25D366", // Color de WhatsApp
    },
  ];

  return (
    <Paper
      elevation={0}
      sx={{
        p: 0,
        mt: 4,
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          p: 3,
          bgcolor: alpha(theme.palette.primary.main, 0.05),
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Typography
          variant="h5"
          fontWeight={700}
          color="text.primary"
          gutterBottom
        >
          ¿Necesitas más ayuda?
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Nuestro equipo de soporte está disponible para ayudarte con cualquier
          duda o problema que puedas tener.
        </Typography>
      </Box>

      <Grid container spacing={0}>
        {/* Información de contacto */}
        <Box
          sx={{
            width: { xs: "100%", md: "58%" }, // similar a md=7
            px: 1,
          }}
        >
          <Box sx={{ p: 3 }}>
            <Typography
              variant="subtitle1"
              fontWeight={600}
              color="text.primary"
              gutterBottom
            >
              Contáctanos
            </Typography>

            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}
            >
              {contactMethods.map((method, index) => (
                <Box
                  key={index}
                  sx={{ display: "flex", alignItems: "flex-start" }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 40,
                      height: 40,
                      borderRadius: 2,
                      bgcolor: alpha(method.color, 0.1),
                      color: method.color,
                      mr: 2,
                      flexShrink: 0,
                    }}
                  >
                    {method.icon}
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      variant="subtitle2"
                      fontWeight={600}
                      color="text.primary"
                    >
                      {method.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 1 }}
                    >
                      {method.content}
                    </Typography>
                    <Button
                      variant="text"
                      size="small"
                      href={method.link}
                      target={
                        method.link.startsWith("http") ? "_blank" : undefined
                      }
                      sx={{
                        color: method.color,
                        fontWeight: 600,
                        fontSize: "0.8rem",
                        p: 0,
                        "&:hover": {
                          bgcolor: "transparent",
                          textDecoration: "underline",
                        },
                      }}
                    >
                      {method.action}
                    </Button>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>

        {/* Horarios y ubicación */}
        <Box
          sx={{
            width: { xs: "100%", md: "42%" }, // similar a md=5
            px: 1,
            mt: { xs: 4, md: 0 },
          }}
        >
          <Box
            sx={{
              p: 3,
              height: "100%",
              bgcolor: alpha(theme.palette.grey[50], 0.5),
              borderLeft: { xs: "none", md: "1px solid" },
              borderTop: { xs: "1px solid", md: "none" },
              borderColor: "divider",
            }}
          >
            <Typography
              variant="subtitle1"
              fontWeight={600}
              color="text.primary"
              gutterBottom
            >
              Horarios y ubicación
            </Typography>

            <Box
              sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}
            >
              <Box sx={{ display: "flex", alignItems: "flex-start" }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 40,
                    height: 40,
                    borderRadius: 2,
                    bgcolor: alpha(theme.palette.info.main, 0.1),
                    color: theme.palette.info.main,
                    mr: 2,
                    flexShrink: 0,
                  }}
                >
                  <AccessTimeIcon />
                </Box>
                <Box>
                  <Typography
                    variant="subtitle2"
                    fontWeight={600}
                    color="text.primary"
                  >
                    Horario de atención
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Lunes a Viernes
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    08:00–18:00
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: "flex", alignItems: "flex-start" }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 40,
                    height: 40,
                    borderRadius: 2,
                    bgcolor: alpha(theme.palette.warning.main, 0.1),
                    color: theme.palette.warning.main,
                    mr: 2,
                    flexShrink: 0,
                  }}
                >
                  <LocationOnOutlinedIcon />
                </Box>
                <Box>
                  <Typography
                    variant="subtitle2"
                    fontWeight={600}
                    color="text.primary"
                  >
                    Ubicación
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Departamento de Psicología
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Universidad Católica Boliviana
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Av. 14 de Septiembre #4807, La Paz
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Grid>
    </Paper>
  );
};

export default ContactBlock;
