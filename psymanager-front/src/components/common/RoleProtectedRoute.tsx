import React from "react";
import { useAuth } from "../../features/auth/context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

interface RoleProtectedRouteProps {
  requiredRole: string;
}

const RoleProtectedRoute: React.FC<RoleProtectedRouteProps> = ({
  requiredRole,
}) => {
  const { isAuthenticated, loading, user } = useAuth();

  // Mientras se cargan los tokens, mostramos un loader
  if (loading) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>Cargando...</div>
    );
  }

  // Si no está autenticado, redirige al login.
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Si el usuario autenticado no tiene el rol requerido, mostramos 403.
  if (!user || !user.roles.includes(requiredRole)) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <h1>403 Forbidden</h1>
        <p>No tienes permiso para acceder a esta página.</p>
      </div>
    );
  }

  return <Outlet />;
};

export default RoleProtectedRoute;
