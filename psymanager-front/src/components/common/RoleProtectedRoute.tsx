import React from "react";
import { useAuth } from "../../features/auth/context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

interface RoleProtectedRouteProps {
  // Ahora puede ser un string o un array de strings
  requiredRole: string | string[];
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
    return <Navigate to="/login" replace />;
  }

  // Normalizamos a arreglo
  const allowedRoles = Array.isArray(requiredRole)
    ? requiredRole
    : [requiredRole];

  // Si el usuario autenticado no tiene ninguno de los roles permitidos, mostramos 403.
  if (!user || !allowedRoles.some((role) => user.roles.includes(role))) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <h1>403 Forbidden</h1>
        <p>No tienes permiso para acceder a esta página.</p>
      </div>
    );
  }

  // Si pasa todas las comprobaciones, renderiza las rutas hijas
  return <Outlet />;
};

export default RoleProtectedRoute;
