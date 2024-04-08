import styles from "./CartItem.module.css";
import { CartItemProps } from "./CartItem.props";

const CartItem = (props: CartItemProps) => {
  const { name, price, img, count } = props;

  const remove = () => {};
  const decrease = () => {};
  const increase = () => {};

  return (
    <div className={styles["item"]}>
      <div
        className={styles["image"]}
        style={{ backgroundImage: `url('${img}')` }}
      ></div>
      <div className={styles["description"]}>
        <div className={styles["name"]}>{name}</div>
        <span className={styles["price"]}>{price}&nbsp;₽</span>
      </div>
      <div className={styles["actions"]}>
        <button className={styles["decrease"]} onClick={decrease}>
          <img src="/minus.svg" alt="decrease-item" />
        </button>
        <div className={styles["counter"]}>{count}</div>
        <button className={styles["increase"]} onClick={increase}>
          <img src="/plus.svg" alt="increase-item" />
        </button>
        <button className={styles["remove"]} onClick={remove}>
          <img src="/remove.svg" alt="remove-item" />
        </button>
      </div>
    </div>
  );
};

export default CartItem;
