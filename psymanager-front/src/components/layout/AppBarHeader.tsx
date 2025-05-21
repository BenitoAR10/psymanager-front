import React from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Badge,
  Avatar,
  Typography,
  Tooltip,
  Box,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import type { NotificationsMenuProps } from "./NotificationsMenu";
import NotificationsMenu from "./NotificationsMenu";
import { useNavigate } from "react-router-dom";

export interface AppBarHeaderProps {
  displayName: string;
  firstName: string;
  onDrawerToggle: () => void;

  // props para notificaciones
  pendingCount: number;
  pending: NotificationsMenuProps["pending"];
  pendingLoading: NotificationsMenuProps["loading"];
  pendingError: NotificationsMenuProps["error"];
  anchorEl: HTMLElement | null;
  onBellClick: (e: React.MouseEvent<HTMLElement>) => void;
  onBellClose: () => void;
  onAccept: (id: number) => void;
  onReject: (id: number) => void;
  onViewAllRequests?: () => void;
}

const AppBarHeader: React.FC<AppBarHeaderProps> = ({
  displayName,
  firstName,
  onDrawerToggle,

  pendingCount,
  pending,
  pendingLoading,
  pendingError,
  anchorEl,
  onBellClick,
  onBellClose,
  onAccept,
  onReject,
  onViewAllRequests,
}) => {
  const bellOpen = Boolean(anchorEl);

  const navigate = useNavigate();

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        width: { md: `calc(100% - 260px)` },
        ml: { md: `260px` },
        bgcolor: "background.paper",
        color: "text.secondary",
        borderBottom: "1px solid",
        borderColor: "divider",
        backdropFilter: "blur(8px)",
      }}
    >
      <Toolbar sx={{ minHeight: 64, justifyContent: "space-between" }}>
        {/* Menú hamburguesa + saludo */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton
            color="inherit"
            onClick={onDrawerToggle}
            sx={{ mr: 2, display: { md: "none" }, color: "text.secondary" }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="subtitle1"
            noWrap
            sx={{
              fontWeight: 600,
              color: "text.primary",
              display: { xs: "none", sm: "block" },
            }}
          >
            ¡Hola, {firstName}! 👋
          </Typography>
        </Box>

        {/* Campana y avatar */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Tooltip title="Solicitudes pendientes">
            <IconButton
              size="medium"
              onClick={onBellClick}
              sx={{
                bgcolor: "grey.50",
                "&:hover": { bgcolor: "grey.100" },
                borderRadius: 2,
              }}
            >
              <Badge badgeContent={pendingCount} color="error">
                <NotificationsOutlinedIcon />
              </Badge>
            </IconButton>
          </Tooltip>

          <NotificationsMenu
            anchorEl={anchorEl}
            open={bellOpen}
            loading={pendingLoading}
            error={pendingError}
            pending={pending}
            onClose={onBellClose}
            onAccept={onAccept}
            onReject={onReject}
            onViewAll={onViewAllRequests}
          />

          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box sx={{ display: { xs: "none", sm: "block" } }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {displayName}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Terapeuta
              </Typography>
            </Box>
            <Tooltip title="Perfil">
              <Avatar
                onClick={() => navigate("/dashboard/perfil")}
                sx={{
                  bgcolor: "primary.main",
                  width: 40,
                  height: 40,
                  fontSize: "1rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  border: "2px solid #fff",
                }}
              >
                {displayName.charAt(0)}
              </Avatar>
            </Tooltip>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default AppBarHeader;
