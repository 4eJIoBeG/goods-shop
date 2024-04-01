import { NavLink, Outlet, useNavigate } from "react-router-dom";
import styles from "./Layout.module.css";
import Button from "../../components/Button/Button";
import cn from "classnames";
import Search from "../../components/Search/Search";
import axios, { AxiosError } from "axios";
import { BASE_URL_API } from "../../helpers/API";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { userActions } from "../../store/user.slice";
import { jwtDecode } from "jwt-decode";
import { JwtInterface } from "../../interfaces/jwtDecode.interface";
import { Category } from "../../interfaces/category.interface";

export const Layout = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | undefined>();
  const [category, setCategory] = useState<Category[]>([]);
  const dispatch = useDispatch<AppDispatch>();
  const token = useSelector((state: RootState) => state.user.token);
  const decodedToken = token ? jwtDecode<JwtInterface>(token) : undefined;

  const getCategory = async () => {
    try {
      const { data } = await axios.get<Category[]>(`${BASE_URL_API}/category`);
      setCategory(data);
    } catch (error) {
      if (error instanceof AxiosError) {
        setError(error.message);
      }
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    dispatch(userActions.logout());
    navigate("/auth/login");
  };

  const basket = () => {
    navigate("/basket");
  };

  const admin = () => {
    navigate("/admin");
  };

  const profile = () => {
    navigate("/profile");
  };

  useEffect(() => {
    getCategory();
  }, []);

  return (
    <div className={styles["layout"]}>
      <div className={styles["navbar"]}>
        <div className={styles["logo"]}>
          <img src="/scp.png" alt="" />
        </div>
        <div className={styles["search"]}>
          <Search />
        </div>
        <div className={styles["auth"]}>
          {decodedToken && decodedToken.role === "ADMIN" && (
            <Button className={styles["exit"]} onClick={admin}>
              Админ панель
            </Button>
          )}
          <Button className={styles["exit"]} onClick={profile}>
            Профиль
          </Button>
          <Button className={styles["exit"]} onClick={basket}>
            Корзина
          </Button>
          <Button className={styles["exit"]} onClick={logout}>
            {token ? "Выход" : "Авторизация"}
          </Button>
        </div>
      </div>
      <div className={styles["container"]}>
        <div className={styles["sidebar"]}>
          <div className={styles["menu"]}>
            {error && <>Произошла ошибка {error}</>}
            <NavLink
              to="/"
              className={({ isActive }) =>
                cn(styles["link"], {
                  [styles.active]: isActive,
                })
              }
            >
              Все товары
            </NavLink>
            {category.map((cat) => {
              return (
                <NavLink
                  key={cat.id}
                  to={`/category/${cat.id}`}
                  className={({ isActive }) =>
                    cn(styles["link"], {
                      [styles.active]: isActive,
                    })
                  }
                >
                  {cat.name}
                </NavLink>
              );
            })}

            {isLoading && <>Загрузка...</>}
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
