import { useLoaderData } from "react-router-dom";
import { ProductCardProps } from "../../components/ProductCard/ProductCard.props";
import BackButton from "../../components/BackButton";
import { MouseEvent } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store/store";
import { cartActions } from "../../store/cart.slice";
import Button from "../../components/Button/Button";

const ItemPage = () => {
  const data = useLoaderData() as ProductCardProps;
  const imagePath = data.img.includes("https://hoz-tovari.ru")
    ? data.img
    : import.meta.env.VITE_IMAGE_PATH_API + data.img;

  const dispatch = useDispatch<AppDispatch>();

  const add = (event: MouseEvent) => {
    event.preventDefault();
    dispatch(cartActions.add(data.id));
  };

  return (
    <div>
      <BackButton />
      <div>Артикул: {data.code}</div>
      <div>{data.name}</div>
      <img src={imagePath} width={300} height={300} alt="" />
      <div>
        {data.price} <span>₽</span>
      </div>
      <div>{data.category_name}</div>
      {data.info && data.info.length > 0 && (
        <div>
          <h1>Характеристика товара</h1>
          {data.info?.map((info, index) => {
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
      <Button onClick={add}>В корзину</Button>
    </div>
  );
};

export default ItemPage;
