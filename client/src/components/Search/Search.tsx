import { ChangeEvent, forwardRef, useEffect, useState } from "react";
import styles from "./Search.module.css";
import cn from "classnames";
import { SearchProps } from "./Search.props";
import { useDispatch, useSelector } from "react-redux";
import { fetchItemsBySearch } from "../../store/item.slice";
import { debounce } from "lodash";
import { AppDispatch, RootState } from "../../store/store";
import { useLocation } from "react-router-dom";

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

  const debouncedSendSearch = debounce(() => {
    if (searchValue.trim()) {
      dispatch(fetchItemsBySearch(searchValue));
    }
  }, 500);

  useEffect(() => {
    setSearchValue("");
  }, [location.pathname]);

  useEffect(() => {
    if (searchValue) {
      debouncedSendSearch.cancel();
      debouncedSendSearch();
    }
  }, [searchValue, debouncedSendSearch]);

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
    </div>
  );
});

export default Search;
