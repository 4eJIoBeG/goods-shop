import styles from "./Button.module.css";

import { ButtonProps } from "./Button.props";
import cn from "classnames";

const Button = ({
  children,
  className,
  appearence = "small",
  disabled = false,
  ...props
}: ButtonProps) => {
  return (
    <button
      className={cn(styles["button"], styles["accent"], className, {
        [styles["small"]]: appearence === "small",
        [styles["big"]]: appearence === "big",
        disabled: disabled,
      })}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
