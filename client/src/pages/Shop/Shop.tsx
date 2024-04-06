import { useEffect, useState } from "react";
import { Product } from "../../interfaces/product.interface";
import { AxiosError } from "axios";
import ShopList from "./ShopList/ShopList";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { getAll, getAllInCategory, itemActions } from "../../store/item.slice";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import Pagination from "../../components/Pagination/Pagination";

const Shop = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.get("page") || 1;

  const data = useSelector((state: RootState) => state.item.items);
  const [items, setItems] = useState<Product[]>([]);
  const { categoryId } = useParams();
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(Number(page));
  const [totalPages, setTotalPages] = useState(0);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | undefined>();

  const searchText = useSelector((state: RootState) => state.item.searchReq);

  const getItems = async (page: number) => {
    try {
      if (categoryId) {
        const { payload } = await dispatch(
          getAllInCategory({
            page,
            limit: 50,
            categoryId: parseInt(categoryId),
          }),
        );
        if (!payload) {
          return;
        }
        if (typeof payload === "object" && payload.rows && payload.count) {
          setTotalPages(Math.ceil(payload.count / 50));
          const filteredPayload = payload.rows.filter((item) =>
            item.name.includes(searchText),
          );
          if (filteredPayload.length > 0) {
            setItems(filteredPayload);
          } else {
            setItems([]);
          }
        }
      } else {
        const { payload } = await dispatch(getAll({ page, limit: 50 }));
        if (!payload) {
          return;
        }
        if (typeof payload === "object" && payload.rows && payload.count) {
          setTotalPages(Math.ceil(payload.count / 50));
          const filteredPayload = payload.rows.filter((item) =>
            item.name.includes(searchText),
          );
          if (filteredPayload.length > 0) {
            setItems(filteredPayload);
          } else {
            setItems([]);
          }
        }
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        setError(error.message);
      }
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSearchParams({ page: String(page) });
    navigate(`?${new URLSearchParams(searchParams).toString()}`);
  };

  useEffect(() => {
    setSearchParams({ page: currentPage.toString() });
  }, [currentPage, setSearchParams]);

  useEffect(() => {
    getItems(Number(currentPage));
  }, [currentPage, categoryId, searchText]);

  useEffect(() => {
    dispatch(itemActions.searchClear());
  }, [categoryId]);

  useEffect(() => {
    if (data.rows.length > 0) {
      const filteredItems = data.rows.filter((item) =>
        item.name.toLowerCase().includes(searchText.toLowerCase()),
      );
      setItems(filteredItems);

      // Обновляем totalPages после фильтрации
      if (filteredItems.length > 0) {
        setTotalPages(Math.ceil(filteredItems.length / 50));
      } else {
        setTotalPages(0);
      }
    } else {
      setItems([]);
      setTotalPages(0);
    }
  }, [data, searchText]);

  return (
    <div>
      {error && <>Произошла ошибка {error}</>}
      {isLoading && <>Загрузка товаров...</>}

      {!isLoading &&
        (items.length ? (
          <ShopList items={items} />
        ) : (
          "В данной категории товаров нет"
        ))}

      {!isLoading && items.length > 0 && !searchText && (
        <Pagination
          currentPage={Number(currentPage)}
          totalPages={totalPages}
          setCurrentPage={handlePageChange}
        />
      )}
    </div>
  );
};

export default Shop;
