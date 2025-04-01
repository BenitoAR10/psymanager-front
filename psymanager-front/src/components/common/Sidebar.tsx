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
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../features/auth/context/AuthContext";
import PsychologyIcon from "@mui/icons-material/Psychology";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";

interface SidebarProps {
  drawerWidth: number;
  mobileOpen: boolean;
  onDrawerToggle: () => void;
}

const menuItems = [
  {
    text: "Dashboard",
    path: "/dashboard",
    icon: <DashboardOutlinedIcon fontSize="small" />,
  },
  {
    text: "Calendario",
    path: "/dashboard/calendario",
    icon: <CalendarTodayOutlinedIcon fontSize="small" />,
  },
  {
    text: "Perfil",
    path: "/dashboard/perfil",
    icon: <PersonOutlineOutlinedIcon fontSize="small" />,
  },
  {
    text: "Ayuda",
    path: "/dashboard/ayuda",
    icon: <HelpOutlineOutlinedIcon fontSize="small" />,
  },
];

const Sidebar: React.FC<SidebarProps> = ({
  drawerWidth,
  mobileOpen,
  onDrawerToggle,
}) => {
  const { logout } = useAuth();
  const location = useLocation();

  // Contenido del Drawer simplificado
  const drawerContent = (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        backgroundColor: "#ffffff",
        py: 2,
      }}
    >
      {/* Título con ícono de corazón */}
      <Box sx={{ px: 7, mb: 4, display: "flex", alignItems: "center" }}>
        <PsychologyIcon sx={{ color: "#4DB6AC", mr: 1, fontSize: "1.8rem" }} />
        <Typography
          variant="subtitle1"
          sx={{
            color: "#4DB6AC",
            fontWeight: 500,
            fontSize: "1.5rem",
          }}
        >
          Inicio
        </Typography>
      </Box>

      {/* Menú principal */}
      <List sx={{ px: 1 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                component={Link}
                to={item.path}
                onClick={onDrawerToggle}
                sx={{
                  borderRadius: 1,
                  py: 1,
                  backgroundColor: isActive ? "#4DB6AC" : "transparent",
                  color: isActive ? "#ffffff" : "#757575",
                  "&:hover": {
                    backgroundColor: isActive ? "#4DB6AC" : "#f5f5f5",
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: isActive ? "#ffffff" : "#9e9e9e",
                    minWidth: 36,
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontSize: "0.9rem",
                    fontWeight: isActive ? 500 : 400,
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
      <Box sx={{ px: 2 }}>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => {
              logout();
            }}
            sx={{
              color: "#757575",
              "&:hover": {
                backgroundColor: "transparent",
                color: "#4DB6AC",
              },
              py: 1,
            }}
          >
            <ListItemIcon sx={{ color: "inherit", minWidth: 36 }}>
              <LogoutOutlinedIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary="Cierra sesión"
              primaryTypographyProps={{
                fontSize: "0.9rem",
              }}
            />
          </ListItemButton>
        </ListItem>
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
            borderRight: "1px solid #f0f0f0",
            boxShadow: "none",
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
            boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.05)",
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
