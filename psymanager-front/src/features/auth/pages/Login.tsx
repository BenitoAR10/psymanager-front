import React from "react";

const Login: React.FC = () => {
  const handleLogin = () => {
    // Redirigie a Google
    window.location.href = "http://localhost:8080/oauth2/authorization/google";
  };

  return (
    <div>
      <h1>Login</h1>
      <button onClick={handleLogin}>Login with Google</button>
    </div>
  );
};

export default Login;
