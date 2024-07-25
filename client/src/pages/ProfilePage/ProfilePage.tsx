import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { jwtDecode } from "jwt-decode";
import { JwtInterface } from "../../interfaces/jwtDecode.interface";
import BackButton from "../../components/BackButton";
import styles from "./ProfilePage.module.css";
const ProfilePage = () => {
  const token = useSelector((state: RootState) => state.user.token);
  const decodedToken = token ? jwtDecode<JwtInterface>(token) : undefined;

  return (
    <>
      <div className={styles["backBtn"]}>
        <BackButton />
      </div>
      <div className={styles["card"]}>
        <div className={styles["title"]}>
          Профиль пользователя:{" "}
          {(decodedToken?.name
            ? decodedToken?.name
            : decodedToken?.email
          )?.toUpperCase()}
        </div>
        <div className={styles["info"]}>
          <div className={styles["description"]}>
            Роль: {decodedToken?.role}
          </div>
          <div className={styles["title"]}>
            Имя:{" "}
            {(decodedToken?.name
              ? decodedToken?.name
              : "не указано"
            )?.toUpperCase()}
          </div>
          <div className={styles["title"]}>
            Телефон: {decodedToken?.phone ? decodedToken?.phone : "не указан"}
          </div>
          <div className={styles["title"]}>E-Mail: {decodedToken?.email}</div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
