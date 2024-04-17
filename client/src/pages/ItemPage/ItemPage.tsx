import { useLoaderData, useNavigate } from "react-router-dom";
import { ProductCardProps } from "../../components/ProductCard/ProductCard.props";
import BackButton from "../../components/BackButton";
import { MouseEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { cartActions } from "../../store/cart.slice";
import Button from "../../components/Button/Button";
import { jwtDecode } from "jwt-decode";
import { JwtInterface } from "../../interfaces/jwtDecode.interface";
import styles from "./ItemPage.module.css";
import UpdateItem from "../../components/Modals/UpdateItem";
import { Product } from "../../interfaces/product.interface";
import { removeItem } from "../../store/item.slice";

const ItemPage = () => {
  const data = useLoaderData() as ProductCardProps;
  const [newData, setNewData] = useState<Product>(data);
  const navigate = useNavigate();
  const itemData = useSelector((state: RootState) => state.item.currentItem);

  useEffect(() => {
    if (itemData) setNewData(itemData);
  }, [itemData]);

  const token = useSelector((state: RootState) => state.user.token);
  const decodedToken = token ? jwtDecode<JwtInterface>(token) : undefined;
  const imagePath = newData.img.includes(import.meta.env.VITE_IMAGE_MASK)
    ? newData.img
    : import.meta.env.VITE_IMAGE_PATH_API + newData.img;

  const dispatch = useDispatch<AppDispatch>();

  const [itemVisible, setItemVisible] = useState(false);

  const add = (event: MouseEvent) => {
    event.preventDefault();
    dispatch(cartActions.add(newData.id));
  };

  const handleEditClick = () => {
    setItemVisible(true);
  };

  const handleDeleteClick = async () => {
    const confirmDelete = window.confirm(
      "Вы уверены, что хотите удалить этот товар?",
    );
    if (confirmDelete) {
      try {
        if (token) {
          await dispatch(removeItem({ id: data.id, token }));
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
    <div>
      <BackButton />
      <div>Артикул: {newData.code}</div>
      <div>{newData.name}</div>
      <img src={imagePath} width={300} height={300} alt="" />
      <div>
        {newData.price} <span>₽</span>
      </div>
      <div>{newData.category_name}</div>
      {newData.info && newData.info.length > 0 && (
        <div>
          <h1>Характеристика товара</h1>
          {newData.info?.map((info, index) => {
            return (
              <div key={info.id}>
                <div
                  style={{
                    background: index % 2 === 0 ? "lightgray" : "transparent",
                  }}
                >
                  {info.title}:{info.description}
                </div>
              </div>
            );
          })}
        </div>
      )}
      <div className={styles["buttons"]}>
        {decodedToken && decodedToken.role === "ADMIN" ? (
          <>
            <Button className={styles["edit"]} onClick={handleEditClick}>
              Редактировать
            </Button>

            <Button className={styles["delete"]} onClick={handleDeleteClick}>
              Удалить
            </Button>
          </>
        ) : (
          token && <Button onClick={add}>В корзину</Button>
        )}
      </div>
      <UpdateItem show={itemVisible} onHide={() => setItemVisible(false)} />
    </div>
  );
};

export default ItemPage;
