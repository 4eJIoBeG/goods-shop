import { useLoaderData } from "react-router-dom";
import { ProductCardProps } from "../../components/ProductCard/ProductCard.props";
import BackButton from "../../components/BackButton";
import styles from "./ItemPage.module.css";
import { MouseEvent } from "react";

const ItemPage = () => {
  const data = useLoaderData() as ProductCardProps;

  const add = (event: MouseEvent) => {
    event.preventDefault();
  };

  return (
    <div>
      <BackButton />
      <div>Артикул: {data.code}</div>
      <button className={styles["add-to-cart"]} onClick={add}>
        <img src="/shop.svg" alt="add-to-cart-icon" />
      </button>
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
    </div>
  );
};

export default ItemPage;
