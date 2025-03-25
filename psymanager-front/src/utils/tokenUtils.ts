import { jwtDecode } from "jwt-decode";

export interface JwtPayload {
  exp: number;
  [key: string]: unknown;
}

/**
 * Retornamos true si el token está expirado
 */

export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    // jwt exp se mide en segundos
    return decoded.exp * 1000 < Date.now();
  } catch (error) {
    return true;
  }
};

/**
 * Calculamos el retraso en milisegundos para que el token expire
 */

export const getTokenExpirationDelay = (token: string): number => {
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    const delay = decoded.exp * 1000 - Date.now();
    return delay > 0 ? delay : 0;
  } catch (error) {
    return 0;
  }
};
