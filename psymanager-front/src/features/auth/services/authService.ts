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
