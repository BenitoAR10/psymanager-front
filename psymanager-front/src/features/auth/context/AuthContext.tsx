import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useRef,
} from "react";
import { jwtDecode } from "jwt-decode";
import { getTokenExpirationDelay } from "../../../utils/tokenUtils";
import { refreshTokenService } from "../services/authService";

interface JwtPayload {
  sub: string;
  roles?: string[];
  exp: number;
}

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  userRoles: string[];
  login: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthState>({
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  loading: true,
  userRoles: [],
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
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const refreshTimeoutId = useRef<NodeJS.Timeout | null>(null);

  // Consideramos que el usuario está autenticado si existe un accessToken
  const isAuthenticated = Boolean(accessToken);

  // Cargamos el token desde localStorage
  useEffect(() => {
    const storedAccessToken = localStorage.getItem("accessToken");
    const storedRefreshToken = localStorage.getItem("refreshToken");
    if (storedAccessToken) {
      setAccessToken(storedAccessToken);
      try {
        const decoded: JwtPayload = jwtDecode(storedAccessToken);

        setUserRoles(decoded.roles || []);
      } catch (error) {
        setUserRoles([]);
      }
    }

    if (storedRefreshToken) {
      setRefreshToken(storedRefreshToken);
    }

    setLoading(false);
  }, []);

  /**
   * Función para refrescar el token.
   */
  const refreshTokens = async () => {
    if (!refreshToken) {
      logout();
      return;
    }
    try {
      const data = await refreshTokenService(refreshToken);

      login(data.accessToken, data.refreshToken);
    } catch (error) {
      logout();
    }
  };

  /**
   * Configuramos el timeout para refrescar el token.
   */
  useEffect(() => {
    if (refreshTimeoutId.current) {
      clearTimeout(refreshTimeoutId.current);
    }
    if (accessToken) {
      const delay = getTokenExpirationDelay(accessToken);

      const refreshDelay = delay > 60000 ? delay - 60000 : 0;

      refreshTimeoutId.current = setTimeout(() => {
        refreshTokens();
      }, refreshDelay);
    }

    return () => {
      if (refreshTimeoutId.current) {
        clearTimeout(refreshTimeoutId.current);
      }
    };
  }, [accessToken, refreshToken]);

  /**
   * Manejamos la lógica del login:
   * - Guarda el token en el estado.
   * - Guarda el token en localStorage.
   * - Extrae los roles del accessToken.
   */
  const login = (access: string, refresh: string) => {
    setAccessToken(access);
    setRefreshToken(refresh);
    localStorage.setItem("accessToken", access);
    localStorage.setItem("refreshToken", refresh);
    try {
      const decoded: JwtPayload = jwtDecode(access);

      setUserRoles(decoded.roles || []);
    } catch (error) {
      setUserRoles([]);
    }
  };

  /**
   * Manejamos la lógica de logout:
   * - Limpia el token del estado.
   * - Limpia el token de localStorage.
   */
  const logout = () => {
    setAccessToken(null);
    setRefreshToken(null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setUserRoles([]);
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
        userRoles,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Hook para acceder al contexto de autenticación desde cualquier componente.
 */
export const useAuth = (): AuthState => {
  return useContext(AuthContext);
};
