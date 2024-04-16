import { useLoaderData } from "react-router-dom";
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

const ItemPage = () => {
  const data = useLoaderData() as ProductCardProps;
  const [newData, setNewData] = useState<Product>(data);

  const itemData = useSelector((state: RootState) => state.item.currentItem);

  useEffect(() => {
    if (itemData) setNewData(itemData);
  }, [itemData]);

  const token = useSelector((state: RootState) => state.user.token);
  const decodedToken = token ? jwtDecode<JwtInterface>(token) : undefined;
  const imagePath = newData.img.includes("https://hoz-tovari.ru")
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

  const handleDeleteClick = () => {
    console.log("deleted");

    // Удалить товар с сервера с помощью API-запроса
    // Например, вы можете отправить запрос DELETE на сервер
    // После успешного удаления перенаправьте пользователя на другую страницу или обновите список товаров
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
          <Button onClick={add}>В корзину</Button>
        )}
      </div>
      <UpdateItem show={itemVisible} onHide={() => setItemVisible(false)} />
    </div>
  );
};

export default ItemPage;
