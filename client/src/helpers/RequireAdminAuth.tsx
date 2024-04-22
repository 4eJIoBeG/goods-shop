import { ReactNode } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { RootState } from "../store/store";
import { JwtInterface } from "../interfaces/jwtDecode.interface";
import { jwtDecode } from "jwt-decode";

const RequireAdminAuth = ({ children }: { children: ReactNode }) => {
  const jwt = useSelector((state: RootState) => state.user.token);
  const decodedToken = jwt ? jwtDecode<JwtInterface>(jwt) : undefined;

  if (!jwt || decodedToken?.role !== "ADMIN") {
    return <Navigate to="/login" replace />;
  }
  return children; // Возвращаем children, если проверка пройдена
};

export default RequireAdminAuth;
