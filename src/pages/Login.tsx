import React, { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const credentials = { email, password };
      console.log("Sending credentials to the backend:", credentials);
      // Fazemos uma requisição POST para o endpoint /login do seu backend
      const response = await fetch("http://localhost:3001/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        // Caso haja algum erro, captura a mensagem do backend
        const errorData = await response.json();
        setError(errorData.error || "Erro ao fazer login");
        return;
      }

      const data = await response.json();
      // Store token and role
      localStorage.setItem("userToken", data.token);
      localStorage.setItem("userRole", data.user.role);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate(data.redirectTo);
    } catch (err) {
      console.error("Erro inesperado: ", err);
      setError("Erro inesperado, tente novamente mais tarde.");
    }
  };

  const token = localStorage.getItem("userToken");

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div>
      <h1>Login</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <input
        type="email"
        placeholder="Digite seu e-mail"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Digite sua senha"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Entrar</button>
    </div>
  );
};

export default Login;
