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
      <img src={data.img} width={300} height={300} alt="" />
      <div>
        {data.price} <span>₽</span>
      </div>
      <div>{data.category_name}</div>
      {data.info?.map((inf) => {
        return (
          <div key={inf.id}>
            <div>{inf.title}</div>
            <div>{inf.description}</div>
          </div>
        );
      })}
      <Button onClick={add}>В корзину</Button>
    </div>
  );
};

export default ItemPage;
