import ProductCard from "../../../components/ProductCard/ProductCard";
import { ShopListProps } from "./ShopList.props";
import styles from "./ShopList.module.css";

const ShopList = ({ items }: ShopListProps) => {
  return (
    <div className={styles["wrapper"]}>
      {items.map((item) => {
        return (
          <ProductCard
            key={item.id}
            id={item.id}
            name={item.name}
            price={item.price}
            img={item.img}
            code={item.code}
          />
        );
      })}
    </div>
  );
};

export default ShopList;
