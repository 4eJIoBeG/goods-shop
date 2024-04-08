import { Link } from "react-router-dom";
import styles from "./ProductCard.module.css";
import { ProductCardProps } from "./ProductCard.props";
import { MouseEvent } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store/store";
import { cartActions } from "../../store/cart.slice";

const ProductCard = (props: ProductCardProps) => {
  const { id, name, price, img, code } = props;
  const dispatch = useDispatch<AppDispatch>();

  const add = (event: MouseEvent) => {
    event.preventDefault();
    dispatch(cartActions.add(id));
  };

  return (
    <Link to={`/items/item/${id}`} className={styles["link"]}>
      <div className={styles["card"]}>
        <div
          className={styles["header"]}
          style={{ backgroundImage: `url('${img}')` }}
        >
          <div className={styles["price"]}>
            {price}&nbsp;
            <span className={styles["currency"]}>₽</span>
            {/* {Math.ceil(price * 1.2)}&nbsp; */}
          </div>
          <button className={styles["add-to-cart"]} onClick={add}>
            <img src="/shop.svg" alt="add-to-cart-icon" />
          </button>
        </div>
        <div className={styles["info"]}>
          <div className={styles["description"]}>Артикул: {code}</div>
          <div className={styles["title"]}>{name}</div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
