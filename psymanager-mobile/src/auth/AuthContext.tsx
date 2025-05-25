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
  exp: number;
  userId?: number;
  firstName?: string;
  lastName?: string;
  profilePicture?: string;
}

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
  isAuthenticated: false,
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
  const [isInitializing, setIsInitializing] = useState(true);
  const [justRegistered, setJustRegistered] = useState(false);

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

    await queryClient.cancelQueries();
    await queryClient.clear();

    await storage.removeItem("accessToken");
    await storage.removeItem("refreshToken");
  }, []);

  useEffect(() => {
    const initialize = async () => {
      try {
        const storedToken = await storage.getItem("accessToken");
        const storedRefresh = await storage.getItem("refreshToken");

        if (storedToken && storedRefresh) {
          const decoded = jwtDecode<JwtPayload>(storedToken);
          setToken(storedToken);
          setRefreshToken(storedRefresh);
          setUserInfo(decoded);
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

  const forceLogout = async () => {
    console.warn("Token inválido o expirado. Forzando cierre de sesión...");
    await logout();
  };

  // Refrescar datos sensibles o revalidar info si vuelve del background (no tokens)
  useEffect(() => {
    const sub = AppState.addEventListener("change", (state) => {
      if (state === "active") {
        console.log("📱 App activa nuevamente");
        // Podrías revalidar perfil aquí si es necesario
      }
    });

    return () => sub.remove();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        token,
        refreshToken,
        userInfo,
        isAuthenticated: token !== null,
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
