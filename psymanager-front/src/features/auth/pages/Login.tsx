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
  const isLaptop = useMediaQuery(theme.breakpoints.between("md", "lg"));

  const handleLogin = () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/google";
  };

  return (
    <Grid
      container
      sx={{
        width: "100vw",
        height: "100vh", // Siempre 100vh para evitar scroll
        margin: 0,
        overflow: "hidden", // Evitar scroll
      }}
    >
      {/* Sección izquierda/superior */}
      <Box
        sx={{
          width: { xs: "100%", md: "50%" },
          position: "relative",
          background: `linear-gradient(135deg, ${theme.palette.primary.light}, ${theme.palette.primary.dark})`,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
          height: { xs: "35vh", md: "100%" }, // Altura fija en móvil, 100% en desktop
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
            width: isMobile ? "80%" : isLaptop ? "90%" : "80%",
            maxWidth: isMobile ? 280 : isLaptop ? 400 : 500,
            height: "auto",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: isMobile ? 2 : isLaptop ? 3 : 4,
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
          width: { xs: "100%", md: "50%" },
          backgroundColor: theme.palette.grey[50],
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          p: { xs: 2, sm: 3, md: 4 }, // Padding adaptativo
          height: { xs: "65vh", md: "100%" }, // Altura fija en móvil, 100% en desktop
          overflow: "auto", // Permitir scroll solo en esta sección si es necesario
        }}
      >
        <Paper
          elevation={0}
          sx={{
            maxWidth: 440,
            width: "100%",
            p: { xs: 2, sm: 3, md: 4 }, // Padding adaptativo
            borderRadius: theme.shape.borderRadius,
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.grey[100]}`,
            boxShadow: theme.shadows[1],
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 600,
              mb: { xs: 1, md: 1.5 },
              textAlign: "center",
              color: theme.palette.text.primary,
              fontSize: { xs: "1.75rem", sm: "2rem", md: "2.5rem", lg: "3rem" }, // Tamaño adaptativo
            }}
          >
            Bienvenido
          </Typography>

          <Typography
            variant="body1"
            sx={{
              textAlign: "center",
              mb: { xs: 2, md: 3 }, // Margen adaptativo
              color: theme.palette.text.secondary,
              maxWidth: "90%",
              mx: "auto",
              fontSize: { xs: "0.85rem", sm: "0.9rem", md: "1rem" }, // Tamaño adaptativo
            }}
          >
            Inicia sesión para acceder a tu cuenta y gestionar tus horarios de
            consulta
          </Typography>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mb: { xs: 2, md: 3 }, // Margen adaptativo
              flexGrow: { xs: 0, md: 1 }, // Permitir que crezca en desktop
              // Ajustar tamaño de la animación
              "& > div": {
                transform: {
                  xs: "scale(0.7)",
                  sm: "scale(0.8)",
                  md: "scale(0.85)",
                  lg: "scale(0.9)",
                },
                transformOrigin: "center center",
                maxHeight: {
                  xs: "150px",
                  sm: "180px",
                  md: "200px",
                  lg: "220px",
                }, // Altura máxima adaptativa
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
                  fontSize: { xs: "1.1rem", md: "1.2rem", lg: "1.5rem" }, // Tamaño adaptativo
                }}
              />
            }
            sx={{
              width: { xs: "100%", md: "auto" }, // Ancho adaptativo
              maxWidth: { xs: "none", md: "280px" },
              borderRadius: 28,
              textTransform: "none",
              py: { xs: 1, md: 1.25 }, // Padding adaptativo
              px: 3,
              border: `1px solid ${theme.palette.grey[200]}`,
              color: theme.palette.text.primary,
              backgroundColor: theme.palette.background.paper,
              boxShadow: theme.shadows[1],
              margin: "0 auto",
              display: "flex",
              justifyContent: "center",
              fontSize: { xs: "0.85rem", md: "0.9rem", lg: "0.95rem" }, // Tamaño adaptativo
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
            mt: { xs: 1.5, md: 2 }, // Margen adaptativo
            color: theme.palette.text.secondary,
            opacity: 0.8,
            fontSize: { xs: "0.65rem", md: "0.75rem" }, // Tamaño adaptativo
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
