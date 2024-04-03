import { useEffect, useState } from "react";
import { Product } from "../../interfaces/product.interface";
import { AxiosError } from "axios";
import ShopList from "./ShopList/ShopList";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { getAll, getAllInCategory } from "../../store/item.slice";
import { useParams } from "react-router-dom";

const Shop = () => {
  const dispatch = useDispatch<AppDispatch>();
  const data = useSelector((state: RootState) => state.item.items);
  const [items, setItems] = useState<Product[]>([]);
  const { categoryId } = useParams();
  console.log(categoryId);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | undefined>();

  const getItems = async () => {
    try {
      if (categoryId) {
        dispatch(
          getAllInCategory({
            page: 1,
            limit: 50,
            categoryId: parseInt(categoryId),
          }),
        );
      } else {
        dispatch(getAll({ page: 1, limit: 50 }));
      }

      setItems(data);
    } catch (error) {
      if (error instanceof AxiosError) {
        setError(error.message);
      }
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getItems();
  }, [categoryId]);

  useEffect(() => {
    setItems(data);
  }, [data]);

  return (
    <div>
      Shop
      {error && <>Произошла ошибка {error}</>}
      {!isLoading && <ShopList items={items} />}
      {isLoading && <>Загрузка товаров...</>}
    </div>
  );
};

export default Shop;
