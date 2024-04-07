import { ChangeEvent, forwardRef, useEffect } from "react";
import styles from "./Search.module.css";
import cn from "classnames";
import { SearchProps } from "./Search.props";
import { useDispatch } from "react-redux";
import { itemActions } from "../../store/item.slice";
import { debounce } from "lodash";

const Search = forwardRef<HTMLInputElement, SearchProps>(function Input(
  { className, isValid = true, ...props },
  ref,
) {
  const dispatch = useDispatch();
  // const searchText = useSelector((state: RootState) => state.item.searchReq);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    dispatch(itemActions.search(event.target.value));
  };

  const debouncedOnChange = debounce(handleChange, 500);

  useEffect(() => {
    return () => {
      debouncedOnChange.cancel();
    };
  }, [debouncedOnChange]);

  return (
    <div className={styles["input-wrapper"]}>
      <input
        ref={ref}
        placeholder="Поиск товара..."
        className={cn(styles["input"], className, {
          [styles["invalid"]]: !isValid,
        })}
        {...props}
        // value={searchText}
        onChange={debouncedOnChange}
      />
      <img className={styles["icon"]} src="/search.svg" alt="search" />
    </div>
  );
});

export default Search;
