import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { jwtDecode } from "jwt-decode";
import { JwtInterface } from "../../interfaces/jwtDecode.interface";

const ProfilePage = () => {
  const token = useSelector((state: RootState) => state.user.token);
  const decodedToken = token ? jwtDecode<JwtInterface>(token) : undefined;
  return (
    <div>
      <h1>Профиль пользователя: {decodedToken?.email}</h1>
      <div>Роль пользователя: {decodedToken?.role}</div>
    </div>
  );
};

export default ProfilePage;
