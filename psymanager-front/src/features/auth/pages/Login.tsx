"use client";

import type React from "react";
import { Grid, Box, Typography, Button, SvgIcon } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import MyLottieAnimation from "../../../components/animations/MyLottieAnimation";
import logoPSIUCB from "../../../assets/images/logo.jpg";

const Login: React.FC = () => {
  const handleLogin = () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/google";
  };

  return (
    <Grid
      container
      sx={{
        width: "100vw",
        height: "100vh",
        margin: 0,
      }}
    >
      {/* Sección izquierda */}
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          position: "relative",
          backgroundColor: "#8EA4AA",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
        }}
      >
        {/* Arcos superiores */}
        <Box
          sx={{
            position: "absolute",
            top: -200,
            left: 0,
            width: "100%",
            height: 400,
            borderRadius: "50%",
            backgroundColor: "#C5C8C9",
            opacity: 0.8,
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
            backgroundColor: "#BDC2C4",
            opacity: 0.6,
          }}
        />

        {/* Ícono de corazón en la parte superior */}
        <Box
          sx={{
            position: "absolute",
            top: "10%",
            zIndex: 10,
          }}
        >
          <SvgIcon
            sx={{
              color: "white",
              fontSize: 30,
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

        {/* Logo PSI UCB */}
        <Box
          sx={{
            position: "relative",
            zIndex: 10,
            width: 500,
            height: "auto",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img
            src={logoPSIUCB || "/placeholder.svg"}
            alt="PSI UCB"
            style={{
              width: "100%",
              height: "auto",
              objectFit: "contain",
              filter: "drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.2))", // Añadido sombra sutil para destacar el logo
            }}
          />
        </Box>
      </Grid>

      {/* Sección derecha */}
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          backgroundColor: "#FFFFFF", // Asegurando que el fondo sea blanco
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          p: 4,
        }}
      >
        <Box sx={{ maxWidth: 400, width: "100%" }}>
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: "bold",
              mb: 0,
              textAlign: "center",
              fontSize: "3rem",
            }}
          >
            Bienvenido
          </Typography>

          <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
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
                  color: "#4285F4", // Color azul de Google
                }}
              />
            }
            sx={{
              width: "auto", // Ancho automático en lugar de 100%
              maxWidth: "240px", // Ancho máximo para que se parezca más al de la imagen
              borderRadius: 28,
              textTransform: "none",
              py: 1,
              px: 3,
              border: "1px solid #e0e0e0",
              color: "rgba(0, 0, 0, 0.7)", // Color de texto más oscuro
              backgroundColor: "white",
              boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.1)",
              margin: "0 auto", // Centrado horizontal
              display: "flex",
              justifyContent: "center",
              fontSize: "0.9rem", // Tamaño de fuente más pequeño
              "&:hover": {
                backgroundColor: "#f5f5f5",
                boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
              },
            }}
          >
            Iniciar sesión con Google
          </Button>
        </Box>
      </Grid>
    </Grid>
  );
};

export default Login;
