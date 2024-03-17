import { useEffect, useState } from "react";
import { Product } from "../../interfaces/product.interface";

const Shop = () => {
  const [items, setItems] = useState<Product[]>([]);

  const getItems = async () => {
    const params = {
      page: 1,
      limit: 100,
    };
    try {
      const res = await fetch(
        `http://localhost:5000/api/item?limit=${params.limit}&page=${params.page}`,
      );
      const data = await res.json();
      console.log(data.rows);

      setItems(data.rows);
    } catch (error) {
      console.log(error);
      return;
    }
  };

  useEffect(() => {
    getItems();
  }, []);

  return (
    <div>
      Shop
      {[...new Set(items)].map((item) => {
        return (
          <div key={item.id}>
            <div>{item.category_name}</div>
          </div>
        );
      })}
    </div>
  );
};

export default Shop;
