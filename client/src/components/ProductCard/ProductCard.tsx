import { Link } from "react-router-dom";
import styles from "./ProductCard.module.css";
import { ProductCardProps } from "./ProductCard.props";
import { MouseEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { cartActions } from "../../store/cart.slice";
import Button from "../Button/Button";

const ProductCard = (props: ProductCardProps) => {
  const { id, name, price, img, code } = props;
  const dispatch = useDispatch<AppDispatch>();
  const token = useSelector((state: RootState) => state.user.token);
  const imagePath = img.includes(import.meta.env.VITE_IMAGE_MASK)
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
          </div>
        </div>
      </Link>
      <div className={styles["info"]}>
        <div className={styles["description"]}>Артикул: {code}</div>
        <Link to={`/items/item/${id}`} className={styles["link"]}>
          <div className={styles["title"]}>{name}</div>
        </Link>
      </div>
      {token && (
        <Button className={styles["add"]} onClick={add}>
          <img src="/shop.svg" alt="add-to-cart-icon" /> В корзину
        </Button>
      )}
    </div>
  );
};

export default ProductCard;
