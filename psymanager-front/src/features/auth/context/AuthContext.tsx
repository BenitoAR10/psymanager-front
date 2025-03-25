import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useRef,
} from "react";

import { getTokenExpirationDelay } from "../../../utils/tokenUtils";

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthState>({
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  loading: true,
  login: () => {},
  logout: () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const refreshTimeoutId = useRef<NodeJS.Timeout | null>(null);

  // Determinamos si el usuario está autenticado
  const isAuthenticated = Boolean(accessToken);

  // Cargamos el token desde localStorage
  useEffect(() => {
    const storedAccessToken = localStorage.getItem("accessToken");
    const storedRefreshToken = localStorage.getItem("refreshToken");

    if (storedAccessToken) {
      setAccessToken(storedAccessToken);
    }
    if (storedRefreshToken) {
      setRefreshToken(storedRefreshToken);
    }

    setLoading(false);
  }, []);

  /**
   * Funcion para refrescar el token
   */

  const refreshTokens = async () => {
    if (!refreshToken) {
      logout();
      return;
    }
    try {
      const response = await fetch("http://localhost:8080/auth/refresh", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      });
      if (response.ok) {
        const data = await response.json();
        // Asumimos que data contiene access y refresh tokens
        login(data.accessToken, data.refreshToken);
      } else {
        logout();
      }
    } catch (error) {
      console.log("Error al refrescar el token", error);
      logout();
    }
  };

  /**
   * Configuramos el timeout para refrescar el token
   */
  useEffect(() => {
    // Limpiamos el timeout anterior
    if (refreshTimeoutId.current) {
      clearTimeout(refreshTimeoutId.current);
    }
    if (accessToken) {
      const delay = getTokenExpirationDelay(accessToken);
      // Configuramos el refresco un minuto antes de que expire el token
      const refreshDelay = delay > 60000 ? delay - 60000 : 0;
      refreshTimeoutId.current = setTimeout(() => {
        refreshTokens();
      }, refreshDelay);
    }

    // Limpiamos el timer al desmontar o al cambiar el token
    return () => {
      if (refreshTimeoutId.current) {
        clearTimeout(refreshTimeoutId.current);
      }
    };
  }, [accessToken, refreshToken]);

  /**
   * Manejamos la logica del login
   * - Guardamos el token en el estado
   * - Guardamos el token en localStorage
   */

  const login = (access: string, refresh: string) => {
    setAccessToken(access);
    setRefreshToken(refresh);
    localStorage.setItem("accessToken", access);
    localStorage.setItem("refreshToken", refresh);
  };

  /**
   * Manejamos la logica de logut
   * - Limpiamos el token del estado
   * - Limpiamos el token de localStorage
   */

  const logout = () => {
    setAccessToken(null);
    setRefreshToken(null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    if (refreshTimeoutId.current) {
      clearTimeout(refreshTimeoutId.current);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        refreshToken,
        isAuthenticated,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Hook para acceder al contexto de autenticación
 * desde cualquier componente
 */

export const useAuth = (): AuthState => {
  return useContext(AuthContext);
};
