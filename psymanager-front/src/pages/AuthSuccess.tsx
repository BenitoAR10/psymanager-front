import React, { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AuthSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const accessToken = searchParams.get("accessToken");
    const refreshToken = searchParams.get("refreshToken");

    if (accessToken && refreshToken) {
      login(accessToken, refreshToken);
      navigate("/dashboard");
    } else {
      // Si algo falla, redirigimos al login
      navigate("/login");
    }
  }, []);

  return <p>Procesando autenticación....</p>;
};

export default AuthSuccess;
