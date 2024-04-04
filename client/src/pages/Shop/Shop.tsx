import { useEffect, useState } from "react";
import { Product } from "../../interfaces/product.interface";
import { AxiosError } from "axios";
import ShopList from "./ShopList/ShopList";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { getAll, getAllInCategory } from "../../store/item.slice";
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
          setItems(payload.rows);
        }
      } else {
        const { payload } = await dispatch(getAll({ page, limit: 50 }));
        if (!payload) {
          return;
        }
        if (typeof payload === "object" && payload.rows && payload.count) {
          setTotalPages(Math.ceil(payload.count / 50));
          setItems(payload.rows);
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
  }, [currentPage, categoryId]);

  useEffect(() => {
    setItems(data.rows);
    setTotalPages(Math.ceil(data.count / 50));
  }, [data]);

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

      {!isLoading && totalPages > 1 && (
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
