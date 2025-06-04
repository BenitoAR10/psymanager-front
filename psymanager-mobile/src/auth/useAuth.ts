import { useContext } from "react";
import { AuthContext, AuthContextType } from "./AuthContext";

/**
 * Hook para acceder al contexto de autenticación.
 */
export const useAuth = (): AuthContextType => {
  return useContext(AuthContext);
};
