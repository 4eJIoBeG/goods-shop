import { ChangeEvent, forwardRef, useEffect, useState } from "react";
import styles from "./Search.module.css";
import cn from "classnames";
import { SearchProps } from "./Search.props";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchItemsBySearch,
  getAll,
  itemActions,
} from "../../store/item.slice";
import { debounce } from "lodash";
import { AppDispatch, RootState } from "../../store/store";
import { useLocation } from "react-router-dom";
const debouncedSendSearch = debounce((dispatch, searchValue) => {
  if (searchValue.trim()) {
    dispatch(fetchItemsBySearch(searchValue));
  }
}, 500);
const Search = forwardRef<HTMLInputElement, SearchProps>(function Input(
  { className, isValid = true, ...props },
  ref,
) {
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const searchText = useSelector((state: RootState) => state.item.searchReq);
  const [searchValue, setSearchValue] = useState<string>(searchText);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  const clearSrch = () => {
    dispatch(itemActions.searchClear());
    setSearchValue("");
    dispatch(getAll({ page: 1, limit: 50 }));
  };

  useEffect(() => {
    // Синхронизируем searchValue с searchText из Redux store
    setSearchValue(searchText);
  }, [searchText]); // Добавляем searchText как зависимость

  useEffect(() => {
    setSearchValue("");
  }, [location.pathname]);

  useEffect(() => {
    if (searchValue) {
      debouncedSendSearch(dispatch, searchValue);
    }
  }, [searchValue, dispatch]);

  useEffect(() => {
    return () => {
      debouncedSendSearch.cancel();
    };
  }, [debouncedSendSearch]);

  return (
    <div className={styles["input-wrapper"]}>
      <input
        ref={ref}
        placeholder="Поиск товара..."
        className={cn(styles["input"], className, {
          [styles["invalid"]]: !isValid,
        })}
        {...props}
        value={searchValue}
        onChange={handleChange}
      />
      <img className={styles["icon"]} src="/search.svg" alt="search" />
      <button onClick={clearSrch} className={styles["icon-clear"]}>
        <img src="/remove.svg" alt="search" />
      </button>
    </div>
  );
});

export default Search;
