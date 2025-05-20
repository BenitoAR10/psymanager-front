"use client";

import type React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  Box,
  ListItemIcon,
  Divider,
  useTheme,
  alpha,
  Button,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../features/auth/context/AuthContext";
import PsychologyIcon from "@mui/icons-material/Psychology";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";

interface SidebarProps {
  drawerWidth: number;
  mobileOpen: boolean;
  onDrawerToggle: () => void;
}

const menuItems = [
  {
    text: "Dashboard",
    path: "/dashboard",
    icon: <DashboardOutlinedIcon />,
    description: "Vista general",
  },
  {
    text: "Calendario",
    path: "/dashboard/calendario",
    icon: <CalendarTodayOutlinedIcon />,
    description: "Gestión de horarios",
  },
  {
    text: "Estudiantes",
    path: "/dashboard/estudiantes",
    icon: <SchoolOutlinedIcon />,
    description: "Listado de estudiantes",
  },
  {
    text: "Historiales",
    path: "/dashboard/historiales",
    icon: <AssignmentOutlinedIcon />,
    description: "Registros clínicos",
  },
  {
    text: "Perfil",
    path: "/dashboard/perfil",
    icon: <PersonOutlineOutlinedIcon />,
    description: "Tu información",
  },
];

const secondaryMenuItems = [
  {
    text: "Ayuda",
    path: "/dashboard/ayuda",
    icon: <HelpOutlineOutlinedIcon />,
  },
];

const Sidebar: React.FC<SidebarProps> = ({
  drawerWidth,
  mobileOpen,
  onDrawerToggle,
}) => {
  const theme = useTheme();
  const { logout } = useAuth();
  const location = useLocation();

  // Contenido del Drawer mejorado
  const drawerContent = (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        backgroundColor: "background.paper",
        py: 2,
      }}
    >
      {/* Logo y título */}
      <Box
        sx={{
          px: 3,
          mb: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 42,
            height: 42,
            borderRadius: 2,
            backgroundColor: alpha(theme.palette.primary.main, 0.1),
            mr: 1.5,
          }}
        >
          <PsychologyIcon
            sx={{
              color: theme.palette.primary.main,
              fontSize: "1.8rem",
            }}
          />
        </Box>
        <Box>
          <Typography
            variant="h6"
            sx={{
              color: "text.primary",
              fontWeight: 700,
              lineHeight: 1.2,
            }}
          >
            PSI UCB
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: "text.secondary",
              fontWeight: 500,
            }}
          >
            Portal de Terapeutas
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ mb: 2 }} />

      {/* Menú principal */}
      <Typography
        variant="overline"
        sx={{
          px: 3,
          mb: 1,
          color: "text.secondary",
          fontWeight: 600,
        }}
      >
        MENÚ PRINCIPAL
      </Typography>
      <List sx={{ px: 2 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                component={Link}
                to={item.path}
                onClick={mobileOpen ? onDrawerToggle : undefined}
                sx={{
                  borderRadius: 2,
                  py: 1.2,
                  px: 2,
                  backgroundColor: isActive
                    ? alpha(theme.palette.primary.main, 0.1)
                    : "transparent",
                  color: isActive
                    ? theme.palette.primary.main
                    : "text.secondary",
                  "&:hover": {
                    backgroundColor: isActive
                      ? alpha(theme.palette.primary.main, 0.15)
                      : alpha(theme.palette.grey[500], 0.08),
                  },
                  transition: "all 0.2s ease",
                }}
              >
                <ListItemIcon
                  sx={{
                    color: isActive
                      ? theme.palette.primary.main
                      : "text.secondary",
                    minWidth: 36,
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <Box>
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      fontSize: "0.95rem",
                      fontWeight: isActive ? 600 : 500,
                      color: isActive ? "primary.main" : "text.primary",
                    }}
                    secondary={item.description}
                    secondaryTypographyProps={{
                      fontSize: "0.75rem",
                      display: { xs: "none", lg: "block" },
                    }}
                  />
                </Box>
                {isActive && (
                  <Box
                    sx={{
                      width: 4,
                      height: 32,
                      borderRadius: 1,
                      backgroundColor: theme.palette.primary.main,
                      ml: 1,
                    }}
                  />
                )}
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Divider sx={{ my: 2 }} />

      {/* Menú secundario */}
      <Typography
        variant="overline"
        sx={{
          px: 3,
          mb: 1,
          color: "text.secondary",
          fontWeight: 600,
        }}
      >
        SOPORTE
      </Typography>
      <List sx={{ px: 2 }}>
        {secondaryMenuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                component={Link}
                to={item.path}
                onClick={mobileOpen ? onDrawerToggle : undefined}
                sx={{
                  borderRadius: 2,
                  py: 1,
                  px: 2,
                  backgroundColor: isActive
                    ? alpha(theme.palette.primary.main, 0.1)
                    : "transparent",
                  color: isActive
                    ? theme.palette.primary.main
                    : "text.secondary",
                  "&:hover": {
                    backgroundColor: isActive
                      ? alpha(theme.palette.primary.main, 0.15)
                      : alpha(theme.palette.grey[500], 0.08),
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: isActive
                      ? theme.palette.primary.main
                      : "text.secondary",
                    minWidth: 36,
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontSize: "0.9rem",
                    fontWeight: isActive ? 600 : 500,
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      {/* Espacio flexible */}
      <Box sx={{ flexGrow: 1 }} />

      {/* Botón de Logout */}
      <Box sx={{ px: 2, mt: 2 }}>
        <Button
          variant="outlined"
          color="error"
          fullWidth
          startIcon={<LogoutOutlinedIcon />}
          onClick={logout}
          sx={{
            py: 1,
            borderRadius: 2,
            justifyContent: "flex-start",
            borderWidth: "1.5px",
            "&:hover": {
              borderWidth: "1.5px",
              backgroundColor: alpha(theme.palette.error.main, 0.08),
            },
          }}
        >
          Cerrar sesión
        </Button>
      </Box>
    </Box>
  );

  return (
    <>
      {/* Drawer permanente para pantallas grandes */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", md: "block" },
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            borderRight: "1px solid",
            borderColor: "divider",
            boxShadow: "none",
            overflow: "hidden",
            "&:hover": {
              overflow: "auto",
            },
            "&::-webkit-scrollbar": {
              width: "6px",
            },
            "&::-webkit-scrollbar-track": {
              background: "transparent",
            },
            "&::-webkit-scrollbar-thumb": {
              background: theme.palette.grey[300],
              borderRadius: "3px",
            },
            "&::-webkit-scrollbar-thumb:hover": {
              background: theme.palette.grey[400],
            },
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>

      {/* Drawer temporal para pantallas pequeñas */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onDrawerToggle}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.08)",
          },
        }}
        ModalProps={{
          keepMounted: true,
        }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
};

export default Sidebar;
