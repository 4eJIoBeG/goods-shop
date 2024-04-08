import { useDispatch, useSelector } from "react-redux";
import Header from "../../components/Header/Header";
import { RootState } from "../../store/store";
import CartItem from "../../components/CartItem/CartItem";
import { useEffect, useState } from "react";
import { Product } from "../../interfaces/product.interface";
import axios from "axios";
import { BASE_URL_API } from "../../helpers/API";
import styles from "./Basket.module.css";
import Button from "../../components/Button/Button";
import { useNavigate } from "react-router-dom";
import { cartActions } from "../../store/cart.slice";

const DELIVERY_FEE = 169;

const Basket = () => {
  const [cartProducts, setCartProducts] = useState<Product[]>([]);
  const items = useSelector((state: RootState) => state.cart.items);
  const token = useSelector((state: RootState) => state.user.token);
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
    const { data } = await axios.get(`${BASE_URL_API}/item/${id}`);
    return data;
  };

  const loadAllItems = async () => {
    const result = await Promise.all(items.map((item) => getItem(item.id)));
    setCartProducts(result);
  };

  const chekout = async () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { data } = await axios.post(
      `${BASE_URL_API}/order`,
      {
        products: items,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    dispatch(cartActions.cleanCart());
    navigate("/success");
  };

  useEffect(() => {
    loadAllItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  const cleanCart = () => {
    dispatch(cartActions.cleanCart());
  };

  return (
    <>
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
      {items.map((item) => {
        const product = cartProducts.find((prod) => prod.id === item.id);
        if (!product) {
          return;
        }
        return <CartItem key={product.id} count={item.count} {...product} />;
      })}
      {items.length === 0 ? (
        <>Корзина пуста</>
      ) : (
        <>
          <div className={styles["line"]}>
            <div className={styles["text"]}>Итог</div>
            <div className={styles["price"]}>
              {total}&nbsp;
              <span>₽</span>
            </div>
          </div>
          <hr className={styles["hr"]} />
          <div className={styles["line"]}>
            <div className={styles["text"]}>Доставка</div>
            <div className={styles["price"]}>
              {DELIVERY_FEE}&nbsp;
              <span>₽</span>
            </div>
          </div>
          <hr className={styles["hr"]} />
          <div className={styles["line"]}>
            <div className={styles["text"]}>
              Итог <span>({items.length})</span>
            </div>
            <div className={styles["price"]}>
              {total + DELIVERY_FEE}&nbsp;
              <span>₽</span>
            </div>
          </div>
          <div className={styles["chekout"]}>
            <Button appearence="big">ОФОРМИТЬ</Button>
          </div>
        </>
      )}
    </>
  );
};

export default Basket;
