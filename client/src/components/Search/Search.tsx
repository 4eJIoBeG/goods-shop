import { forwardRef, InputEvent } from "react";
import styles from "./Search.module.css";
import cn from "classnames";
import { SearchProps } from "./Search.props";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { itemActions } from "../../store/item.slice";

const Search = forwardRef<HTMLInputElement, SearchProps>(function Input(
  { className, isValid = true, ...props },
  ref,
) {
  const dispatch = useDispatch();
  const searchText = useSelector((state: RootState) => state.item.searchReq);

  const handleSearch = (event: InputEvent<HTMLInputElement>) => {
    dispatch(itemActions.search(event.target.value));
  };

  return (
    <div className={styles["input-wrapper"]}>
      <input
        ref={ref}
        placeholder="Поиск товара..."
        className={cn(styles["input"], className, {
          [styles["invalid"]]: !isValid,
        })}
        {...props}
        value={searchText}
        onChange={handleSearch}
      />
      <img className={styles["icon"]} src="/search.svg" alt="search" />
    </div>
  );
});

export default Search;
