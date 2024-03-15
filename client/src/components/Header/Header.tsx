import cn from "classnames";
import styles from "./Header.module.css";
import { HeaderProps } from "./Headling.props";

const Header = ({ children, className, ...props }: HeaderProps) => {
  return (
    <h1 className={cn(className, styles["h1"])} {...props}>
      {children}
    </h1>
  );
};

export default Header;
