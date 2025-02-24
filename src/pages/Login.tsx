import React, { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:3001/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || "Erro ao fazer login");
        return;
      }

      const data = await response.json();
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
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Login
        </h1>
        {error && (
          <p className="mb-4 text-sm text-red-600 bg-red-100 p-2 rounded">
            {error}
          </p>
        )}
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            E-mail
          </label>
          <input
            id="email"
            type="email"
            placeholder="Digite seu e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-tn-yellow focus:border-tn-yellow sm:text-sm"
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Senha
          </label>
          <input
            id="password"
            type="password"
            placeholder="Digite sua senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-tn-yellow focus:border-tn-yellow sm:text-sm"
          />
        </div>
        <button
          onClick={handleLogin}
          className="w-full bg-tn-yellow hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-md shadow transition duration-200 ease-in-out"
        >
          Entrar
        </button>
      </div>
    </div>
  );
};

export default Login;
