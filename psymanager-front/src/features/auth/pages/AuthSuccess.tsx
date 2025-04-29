import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { CircularProgress, Box } from "@mui/material";

const AuthSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();

  // Leemos una sola vez los tokens de la URL
  const accessToken = searchParams.get("accessToken");
  const refreshToken = searchParams.get("refreshToken");

  useEffect(() => {
    if (accessToken && refreshToken) {
      login(accessToken, refreshToken);
      navigate("/dashboard", { replace: true });
    } else {
      navigate("/login", { replace: true });
    }
    // Dependencias estables: sólo disparamos cuando cambian los valores
  }, [accessToken, refreshToken, login, navigate]);

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <CircularProgress />
    </Box>
  );
};

export default AuthSuccess;
