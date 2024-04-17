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

  const imagePath = img.includes("https://hoz-tovari.ru")
    ? img
    : import.meta.env.VITE_IMAGE_PATH_API + img;

  const add = (event: MouseEvent) => {
    event.preventDefault();
    dispatch(cartActions.add(id));
  };

  return (
    <div className={styles["card"]}>
      <Link to={`/items/item/${id}`} className={styles["link"]}>
        <div
          className={styles["header"]}
          style={{ backgroundImage: `url('${imagePath}')` }}
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
      </Link>
      <div className={styles["info"]}>
        <div className={styles["description"]}>Артикул: {code}</div>
        <Link to={`/items/item/${id}`} className={styles["link"]}>
          <div className={styles["title"]}>{name}</div>
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
