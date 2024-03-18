import { NavLink, Outlet, useNavigate } from "react-router-dom";
import styles from "./Layout.module.css";
import Button from "../../components/Button/Button";
import cn from "classnames";
import Search from "../../components/Search/Search";
import axios, { AxiosError } from "axios";
import { Category } from "../../interfaces/product.interface";
import { BASE_URL_API } from "../../helpers/API";
import { useEffect, useState } from "react";

export const Layout = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | undefined>();
  const [category, setCategory] = useState<Category[]>([]);

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
    navigate("/auth/login");
  };

  const basket = () => {
    navigate("/basket");
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
          <Button className={styles["exit"]} onClick={basket}>
            Корзина
          </Button>
          <Button className={styles["exit"]} onClick={logout}>
            Авторизация
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
