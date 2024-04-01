import { useEffect, useState } from "react";
import { ApiResponse, Product } from "../../interfaces/product.interface";
import axios, { AxiosError } from "axios";
import ShopList from "./ShopList/ShopList";
import { BASE_URL_API } from "../../helpers/API";
import { Category } from "../../interfaces/category.interface";
import { useLoaderData } from "react-router-dom";

const Shop = () => {
  const [items, setItems] = useState<Product[]>([]);
  const categoryId = useLoaderData() as Category;

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | undefined>();

  const getItems = async () => {
    const params = {
      page: 1,
      limit: 50,
      categoryId: categoryId.id,
    };
    try {
      if (categoryId) {
        const { data } = await axios.get<ApiResponse>(
          `${BASE_URL_API}/item?limit=${params.limit}&page=${params.page}&categoryId=${categoryId.id}`,
        );
      }
      const { data } = await axios.get<ApiResponse>(
        `${BASE_URL_API}/item?limit=${params.limit}&page=${params.page}`,
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
    getItems();
  }, []);

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
