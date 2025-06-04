import { storage } from "./storage";
import { API_URL } from "./urlConstant";
import { useAuth } from "../auth/useAuth";

/**
 * Promesa compartida para evitar múltiples refresh simultáneos.
 */
let isRefreshing = false;
let refreshPromise: Promise<void> | null = null;

/**
 * Realiza el refresh del token usando el refreshToken guardado.
 * Almacena el nuevo token en el storage si es exitoso.
 * @throws Error si el refresh falla o no hay tokens válidos.
 */
async function refreshAccessToken(): Promise<void> {
  if (isRefreshing && refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    isRefreshing = true;

    const refreshToken = await storage.getItem("refreshToken");
    if (!refreshToken) throw new Error("No hay refreshToken disponible.");

    const response = await fetch(`${API_URL}/api/auth/token/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) throw new Error("Refresh token inválido");

    const data = await response.json();
    if (!data.accessToken || !data.refreshToken) {
      throw new Error("Tokens faltantes en la respuesta.");
    }

    await storage.setItem("accessToken", data.accessToken);
    await storage.setItem("refreshToken", data.refreshToken);
  })();

  try {
    await refreshPromise;
  } finally {
    isRefreshing = false;
    refreshPromise = null;
  }
}

/**
 * Cliente de API centralizado que incluye el token y maneja el refresh automático.
 * También maneja respuestas vacías (sin body).
 *
 * @param input URL del endpoint o Request.
 * @param init Configuración del fetch (headers, método, body, etc.)
 * @returns Respuesta de la API como JSON o vacío.
 * @throws Error si falla la autenticación incluso tras intentar el refresh.
 */
export async function fetcher<T>(
  input: RequestInfo,
  init: RequestInit = {}
): Promise<T> {
  let token = await storage.getItem("accessToken");

  const url =
    typeof input === "string" && input.startsWith("/")
      ? `${API_URL}${input}`
      : input;

  const sendRequest = async (): Promise<Response> =>
    fetch(url, {
      ...init,
      headers: {
        ...init.headers,
        Authorization: token ? `Bearer ${token}` : "",
        "Content-Type": "application/json",
      },
    });

  let response = await sendRequest();

  // Si no es 401, pero falla igual
  if (response.status !== 401) {
    if (!response.ok) {
      const rawBody = await response.text();
      try {
        const parsed = JSON.parse(rawBody);
        throw new Error(parsed.message || `Error ${response.status}`);
      } catch {
        throw new Error(rawBody || `Error ${response.status}`);
      }
    }

    // ✅ Verificar si la respuesta es vacía
    const contentLength = response.headers.get("Content-Length");
    if (response.status === 204 || contentLength === "0") {
      return {} as T;
    }

    return response.json();
  }

  // Token expirado, intenta refrescar
  try {
    await refreshAccessToken();
    token = await storage.getItem("accessToken");

    response = await sendRequest();

    if (!response.ok) {
      const rawBody = await response.text();
      try {
        const parsed = JSON.parse(rawBody);
        throw new Error(parsed.message || `Error ${response.status}`);
      } catch {
        throw new Error(rawBody || `Error ${response.status}`);
      }
    }

    const contentLength = response.headers.get("Content-Length");
    const contentType = response.headers.get("Content-Type") ?? "";
    if (
      response.status === 204 ||
      contentLength === "0" ||
      contentType === ""
    ) {
      return {} as T;
    }

    return response.json();
  } catch (e) {
    console.warn("Token inválido o expirado. Forzando cierre de sesión...");

    try {
      const { forceLogout } = useAuth();
      if (forceLogout) await forceLogout();
    } catch (err) {
      console.error("Error forzando cierre de sesión:", err);
      await storage.removeItem("accessToken");
      await storage.removeItem("refreshToken");
    }

    throw new Error("Sesión expirada. Por favor inicia sesión nuevamente.");
  }
}
