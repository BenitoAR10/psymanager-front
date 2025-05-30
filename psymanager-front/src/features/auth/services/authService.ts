import axiosInstance from "../../../services/axiosInstance";

export const refreshTokenService = async (refreshToken: string) => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const response = await fetch(`${apiUrl}/api/auth/token/refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refreshToken }),
  });
  if (!response.ok) throw new Error("Error al refrescar el token");
  return await response.json(); // Se asume { accessToken, refreshToken }
};

/**
 * Obtiene la lista de permisos del usuario autenticado.
 */
export const getPermissionsService = async (): Promise<string[]> => {
  const response = await axiosInstance.get<string[]>(
    "/api/auth/me/permissions"
  );
  return response.data;
};
