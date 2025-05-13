"use client";

import type React from "react";
import {
  Grid,
  Box,
  Typography,
  Button,
  SvgIcon,
  useTheme,
  Paper,
  useMediaQuery,
} from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import MyLottieAnimation from "../../../components/animations/MyLottieAnimation";
import logoPSIUCB from "../../../assets/images/logo.jpg";

const Login: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleLogin = () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/google";
  };

  return (
    <Grid
      container
      sx={{
        width: "100vw",
        height: isMobile ? "auto" : "100vh", // Altura automática en móvil
        margin: 0,
      }}
    >
      {/* Sección izquierda/superior */}
      <Box
        sx={{
          width: { xs: "100%", md: "50%" }, // Equivalente a xs={12} md={6}
          position: "relative",
          background: `linear-gradient(135deg, ${theme.palette.primary.light}, ${theme.palette.primary.dark})`,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
          minHeight: isMobile ? "220px" : "auto", // Altura mínima en móvil
          py: isMobile ? 4 : 0, // Padding vertical en móvil
        }}
      >
        {/* Arcos superiores - Ocultos en móvil para simplificar */}
        {!isMobile && (
          <>
            <Box
              sx={{
                position: "absolute",
                top: -200,
                left: 0,
                width: "100%",
                height: 400,
                borderRadius: "50%",
                backgroundColor: "rgba(255, 255, 255, 0.15)",
              }}
            />
            <Box
              sx={{
                position: "absolute",
                top: -250,
                left: 0,
                width: "100%",
                height: 500,
                borderRadius: "50%",
                backgroundColor: "rgba(255, 255, 255, 0.1)",
              }}
            />
          </>
        )}

        {/* Ícono de corazón - Ajustado para móvil */}
        <Box
          sx={{
            position: "absolute",
            top: isMobile ? "5%" : "10%",
            zIndex: 10,
          }}
        >
          <SvgIcon
            sx={{
              color: "rgba(255, 255, 255, 0.9)",
              fontSize: isMobile ? 28 : 36,
              filter: "drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.2))",
            }}
          >
            <path
              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 
              2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09
              C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5
              c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
            />
          </SvgIcon>
        </Box>

        {/* Logo PSI UCB - Tamaño reducido en móvil */}
        <Box
          sx={{
            position: "relative",
            zIndex: 10,
            width: isMobile ? "80%" : 500,
            maxWidth: isMobile ? 280 : "none",
            height: "auto",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: isMobile ? 2 : 4,
          }}
        >
          <img
            src={logoPSIUCB || "/placeholder.svg"}
            alt="PSI UCB"
            style={{
              width: "100%",
              height: "auto",
              objectFit: "contain",
              filter: "drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.25))",
            }}
          />
        </Box>
      </Box>

      {/* Sección derecha/inferior */}
      <Box
        sx={{
          width: { xs: "100%", md: "50%" }, // Equivalente a xs={12} md={6}
          backgroundColor: theme.palette.grey[50],
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          p: isMobile ? 3 : 6, // Padding reducido en móvil
          minHeight: isMobile ? "60vh" : "auto", // Altura mínima en móvil
        }}
      >
        <Paper
          elevation={0}
          sx={{
            maxWidth: 440,
            width: "100%",
            p: isMobile ? 3 : 4, // Padding reducido en móvil
            borderRadius: theme.shape.borderRadius,
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.grey[100]}`,
            boxShadow: theme.shadows[1],
          }}
        >
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 600,
              mb: 1.5,
              textAlign: "center",
              color: theme.palette.text.primary,
              fontSize: isMobile ? "2rem" : "3rem", // Tamaño de fuente reducido en móvil
            }}
          >
            Bienvenido
          </Typography>

          <Typography
            variant="body1"
            sx={{
              textAlign: "center",
              mb: isMobile ? 3 : 4, // Margen reducido en móvil
              color: theme.palette.text.secondary,
              maxWidth: "90%",
              mx: "auto",
              fontSize: isMobile ? "0.9rem" : "1rem", // Tamaño de fuente reducido en móvil
            }}
          >
            Inicia sesión para acceder a tu cuenta y gestionar tus horarios de
            consulta
          </Typography>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mb: isMobile ? 3 : 5, // Margen reducido en móvil
              // Ajustar tamaño de la animación en móvil
              "& > div": {
                transform: isMobile ? "scale(0.85)" : "none",
                transformOrigin: "center center",
              },
            }}
          >
            {/* Animación Lottie */}
            <MyLottieAnimation />
          </Box>

          {/* Botón de Google */}
          <Button
            variant="outlined"
            onClick={handleLogin}
            startIcon={
              <GoogleIcon
                sx={{
                  color: "#4285F4",
                  fontSize: isMobile ? "1.2rem" : "1.5rem", // Tamaño de icono reducido en móvil
                }}
              />
            }
            sx={{
              width: isMobile ? "100%" : "auto", // Ancho completo en móvil
              maxWidth: isMobile ? "none" : "280px",
              borderRadius: 28,
              textTransform: "none",
              py: isMobile ? 1 : 1.25, // Padding vertical reducido en móvil
              px: 3,
              border: `1px solid ${theme.palette.grey[200]}`,
              color: theme.palette.text.primary,
              backgroundColor: theme.palette.background.paper,
              boxShadow: theme.shadows[1],
              margin: "0 auto",
              display: "flex",
              justifyContent: "center",
              fontSize: isMobile ? "0.9rem" : "0.95rem", // Tamaño de fuente reducido en móvil
              fontWeight: 500,
              transition: "all 0.3s ease",
              "&:hover": {
                backgroundColor: theme.palette.grey[50],
                boxShadow: theme.shadows[2],
                borderColor: theme.palette.grey[300],
              },
              // Mejorar la experiencia táctil
              "&:active": {
                transform: "scale(0.98)",
              },
            }}
          >
            Iniciar sesión con Google
          </Button>
        </Paper>

        <Typography
          variant="caption"
          sx={{
            mt: isMobile ? 2 : 3, // Margen reducido en móvil
            color: theme.palette.text.secondary,
            opacity: 0.8,
            fontSize: isMobile ? "0.7rem" : "0.75rem", // Tamaño de fuente reducido en móvil
            textAlign: "center",
            px: 2,
          }}
        >
          © {new Date().getFullYear()} PSI UCB - Todos los derechos reservados
        </Typography>
      </Box>
    </Grid>
  );
};

export default Login;
