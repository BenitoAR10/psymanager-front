import React, {
  createContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
} from "react";
import { jwtDecode } from "jwt-decode";
import * as SecureStore from "expo-secure-store/build/SecureStore";

interface JwtPayload {
  sub: string;
  roles?: string[];
  exp: number;
  userId?: number;
  firstName?: string;
  lastName?: string;
}

export interface AuthContextType {
  token: string | null;
  refreshToken: string | null;
  userInfo?: JwtPayload | null;
  isAuthenticated: boolean;
  login: (accessToken: string, refreshToken: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  token: null,
  refreshToken: null,
  userInfo: null,
  isAuthenticated: false,
  login: async () => {},
  logout: async () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<JwtPayload | null>(null);

  // Cargar tokens al iniciar la app
  useEffect(() => {
    const loadTokens = async () => {
      const storedToken = await SecureStore.getItemAsync("accessToken");
      const storedRefresh = await SecureStore.getItemAsync("refreshToken");

      if (storedToken && storedRefresh) {
        try {
          const decoded = jwtDecode<JwtPayload>(storedToken);
          setToken(storedToken);
          setRefreshToken(storedRefresh);
          setUserInfo(decoded);
        } catch (error) {
          console.warn("Error decoding stored token:", error);
          await logout(); // Token corrupto, lo borramos
        }
      }
    };

    loadTokens();
  }, []);

  // Iniciar sesión: guardar tokens y decodificar info
  const login = useCallback(async (accessToken: string, rt: string) => {
    try {
      const decoded = jwtDecode<JwtPayload>(accessToken);
      setToken(accessToken);
      setRefreshToken(rt);
      setUserInfo(decoded);
      await SecureStore.setItemAsync("accessToken", accessToken);
      await SecureStore.setItemAsync("refreshToken", rt);
    } catch (error) {
      console.error("Error during login:", error);
    }
  }, []);

  // Cerrar sesión: limpiar todo
  const logout = useCallback(async () => {
    setToken(null);
    setRefreshToken(null);
    setUserInfo(null);
    await SecureStore.deleteItemAsync("accessToken");
    await SecureStore.deleteItemAsync("refreshToken");
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
