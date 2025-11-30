// src/components/RequireAdmin.tsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const RequireAdmin: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const { user, isAdmin } = useAuth();
  const location = useLocation();

  if (!user) {
    // not logged in -> redirect to login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isAdmin) {
    // logged in but not admin -> send to homepage or show 403
    return <Navigate to="/" replace />;
  }

  return children;
};

export default RequireAdmin;