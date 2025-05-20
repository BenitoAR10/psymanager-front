import React, {
  createContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { jwtDecode } from "jwt-decode";
import { AppState } from "react-native";
import { storage } from "../utils/storage";
import { API_URL } from "../utils/constants";

// Payload esperado del JWT
interface JwtPayload {
  sub: string;
  roles?: string[];
  exp: number;
  userId?: number;
  firstName?: string;
  lastName?: string;
}

// Contexto para acceso global a sesión
export interface AuthContextType {
  token: string | null;
  refreshToken: string | null;
  userInfo?: JwtPayload | null;
  isAuthenticated: boolean;
  login: (
    accessToken: string,
    refreshToken: string,
    isNewUser?: boolean
  ) => Promise<void>;
  logout: () => Promise<void>;
  isInitializing: boolean;
  justRegistered: boolean;
  setJustRegistered: (value: boolean) => void;
}

// Creación del contexto con valores por defecto
export const AuthContext = createContext<AuthContextType>({
  token: null,
  refreshToken: null,
  userInfo: null,
  isAuthenticated: false,
  login: async () => {},
  logout: async () => {},
  isInitializing: true,
  justRegistered: false,
  setJustRegistered: () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

// Utilitario para calcular tiempo restante del token
const getTokenExpirationDelay = (token: string): number => {
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    return decoded.exp * 1000 - Date.now();
  } catch {
    return 0;
  }
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<JwtPayload | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [justRegistered, setJustRegistered] = useState(false);
  const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Manejo de inicio de sesión y persistencia
  const login = useCallback(
    async (accessToken: string, rt: string, isNewUser = false) => {
      try {
        const decoded = jwtDecode<JwtPayload>(accessToken);
        setToken(accessToken);
        setRefreshToken(rt);
        setUserInfo(decoded);
        setJustRegistered(isNewUser);
        await storage.setItem("accessToken", accessToken);
        await storage.setItem("refreshToken", rt);
      } catch (error) {
        console.error("Error during login:", error);
      }
    },
    []
  );

  // Cierre de sesión y limpieza total
  const logout = useCallback(async () => {
    setToken(null);
    setRefreshToken(null);
    setUserInfo(null);
    setJustRegistered(false);
    if (refreshTimeoutRef.current) clearTimeout(refreshTimeoutRef.current);
    await storage.removeItem("accessToken");
    await storage.removeItem("refreshToken");
  }, []);

  // Refresca el token si está expirado
  const refreshTokenIfNeeded = useCallback(async () => {
    setIsInitializing(true);
    try {
      const storedToken = await storage.getItem("accessToken");
      const storedRefresh = await storage.getItem("refreshToken");

      if (!storedToken || !storedRefresh) return;

      const decoded = jwtDecode<JwtPayload>(storedToken);
      const isExpired = decoded.exp * 1000 < Date.now();

      if (!isExpired) {
        setToken(storedToken);
        setRefreshToken(storedRefresh);
        setUserInfo(decoded);
      } else {
        const response = await fetch(`${API_URL}/api/auth/token/refresh`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken: storedRefresh }),
        });

        if (response.ok) {
          const data = await response.json();
          await login(data.accessToken, data.refreshToken);
        } else {
          await logout();
        }
      }
    } catch (error) {
      console.error("Error al refrescar token:", error);
      await logout();
    } finally {
      setIsInitializing(false);
    }
  }, [login, logout]);

  // Inicializa la sesión al montar el contexto
  const initializedRef = useRef(false);
  useEffect(() => {
    if (!initializedRef.current) {
      refreshTokenIfNeeded();
      initializedRef.current = true;
    }
  }, [refreshTokenIfNeeded]);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") {
        refreshTokenIfNeeded();
      }
    });

    return () => subscription.remove();
  }, [refreshTokenIfNeeded]);

  // Programación del auto-refresh del token
  useEffect(() => {
    if (!token || !userInfo) return;

    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
    }

    const delay = getTokenExpirationDelay(token);
    const refreshDelay = delay > 60000 ? delay - 60000 : 0;

    refreshTimeoutRef.current = setTimeout(() => {
      if (AppState.currentState === "active") {
        console.log("🔄 Auto-refresh ejecutado");
        refreshTokenIfNeeded();
      } else {
        console.log("⏸️ App en background, omitiendo refresh");
      }
    }, refreshDelay);

    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
    };
  }, [token, userInfo, refreshTokenIfNeeded]);

  return (
    <AuthContext.Provider
      value={{
        token,
        refreshToken,
        userInfo,
        isAuthenticated: token !== null,
        login,
        logout,
        isInitializing,
        justRegistered,
        setJustRegistered,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
