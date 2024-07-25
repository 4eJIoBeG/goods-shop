import { useDispatch, useSelector } from "react-redux";
import Header from "../../components/Header/Header";
import { AppDispatch, RootState } from "../../store/store";
import CartItem from "../../components/CartItem/CartItem";
import { useEffect, useState } from "react";
import { Product } from "../../interfaces/product.interface";
import axios from "axios";
import styles from "./Basket.module.css";
import Button from "../../components/Button/Button";
import { useNavigate } from "react-router-dom";
import { cartActions } from "../../store/cart.slice";
import { jwtDecode } from "jwt-decode";
import { JwtInterface } from "../../interfaces/jwtDecode.interface";

const Basket = () => {
  const [cartProducts, setCartProducts] = useState<Product[]>([]);
  const items = useSelector((state: RootState) => state.cart.items);
  const token = useSelector((state: RootState) => state.user.token);
  const decodedToken = token ? jwtDecode<JwtInterface>(token) : undefined;
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const basketId = useSelector((state: RootState) => state.cart.basketId);

  const total = items
    .map((item) => {
      const product = cartProducts.find((prod) => prod.id === item.id);
      if (!product) {
        return 0;
      }
      return item.count * product.price;
    })
    .reduce((acc, i) => (acc += i), 0);

  const getItem = async (id: number) => {
    const { data } = await axios.get(
      `${import.meta.env.VITE_API_URL}/item/${id}`,
    );
    return data;
  };

  const loadAllItems = async () => {
    try {
      const results = await Promise.all(
        items.map(
          (item) => getItem(item.id).catch(() => null), // Возвращаем null, если товар не найден
        ),
      );

      // Определяем отсутствующие товары
      const missingProductIds = items
        .map((item, index) => (results[index] === null ? item.id : null))
        .filter((id) => id !== null) // Удаляем null значения
        .map((id) => id as number);

      if (missingProductIds.length > 0) {
        // Удаляем отсутствующие товары из корзины
        dispatch(cartActions.deleteMultiple(missingProductIds));
        alert(
          "Некоторые товары в вашей корзине больше не доступны и были удалены.",
        );
      }

      const validProducts = results.filter((product) => product !== null);
      setCartProducts(validProducts);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data.message);
      } else {
        throw new Error("Ошибка при загрузке товаров...");
      }
    }
  };

  const checkout = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/order`,
        {
          userId: decodedToken?.id,
          basketId: basketId,
          items: items,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      dispatch(cartActions.cleanCart());
      navigate("/success");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data.message);
      } else {
        throw new Error("Ошибка при оформлении заказа...");
      }
    }
  };

  useEffect(() => {
    loadAllItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  const cleanCart = () => {
    dispatch(cartActions.cleanCart());
  };

  return (
    <div className={styles["cart-wrapper"]}>
      <Header className={styles["header"]}>
        Корзина{" "}
        {items.length === 0 ? (
          ""
        ) : (
          <Button
            className={styles["clear-cart"]}
            appearence="small"
            onClick={cleanCart}
          >
            Очистить корзину
          </Button>
        )}
      </Header>
      <div className="items">
        {items.map((item) => {
          const product = cartProducts.find((prod) => prod.id === item.id);
          if (!product) {
            return;
          }
          return <CartItem key={product.id} count={item.count} {...product} />;
        })}
      </div>
      <div className="items-info">
        {items.length === 0 ? (
          <>Корзина пуста</>
        ) : (
          <>
            <hr className={styles["hr"]} />
            <div className={styles["line"]}>
              <div className={styles["text"]}>
                Итог <span>({items.length})</span>
              </div>
              <div className={styles["price"]}>
                {total}&nbsp;
                <span>₽</span>
              </div>
            </div>
            <div className={styles["chekout"]}>
              <Button appearence="big" onClick={checkout}>
                ОФОРМИТЬ
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Basket;
