import { useLoaderData } from "react-router-dom";
import { ProductCardProps } from "../../components/ProductCard/ProductCard.props";
import BackButton from "../../components/BackButton";

const ItemPage = () => {
  const data = useLoaderData() as ProductCardProps;

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
    </div>
  );
};

export default ItemPage;
