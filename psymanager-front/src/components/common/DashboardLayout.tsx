import type React from "react";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Box,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useAuth } from "../../features/auth/context/AuthContext";
import Sidebar from "./Sidebar";

const drawerWidth = 240;

const DashboardLayout: React.FC = () => {
  const { accessToken } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Obtenemos el nombre del usuario desde el token (asumiendo que 'sub' contiene el nombre o email)
  const userName = accessToken
    ? JSON.parse(atob(accessToken.split(".")[1])).sub
    : "Invitado";

  // Función para togglear el Drawer en móviles
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <>
      {/* Navbar (AppBar) sin logout */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          backgroundColor: "#ffffff",
          color: "#757575",
          borderBottom: "1px solid #f0f0f0",
        }}
      >
        <Toolbar sx={{ minHeight: { xs: 64 } }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{
              mr: 2,
              display: { md: "none" },
              color: "#757575",
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="subtitle1"
            noWrap
            component="div"
            sx={{
              flexGrow: 1,
              fontWeight: 500,
              color: "#424242",
            }}
          >
            Bienvenido, {userName}
          </Typography>
          <Avatar
            sx={{
              bgcolor: "#4DB6AC",
              width: 36,
              height: 36,
              fontSize: "0.9rem",
              fontWeight: 500,
            }}
          >
            {userName[0]}
          </Avatar>
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
          p: 3,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          mt: "64px",
          backgroundColor: "#fafafa",
          minHeight: "100vh",
        }}
      >
        <Outlet />
      </Box>
    </>
  );
};

export default DashboardLayout;
