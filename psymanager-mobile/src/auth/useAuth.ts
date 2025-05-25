import { useContext } from "react";
import { AuthContext, AuthContextType } from "./AuthContext";

/**
 * Hook para acceder al contexto de autenticación.
 * Permite obtener información del usuario, estado de sesión y funciones login/logout.
 */
export const useAuth = (): AuthContextType => {
  logout: () => Promise<void>;
  forceLogout: () => Promise<void>;
  return useContext(AuthContext);
};
