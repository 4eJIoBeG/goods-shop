import { NavLink, Outlet, useNavigate } from "react-router-dom";
import styles from "./Layout.module.css";
import Button from "../../components/Button/Button";
import cn from "classnames";

export const Layout = () => {
  const navigate = useNavigate();

  const logout = () => {
    navigate("/auth/login");
  };
  return (
    <div className={styles["layout"]}>
      <div className={styles["navbar"]}>
        Navbar
        <Button className={styles["exit"]} onClick={logout}>
          Авторизация
        </Button>
      </div>
      <div className={styles["container"]}>
        <div className={styles["sidebar"]}>
          <div className={styles["menu"]}>
            <NavLink
              to="/"
              className={({ isActive }) =>
                cn(styles["link"], {
                  [styles.active]: isActive,
                })
              }
            >
              Меню
            </NavLink>
            <NavLink
              to="/basket"
              className={({ isActive }) =>
                cn(styles["link"], {
                  [styles.active]: isActive,
                })
              }
            >
              Товары для дома и предприятия
            </NavLink>
          </div>
        </div>
        <div className={styles["content"]}>
          <Outlet />
        </div>
      </div>
      <div className={styles["footer"]}>Footer</div>
    </div>
  );
};
