import { useEffect, useState } from "react";
import { ApiResponse, Product } from "../../interfaces/product.interface";
import axios, { AxiosError } from "axios";
import ShopList from "./ShopList/ShopList";
import { BASE_URL_API } from "../../helpers/API";
import { Category } from "../../interfaces/category.interface";
import { useLoaderData } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { getItems } from "../../store/item.slice";

const Shop = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [items, setItems] = useState<Product[]>([]);
  const { id } = useLoaderData() as Category;
  // const data = useSelector((state: RootState) => state.item);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | undefined>();

  // const getItemsAll = async (
  //   page: number,
  //   limit: number,
  //   categoryId: number,
  // ) => {
  //   dispatch(getItems({ page, limit, categoryId }));
  // };

  const getItems = async (page: number, limit: number, categoryId: number) => {
    try {
      if (!categoryId) {
        const { data } = await axios.get<ApiResponse>(
          `${BASE_URL_API}/item?limit=${limit}&page=${page}`,
        );
      }

      const { data } = await axios.get<ApiResponse>(
        `${BASE_URL_API}/item?limit=${limit}&page=${page}&categoryId=${categoryId}`,
      );

      setItems(data.rows);
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
    const categoryId = id || 1;
    getItems(1, 50, categoryId);
  }, [id]);

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
