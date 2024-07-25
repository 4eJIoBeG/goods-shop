import { NavLink, Outlet, useNavigate } from "react-router-dom";
import styles from "./Layout.module.css";
import Button from "../../components/Button/Button";
import cn from "classnames";
import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { userActions } from "../../store/user.slice";
import { jwtDecode } from "jwt-decode";
import { JwtInterface } from "../../interfaces/jwtDecode.interface";
import { ICategory } from "../../interfaces/category.interface";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from "react-bootstrap";

export const Layout = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | undefined>();
  const [category, setCategory] = useState<ICategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<ICategory | null>({
    id: 19,
    name: "Все товары",
    createdAt: "asfasf",
    updatedAt: "dsffsd",
  });
  const dispatch = useDispatch<AppDispatch>();
  const token = useSelector((state: RootState) => state.user.token);
  const decodedToken = token ? jwtDecode<JwtInterface>(token) : undefined;
  const items = useSelector((state: RootState) => state.cart.items);

  const getCategory = async () => {
    try {
      const { data } = await axios.get<ICategory[]>(
        `${import.meta.env.VITE_API_URL}/category`,
      );
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
    navigate("/login");
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
      <div className={styles["logo"]}>
        <NavLink
          to="/items"
          className={({ isActive }) =>
            cn(styles["link"], {
              [styles.active]: isActive,
            })
          }
        >
          GOODS-SHOP
        </NavLink>
      </div>
      <div className={styles["navbar"]}>
        {/* <div className={styles["search"]}>{showSearch && <Search />}</div> */}
        <div className={styles["auth"]}>
          {decodedToken && decodedToken.role === "ADMIN" && (
            <Button
              className={styles["admin"]}
              appearence="small"
              onClick={admin}
            >
              Админ
            </Button>
          )}
          {token && (
            <Button
              className={styles["profile"]}
              appearence="small"
              onClick={profile}
            >
              Профиль
            </Button>
          )}
          {token && (
            <Button
              className={styles["cart"]}
              appearence="small"
              onClick={basket}
            >
              {items.length === 0 ? (
                "Корзина пуста"
              ) : (
                <>
                  {"В корзине "}
                  {items.reduce((acc, item) => (acc += item.count), 0)}
                </>
              )}
            </Button>
          )}
          <Button
            className={styles["exit"]}
            appearence="small"
            onClick={logout}
          >
            {token ? "Выход" : "Авторизация"}
          </Button>
        </div>
      </div>
      <div className={styles["container"]}>
        <div className={styles["sidebar"]}>
          <div className={styles["mobile-menu"]}>
            {/* <NavLink
              to="/items"
              className={({ isActive }) =>
                cn(styles["link"], {
                  [styles.active]: isActive,
                })
              }
            >
              Все товары
            </NavLink> */}
            <Dropdown>
              <DropdownToggle>
                {selectedCategory?.name || "Выберите категорию"}
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem
                  as="div"
                  onClick={() =>
                    setSelectedCategory({
                      id: 19,
                      name: "Все товары",
                      createdAt: "",
                      updatedAt: "",
                    })
                  }
                >
                  <NavLink
                    to={`/items`}
                    className={({ isActive }) =>
                      cn(styles["link"], {
                        [styles.active]: isActive,
                      })
                    }
                  >
                    Все товары
                  </NavLink>
                </DropdownItem>
                {category.map((cat) => (
                  <DropdownItem
                    as="div"
                    onClick={() => setSelectedCategory(cat)}
                    key={cat.id}
                  >
                    <NavLink
                      key={cat.id}
                      to={`/items/category/${cat.id}`}
                      className={({ isActive }) =>
                        cn(styles["link"], {
                          [styles.active]: isActive,
                        })
                      }
                    >
                      {cat.name}
                    </NavLink>
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </div>
          <div className={styles["menu"]}>
            {error && <>Произошла ошибка {error}</>}
            <NavLink
              to="/items"
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
                  to={`/items/category/${cat.id}`}
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
      <div className={styles["footer"]}>© Copyright 2024</div>
    </div>
  );
};
