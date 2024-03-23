import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { jwtDecode } from "jwt-decode";
import { JwtInterface } from "../../interfaces/jwtDecode.interface";
import BackButton from "../../components/BackButton";

const ProfilePage = () => {
  const token = useSelector((state: RootState) => state.user.token);
  const decodedToken = token ? jwtDecode<JwtInterface>(token) : undefined;

  return (
    <div>
      <BackButton />
      <h1>Профиль пользователя: {decodedToken?.name}</h1>
      <div>E-Mail: {decodedToken?.email}</div>
      <div>
        Телефон:
        {decodedToken?.phone ? decodedToken?.phone : "не указан"}
      </div>
      <div>Роль пользователя: {decodedToken?.role}</div>
    </div>
  );
};

export default ProfilePage;
