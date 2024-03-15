import { forwardRef } from "react";
import styles from "./Search.module.css";
import cn from "classnames";
import { SearchProps } from "./Search.props";

const Search = forwardRef<HTMLInputElement, SearchProps>(function Input(
  { className, isValid = true, ...props },
  ref,
) {
  return (
    <div className={styles["input-wrapper"]}>
      <input
        ref={ref}
        placeholder="Ввведите блюдо или состав..."
        className={cn(styles["input"], className, {
          [styles["invalid"]]: !isValid,
        })}
        {...props}
      />
      <img className={styles["icon"]} src="/search.svg" alt="search" />
    </div>
  );
});

export default Search;
