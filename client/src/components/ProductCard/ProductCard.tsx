import { Link, useNavigate } from "react-router-dom";
import styles from "./ProductCard.module.css";
import { ProductCardProps } from "./ProductCard.props";
import { MouseEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { cartActions } from "../../store/cart.slice";
import Button from "../Button/Button";
import { removeItem } from "../../store/item.slice";
import { jwtDecode } from "jwt-decode";
import { JwtInterface } from "../../interfaces/jwtDecode.interface";

const ProductCard = (props: ProductCardProps) => {
  const { id, name, price, img, code } = props;
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const token = useSelector((state: RootState) => state.user.token);
  const decodedToken = token ? jwtDecode<JwtInterface>(token) : undefined;
  const imagePath = img.includes(import.meta.env.VITE_IMAGE_MASK)
    ? img
    : import.meta.env.VITE_IMAGE_PATH_API + img;

  const add = (event: MouseEvent) => {
    event.preventDefault();
    dispatch(cartActions.add(id));
  };

  const handleDeleteClick = async () => {
    const confirmDelete = window.confirm(
      "Вы уверены, что хотите удалить этот товар?",
    );
    if (confirmDelete) {
      try {
        if (token && id) {
          await dispatch(removeItem({ id, token }));
          console.log("deleted");
          navigate(-1);
        } else {
          console.error("Ошибка: токен отсутствует.");
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      // Пользователь отменил удаление
      console.log("Удаление отменено");
    }
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
      <div className={styles["buttons"]}>
        {decodedToken && decodedToken.role === "ADMIN" ? (
          <>
            <Button className={styles["delete"]} onClick={handleDeleteClick}>
              Удалить
            </Button>
            <Button className={styles["add"]} onClick={add}>
              В корзину
            </Button>
          </>
        ) : (
          token && <Button onClick={add}>В корзину</Button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
