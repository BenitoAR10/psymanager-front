"use client";

import type React from "react";
import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Box,
  useTheme,
  Tooltip,
  Badge,
  Breadcrumbs,
  Link as MuiLink,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { useAuth } from "../../features/auth/context/AuthContext";
import Sidebar from "./Sidebar";

const drawerWidth = 260;

const DashboardLayout: React.FC = () => {
  const theme = useTheme();
  const { accessToken } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  // Obtenemos el nombre del usuario desde el token (asumiendo que 'sub' contiene el nombre o email)
  const userName = accessToken
    ? JSON.parse(atob(accessToken.split(".")[1])).sub
    : "Invitado";

  // Extraer el primer nombre para mostrar en el saludo
  const firstName = userName.split(" ")[0];

  // Función para togglear el Drawer en móviles
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Generar breadcrumbs basados en la ruta actual
  const generateBreadcrumbs = () => {
    const paths = location.pathname.split("/").filter(Boolean);

    // Si estamos en la ruta principal del dashboard
    if (paths.length === 1 && paths[0] === "dashboard") {
      return (
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" />}
          aria-label="breadcrumb"
          sx={{ mb: 1, mt: 1 }}
        >
          <MuiLink
            component="span"
            sx={{
              display: "flex",
              alignItems: "center",
              color: "text.primary",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            <HomeOutlinedIcon sx={{ mr: 0.5 }} fontSize="small" />
            Dashboard
          </MuiLink>
        </Breadcrumbs>
      );
    }

    // Para rutas más profundas
    return (
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        aria-label="breadcrumb"
        sx={{ mb: 1, mt: 1 }}
      >
        <MuiLink
          href="/dashboard"
          sx={{
            display: "flex",
            alignItems: "center",
            color: "text.secondary",
            "&:hover": { color: "primary.main" },
          }}
        >
          <HomeOutlinedIcon sx={{ mr: 0.5 }} fontSize="small" />
          Dashboard
        </MuiLink>

        {paths.slice(1).map((path, index) => {
          const isLast = index === paths.slice(1).length - 1;
          const formattedPath = path.charAt(0).toUpperCase() + path.slice(1);

          return isLast ? (
            <Typography
              key={path}
              color="text.primary"
              sx={{
                display: "flex",
                alignItems: "center",
                fontWeight: 600,
              }}
            >
              {formattedPath}
            </Typography>
          ) : (
            <MuiLink
              key={path}
              href={`/dashboard/${path}`}
              sx={{
                color: "text.secondary",
                "&:hover": { color: "primary.main" },
              }}
            >
              {formattedPath}
            </MuiLink>
          );
        })}
      </Breadcrumbs>
    );
  };

  // Determinar el título de la página basado en la ruta
  const getPageTitle = () => {
    const paths = location.pathname.split("/").filter(Boolean);
    if (paths.length === 1 && paths[0] === "dashboard") {
      return "Dashboard";
    }
    const lastPath = paths[paths.length - 1];
    return lastPath.charAt(0).toUpperCase() + lastPath.slice(1);
  };

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "background.default",
      }}
    >
      {/* Navbar (AppBar) */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          backgroundColor: "background.paper",
          color: "text.secondary",
          borderBottom: "1px solid",
          borderColor: "divider",
          backdropFilter: "blur(8px)",
        }}
      >
        <Toolbar
          sx={{ minHeight: { xs: 64 }, justifyContent: "space-between" }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{
                mr: 2,
                display: { md: "none" },
                color: "text.secondary",
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="subtitle1"
              noWrap
              component="div"
              sx={{
                fontWeight: 600,
                color: "text.primary",
                display: { xs: "none", sm: "block" },
              }}
            >
              ¡Hola, {firstName}! 👋
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Tooltip title="Notificaciones">
              <IconButton
                size="medium"
                color="inherit"
                sx={{
                  bgcolor: "grey.50",
                  "&:hover": { bgcolor: "grey.100" },
                  borderRadius: 2,
                }}
              >
                <Badge badgeContent={3} color="error">
                  <NotificationsOutlinedIcon />
                </Badge>
              </IconButton>
            </Tooltip>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Box sx={{ display: { xs: "none", sm: "block" } }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    color: "text.primary",
                    lineHeight: 1.2,
                  }}
                >
                  {userName}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Terapeuta
                </Typography>
              </Box>

              <Tooltip title="Perfil">
                <Avatar
                  sx={{
                    bgcolor: theme.palette.primary.main,
                    width: 40,
                    height: 40,
                    fontSize: "1rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    border: "2px solid #fff",
                  }}
                >
                  {userName[0]}
                </Avatar>
              </Tooltip>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Sidebar responsive */}
      <Sidebar
        drawerWidth={drawerWidth}
        mobileOpen={mobileOpen}
        onDrawerToggle={handleDrawerToggle}
      />

      {/* Área de contenido */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, md: 3 },
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          mt: "64px",
          backgroundColor: "background.default",
          minHeight: "calc(100vh - 64px)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Breadcrumbs y título de página */}
        <Box sx={{ mb: 2 }}>
          {generateBreadcrumbs()}
          <Typography
            variant="h4"
            component="h1"
            sx={{ fontWeight: 700, color: "text.primary", mb: 3 }}
          >
            {getPageTitle()}
          </Typography>
        </Box>

        {/* Contenido principal */}
        <Box sx={{ flexGrow: 1 }}>
          <Outlet />
        </Box>

        {/* Footer simple */}
        <Box
          component="footer"
          sx={{
            mt: 4,
            py: 2,
            textAlign: "center",
            borderTop: "1px solid",
            borderColor: "divider",
          }}
        >
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} PSI UCB. Todos los derechos reservados.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardLayout;
