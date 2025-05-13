import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { CircularProgress, Box } from "@mui/material";
import RoleProtectedRoute from "./components/common/RoleProtectedRoute";
import NotFound from "./components/common/NotFound";

// Lazy load de páginas principales
const Login = lazy(() => import("./features/auth/pages/Login"));
const AuthSuccess = lazy(() => import("./features/auth/pages/AuthSuccess"));
const DashboardLayout = lazy(
  () => import("./components/common/DashboardLayout")
);
const DashboardHome = lazy(
  () => import("./features/dashboard/pages/Dashboard")
);
const CalendarPage = lazy(
  () => import("./features/calendar/pages/CalendarPage")
);
const ProfilePage = lazy(
  () => import("./features/dashboard/pages/ProfilePage")
);
const HelpPage = lazy(() => import("./features/dashboard/pages/HelpPage"));

const StudentsPage = lazy(
  () => import("./features/students/pages/StudentsPage")
);

const TreatmentDetailPage = lazy(
  () => import("./features/treatments/pages/TreatmentDetailPage")
);

const ClosedTreatmentsPage = lazy(
  () => import("./features/treatments/pages/ClosedTreatmentsPage")
);

const ClosedTreatmentDetailPage = lazy(
  () => import("./features/treatments/pages/ClosedTreatmentDetailPage")
);

const AppRoutes: React.FC = () => {
  return (
    <Suspense
      fallback={
        <Box
          sx={{
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress />
        </Box>
      }
    >
      <Routes>
        {/* Rutas públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/auth/success" element={<AuthSuccess />} />

        {/* Rutas protegidas: solo para THERAPIST */}
        <Route element={<RoleProtectedRoute requiredRole="THERAPIST" />}>
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardHome />} />
            <Route path="calendario" element={<CalendarPage />} />
            <Route path="estudiantes" element={<StudentsPage />} />
            <Route path="perfil" element={<ProfilePage />} />
            <Route path="ayuda" element={<HelpPage />} />
            <Route path="tratamientos/:id" element={<TreatmentDetailPage />} />
            <Route path="historiales" element={<ClosedTreatmentsPage />} />
            <Route
              path="historiales/:id"
              element={<ClosedTreatmentDetailPage />}
            />
          </Route>
        </Route>

        {/* Ruta no encontrada */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
