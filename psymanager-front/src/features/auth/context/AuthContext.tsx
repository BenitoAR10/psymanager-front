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
import {
  refreshTokenService,
  getPermissionsService,
} from "../services/authService";
import { getTherapistProfile } from "../../profile/services/profileService";

interface JwtPayload {
  sub: string;
  roles?: string[];
  exp: number;
  userId: number;
  email: string;
  firstName: string;
  lastName: string;
}

export interface User {
  userId: number;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
}

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  justRegistered: boolean;
  setJustRegistered: (val: boolean) => void;
  isAuthenticated: boolean;
  loading: boolean;
  user: User | null;
  login: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
  permissions: string[];
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthState>({
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  justRegistered: false,
  setJustRegistered: () => {},
  loading: true,
  user: null,
  login: () => {},
  logout: () => {},
  permissions: [],
  hasPermission: () => false,
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [justRegistered, setJustRegistered] = useState(false);
  const refreshTimeoutId = useRef<NodeJS.Timeout | null>(null);

  const isAuthenticated = Boolean(accessToken);
  const [permissions, setPermissions] = useState<string[]>([]);

  /**
   * Verifica si el usuario tiene un permiso específico.
   * Ejemplo: hasPermission("ADD_EXERCISE_RESOURCE")
   */
  const hasPermission = useCallback(
    (permission: string) => permissions.includes(permission),
    [permissions]
  );

  /**
   * Cierra sesión y limpia todo.
   */
  const logout = useCallback(() => {
    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
    setJustRegistered(false);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    if (refreshTimeoutId.current) {
      clearTimeout(refreshTimeoutId.current);
    }
  }, []);

  /**
   * Verifica si el perfil del terapeuta está incompleto
   * y marca `justRegistered` si es necesario.
   */
  const checkIfJustRegistered = async () => {
    if (!accessToken) return;

    try {
      const profile = await getTherapistProfile();
      const isIncomplete =
        !profile.ciNumber ||
        !profile.ciExtension ||
        !profile.phoneNumber ||
        !Array.isArray(profile.specialties) ||
        profile.specialties.length === 0;

      setJustRegistered(isIncomplete);
    } catch (error) {
      console.warn("No se pudo verificar si el perfil está completo:", error);
      setJustRegistered(false);
    }
  };

  /**
   * Guarda tokens y usuario al hacer login,
   * y verifica si debe completar su perfil.
   */
  const login = useCallback(async (access: string, refresh: string) => {
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

      // Cargar permisos desde el backend
      const perms = await getPermissionsService();
      setPermissions(perms);

      // Verifica si debe completar el perfil
      checkIfJustRegistered();
    } catch (error) {
      console.error("Error decodificando el accessToken en login", error);
      setUser(null);
      setPermissions([]);
    }
  }, []);

  /**
   * Refresca tokens automáticamente antes de que expiren.
   */
  const refreshTokens = useCallback(async () => {
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
  }, [refreshToken, login, logout]);

  /**
   * Carga tokens y usuario desde localStorage al iniciar la app.
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

        // También verifica si está registrado o no
        setTimeout(() => {
          checkIfJustRegistered();
        }, 0);
      } catch (error) {
        console.error("Error decodificando el accessToken", error);
        setUser(null);
      }
      getPermissionsService()
        .then((perms) => setPermissions(perms))
        .catch(() => setPermissions([]));
    }

    if (storedRefresh) {
      setRefreshToken(storedRefresh);
    }

    setLoading(false);
  }, []);

  /**
   * Sincroniza los datos del usuario (nombre, email, etc.) con los datos reales del backend
   */
  useEffect(() => {
    if (!accessToken) return;

    const syncUserWithProfile = async () => {
      try {
        const profile = await getTherapistProfile();
        setUser((prev) =>
          prev
            ? {
                ...prev,
                firstName: profile.firstName,
                lastName: profile.lastName,
                email: profile.email,
              }
            : null
        );
      } catch (error) {
        console.warn("No se pudo sincronizar el perfil del usuario:", error);
      }
    };

    syncUserWithProfile();
  }, [accessToken]);

  /**
   * Programa el refresco automático del token.
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

  const value = useMemo(
    () => ({
      accessToken,
      refreshToken,
      isAuthenticated,
      loading,
      user,
      login,
      logout,
      justRegistered,
      setJustRegistered,
      permissions,
      hasPermission,
    }),
    [
      accessToken,
      refreshToken,
      isAuthenticated,
      loading,
      user,
      login,
      logout,
      justRegistered,
      permissions,
      hasPermission,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthState => useContext(AuthContext);
