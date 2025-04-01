import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import RoleProtectedRoute from "./components/common/RoleProtectedRoute";
import NotFound from "./components/common/NotFound";

// Lazy load
const Login = lazy(() => import("./features/auth/pages/Login"));
const AuthSuccess = lazy(() => import("./features/auth/pages/AuthSuccess"));
const DashboardLayout = lazy(
  () => import("./components/common/DashboardLayout")
);
// Subpáginas del dashboard
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

const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/auth/success" element={<AuthSuccess />} />

        {/* Rutas para el dashboard (sólo rol THERAPIST) */}
        <Route element={<RoleProtectedRoute requiredRole="THERAPIST" />}>
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardHome />} />
            <Route path="calendario" element={<CalendarPage />} />
            <Route path="perfil" element={<ProfilePage />} />
            <Route path="ayuda" element={<HelpPage />} />
          </Route>
        </Route>

        {/* Ruta 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
