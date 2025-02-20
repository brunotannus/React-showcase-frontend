import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const AdminProtectedRoute: React.FC = () => {
  const token = localStorage.getItem("userToken");
  const role = localStorage.getItem("userRole"); // stored on login
  if (!token) {
    return <Navigate to="/login" />;
  }
  return role === "admin" ? <Outlet /> : <Navigate to="/dashboard" />;
};

export default AdminProtectedRoute;
