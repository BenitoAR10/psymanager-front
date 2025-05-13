"use client";
import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Typography, Box } from "@mui/material";

import AppBarHeader from "../layout/AppBarHeader";

import { usePendingAppointmentsQuery } from "../../features/appointments/hooks/usePendingAppointmentsQuery";
import { useUpdateAppointmentMutation } from "../../features/appointments/hooks/useUpdateAppointmentMutation";
import { useAuth } from "../../features/auth/context/AuthContext";
import Sidebar from "./Sidebar";
import Footer from "../layout/Footer";
import { Toaster, toast } from "sonner";

const drawerWidth = 260;

// Convierte “FOO BAR” → “Foo Bar”
function toTitleCase(str: string) {
  return str
    .toLowerCase()
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");
}

const DashboardLayout: React.FC = () => {
  const { accessToken } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isTreatmentDetailPage = /^\/dashboard\/tratamientos\/\d+$/.test(
    location.pathname
  );

  // Decodifica los claims del JWT
  let displayName = "Invitado";
  if (accessToken) {
    const payload = JSON.parse(atob(accessToken.split(".")[1]));
    if (payload.firstName && payload.lastName) {
      displayName = toTitleCase(`${payload.firstName} ${payload.lastName}`);
    } else if (payload.sub) {
      displayName = payload.sub;
    }
  }
  const firstName = displayName.split(" ")[0];

  // React Query
  const {
    data: pending = [],
    isLoading: pendingLoading,
    isError: pendingError,
  } = usePendingAppointmentsQuery();
  const updateMutation = useUpdateAppointmentMutation();
  const pendingCount = pending.length;

  // Notificaciones
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const handleBellClick = (e: React.MouseEvent<HTMLElement>) =>
    setAnchorEl(e.currentTarget);
  const handleBellClose = () => setAnchorEl(null);

  const handleChangeState = (
    appointmentId: number,
    newState: "ACCEPTED" | "REJECTED"
  ) => {
    updateMutation.mutate(
      { appointmentId, newState },
      {
        onSuccess: () => {
          toast.success(
            newState === "ACCEPTED" ? "Cita aceptada ✔️" : "Cita rechazada ❌"
          );
        },
        onError: () => {
          toast.error("Error al actualizar la cita");
        },
      }
    );
  };

  // Navegación y breadcrumbs
  const handleDrawerToggle = () => setMobileOpen((o) => !o);

  const getPageTitle = () => {
    const path = location.pathname;

    if (path === "/dashboard") return "Dashboard";

    if (/^\/dashboard\/historiales\/\d+$/.test(path)) {
      return "Historial del tratamiento";
    }

    if (/^\/dashboard\/tratamientos\/\d+$/.test(path)) {
      return "Gestión del tratamiento";
    }

    const parts = path.split("/").filter(Boolean);
    const last = parts[parts.length - 1];

    return last.charAt(0).toUpperCase() + last.slice(1).toLowerCase();
  };

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "background.default",
      }}
    >
      {/* Sonner Toaster */}
      <Toaster position="top-right" richColors />

      {/* AppBar */}
      <AppBarHeader
        displayName={displayName}
        firstName={firstName}
        onDrawerToggle={handleDrawerToggle}
        pendingCount={pendingCount}
        pending={pending}
        pendingLoading={pendingLoading}
        pendingError={pendingError}
        anchorEl={anchorEl}
        onBellClick={handleBellClick}
        onBellClose={handleBellClose}
        onAccept={(id) => handleChangeState(id, "ACCEPTED")}
        onReject={(id) => handleChangeState(id, "REJECTED")}
        onViewAllRequests={() => {
          /* navegar a solicitudes */
        }}
      />

      {/* Sidebar */}
      <Sidebar
        drawerWidth={drawerWidth}
        mobileOpen={mobileOpen}
        onDrawerToggle={handleDrawerToggle}
      />

      {/* Contenido */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, md: 3 },
          ml: { md: `${drawerWidth}px` },
          mt: "64px",
          bgcolor: "background.default",
          minHeight: "calc(100vh - 64px)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box sx={{ mb: 2 }}>
          {!isTreatmentDetailPage && (
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
              {getPageTitle()}
            </Typography>
          )}
        </Box>

        <Box sx={{ flexGrow: 1 }}>
          <Outlet />
        </Box>
        {/* Footer */}

        <Footer />
      </Box>
    </Box>
  );
};

export default DashboardLayout;
