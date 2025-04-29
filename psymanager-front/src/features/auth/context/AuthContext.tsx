import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { jwtDecode } from "jwt-decode";
import { getTokenExpirationDelay } from "../../../utils/tokenUtils";
import { refreshTokenService } from "../services/authService";

/**
 * Estructura del JWT recibido tras autenticación.
 */
interface JwtPayload {
  sub: string;
  roles?: string[];
  exp: number;
  userId: number;
  email: string;
  firstName: string;
  lastName: string;
}

/**
 * Información del usuario decodificada desde el token.
 */
export interface User {
  userId: number;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
}

/**
 * Estado general del contexto de autenticación.
 */
interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  user: User | null;
  login: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthState>({
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  loading: true,
  user: null,
  login: () => {},
  logout: () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Proveedor de autenticación que maneja login/logout y refresco de tokens.
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const refreshTimeoutId = useRef<NodeJS.Timeout | null>(null);

  // Se considera autenticado si hay un accessToken
  const isAuthenticated = Boolean(accessToken);

  /**
   * Maneja la lógica de logout:
   * - Limpia tokens y datos de usuario.
   */
  const logout = useCallback(() => {
    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    if (refreshTimeoutId.current) {
      clearTimeout(refreshTimeoutId.current);
    }
  }, []);

  /**
   * Maneja la lógica de login:
   * - Guarda los tokens.
   * - Decodifica y almacena el usuario.
   */
  const login = useCallback((access: string, refresh: string) => {
    setAccessToken(access);
    setRefreshToken(refresh);
    localStorage.setItem("accessToken", access);
    localStorage.setItem("refreshToken", refresh);

    try {
      const decoded: JwtPayload = jwtDecode(access);
      setUser({
        userId: decoded.userId,
        email: decoded.email,
        firstName: decoded.firstName,
        lastName: decoded.lastName,
        roles: decoded.roles || [],
      });
    } catch (error) {
      console.error("Error decodificando el accessToken en login", error);
      setUser(null);
    }
  }, []);

  /**
   * Función para refrescar el token automáticamente antes de su expiración.
   */
  const refreshTokens = useCallback(async () => {
    if (!refreshToken) {
      logout();
      return;
    }
    try {
      const data = await refreshTokenService(refreshToken);
      // Reutilizamos login para setear todo correctamente
      login(data.accessToken, data.refreshToken);
    } catch (error) {
      logout();
    }
  }, [refreshToken, login, logout]);

  /**
   * Carga inicial de tokens y usuario desde localStorage.
   */
  useEffect(() => {
    const storedAccess = localStorage.getItem("accessToken");
    const storedRefresh = localStorage.getItem("refreshToken");

    if (storedAccess) {
      setAccessToken(storedAccess);
      try {
        const decoded: JwtPayload = jwtDecode(storedAccess);
        setUser({
          userId: decoded.userId,
          email: decoded.email,
          firstName: decoded.firstName,
          lastName: decoded.lastName,
          roles: decoded.roles || [],
        });
      } catch (error) {
        console.error("Error decodificando el accessToken", error);
        setUser(null);
      }
    }

    if (storedRefresh) {
      setRefreshToken(storedRefresh);
    }

    setLoading(false);
  }, []);

  /**
   * Configuración del timeout para refrescar automáticamente el accessToken.
   * Solo corre si loading terminó y accessToken está disponible.
   */
  useEffect(() => {
    if (loading || !accessToken) return;

    if (refreshTimeoutId.current) {
      clearTimeout(refreshTimeoutId.current);
    }

    const delay = getTokenExpirationDelay(accessToken);
    const refreshDelay = delay > 60000 ? delay - 60000 : 0;

    refreshTimeoutId.current = setTimeout(() => {
      refreshTokens();
    }, refreshDelay);

    return () => {
      if (refreshTimeoutId.current) {
        clearTimeout(refreshTimeoutId.current);
      }
    };
  }, [accessToken, loading, refreshTokens]);

  // Memoizamos el valor del contexto para estabilidad
  const value = useMemo(
    () => ({
      accessToken,
      refreshToken,
      isAuthenticated,
      loading,
      user,
      login,
      logout,
    }),
    [accessToken, refreshToken, isAuthenticated, loading, user, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Hook para usar el contexto de autenticación.
 */
export const useAuth = (): AuthState => useContext(AuthContext);
