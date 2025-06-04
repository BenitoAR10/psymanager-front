import React, {
  createContext,
  useState,
  ReactNode,
  useCallback,
  useEffect,
} from "react";
import { jwtDecode } from "jwt-decode";
import { AppState } from "react-native";
import { storage } from "../utils/storage";
import { queryClient } from "../utils/queryClient";

// === Interfaces ===

interface JwtPayload {
  sub: string;
  roles?: string[];
  exp: number; // Timestamp (en segundos)
  userId?: number;
  firstName?: string;
  lastName?: string;
  profilePicture?: string;
}

export interface AuthContextType {
  token: string | null;
  refreshToken: string | null;
  userInfo?: JwtPayload | null;
  isAuthenticatedLocal: boolean;
  login: (
    accessToken: string,
    refreshToken: string,
    isNewUser?: boolean
  ) => Promise<void>;
  logout: () => Promise<void>;
  forceLogout: () => Promise<void>;
  isInitializing: boolean;
  justRegistered: boolean;
  setJustRegistered: (value: boolean) => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

// === Context ===

export const AuthContext = createContext<AuthContextType>({
  token: null,
  refreshToken: null,
  userInfo: null,
  isAuthenticatedLocal: false,
  login: async () => {},
  logout: async () => {},
  forceLogout: async () => {},
  isInitializing: true,
  justRegistered: false,
  setJustRegistered: () => {},
});

// === AuthProvider ===

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<JwtPayload | null>(null);

  // Nuevo estado para “autenticación local” (basada solo en fecha de expiración)
  const [isAuthenticatedLocal, setIsAuthenticatedLocal] = useState(false);

  const [isInitializing, setIsInitializing] = useState(true);
  const [justRegistered, setJustRegistered] = useState(false);

  // **login**: al recibir un nuevo accessToken, lo decodificamos y marcamos localmente como logueado
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

        // Como acaba de recibir token, asume que localmente está autenticado
        setIsAuthenticatedLocal(true);
      } catch (error) {
        console.error("❌ Error en login:", error);
      }
    },
    []
  );

  const logout = useCallback(async () => {
    setToken(null);
    setRefreshToken(null);
    setUserInfo(null);
    setJustRegistered(false);

    // Limpiar queryClient y Storage
    await queryClient.cancelQueries();
    await queryClient.clear();

    await storage.removeItem("accessToken");
    await storage.removeItem("refreshToken");

    // Ya no está autenticado localmente
    setIsAuthenticatedLocal(false);
  }, []);

  // useEffect de inicialización
  useEffect(() => {
    const initialize = async () => {
      try {
        const storedToken = await storage.getItem("accessToken");
        const storedRefresh = await storage.getItem("refreshToken");

        if (storedToken && storedRefresh) {
          // Decodificamos para extraer `exp`
          const decoded = jwtDecode<JwtPayload>(storedToken);
          const now = Date.now();
          const expMs = decoded.exp * 1000;

          if (now < expMs) {
            // Token aún válido
            setToken(storedToken);
            setRefreshToken(storedRefresh);
            setUserInfo(decoded);
            setIsAuthenticatedLocal(true);
          } else {
            // Token expirado → limpiar todo
            await storage.removeItem("accessToken");
            await storage.removeItem("refreshToken");
            setIsAuthenticatedLocal(false);
          }
        }
      } catch (e) {
        console.warn("⚠️ Token inválido o expirado durante la inicialización.");
        await logout();
      } finally {
        setIsInitializing(false);
      }
    };

    initialize();
  }, [logout]);

  // **forceLogout**: cuando salta expiración tardía (por ejemplo, al refrescar falla)
  const forceLogout = async () => {
    console.warn("Token inválido o expirado. Forzando cierre de sesión...");
    await logout();
  };

  // useEffect para escuchar AppState y revalidar expiración al volver a primer plano
  useEffect(() => {
    const handleAppStateChange = async (state: string) => {
      if (state === "active") {
        // Revisar si el token local ya expiró
        const storedToken = await storage.getItem("accessToken");
        if (storedToken) {
          try {
            const decoded = jwtDecode<JwtPayload>(storedToken);
            const now = Date.now();
            const expMs = decoded.exp * 1000;
            if (now >= expMs) {
              // Expiró mientras estuvo en background
              await forceLogout();
            }
          } catch {
            // Si no se puede decodificar, forzar logout
            await forceLogout();
          }
        }
      }
    };

    const sub = AppState.addEventListener("change", handleAppStateChange);
    return () => sub.remove();
  }, [forceLogout]);

  return (
    <AuthContext.Provider
      value={{
        token,
        refreshToken,
        userInfo,
        isAuthenticatedLocal,
        login,
        logout,
        forceLogout,
        isInitializing,
        justRegistered,
        setJustRegistered,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
