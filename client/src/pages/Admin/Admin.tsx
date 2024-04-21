import { useEffect, useState } from "react";
import Button from "../../components/Button/Button";
import CreateCategory from "../../components/Modals/CreateCategory";
import CreateItem from "../../components/Modals/CreateItem";
import styles from "./Admin.module.css";
import RemoveCategory from "../../components/Modals/RemoveCategory";
import axios, { AxiosError } from "axios";
import { Order } from "../../interfaces/order.interface";

const Admin = () => {
  const [categoryVisible, setCategoryVisible] = useState(false);
  const [categoryRemoveVisible, setRemoveCategoryVisible] = useState(false);
  const [itemVisible, setItemVisible] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);

  const getOrders = async () => {
    try {
      const { data } = await axios.get<Order[]>(
        `${import.meta.env.VITE_API_URL}/order/orders`,
      );
      setOrders(data);
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log(error.message);
      }
      console.log(error);
    }
  };

  useEffect(() => {
    getOrders();
  }, []);
  console.log(orders);
  return (
    <div className={styles["admin"]}>
      <h1>Панель администратора</h1>
      <div className={styles["buttons"]}>
        <Button
          onClick={() => setCategoryVisible(true)}
          className={styles["add-category"]}
        >
          Добавить категорию
        </Button>
        <Button
          onClick={() => setRemoveCategoryVisible(true)}
          className={styles["remove-category"]}
        >
          Удалить категорию
        </Button>
        <Button
          onClick={() => setItemVisible(true)}
          className={styles["add-item"]}
        >
          Добавить товар
        </Button>
      </div>

      <h1>Заказы</h1>
      <div className={styles["orderItem"]}>
        {orders.map((order: Order) => {
          return (
            <div key={order.id}>
              <div className={styles["order-item"]}>
                <div>
                  <strong>Номер заказа: </strong> {order.id}
                </div>
                <div>Кто заказал: {order.userId}</div>
                <div>Статус заказа: {order.status}</div>
                <div>Список товаров:</div>
                {order.items.map((item, index: number) => {
                  return (
                    <ul key={item.id} className={styles["order-item-list"]}>
                      <li
                        style={{
                          background:
                            index % 2 === 0 ? "lightgray" : "transparent",
                        }}
                      >
                        <div>Артикул товара: {item.itemDetails.code}</div>
                        <div>{item.itemDetails.name}</div>
                        <div>Количество: {item.quantity}</div>
                      </li>
                    </ul>
                  );
                })}
                <div>Цена заказа: {order.totalPrice} ₽</div>
              </div>
              <hr />
            </div>
          );
        })}
      </div>

      <CreateCategory
        show={categoryVisible}
        onHide={() => setCategoryVisible(false)}
      />
      <RemoveCategory
        show={categoryRemoveVisible}
        onHide={() => setRemoveCategoryVisible(false)}
      />
      <CreateItem show={itemVisible} onHide={() => setItemVisible(false)} />
    </div>
  );
};

export default Admin;
