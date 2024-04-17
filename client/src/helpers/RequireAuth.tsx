import { ReactNode } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { RootState } from "../store/store";

const RequireAuth = ({ children }: { children: ReactNode }) => {
  const jwt = useSelector((state: RootState) => state.user.token);
  if (!jwt) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default RequireAuth;
