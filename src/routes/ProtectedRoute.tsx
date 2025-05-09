import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const userId = localStorage.getItem("userId");

  return userId ? <>{children}</> : <Navigate replace to="/login" />;
};

export default ProtectedRoute;
