import { useNavigate } from "react-router-dom";
import Button from "../../components/Button/Button";
import styles from "./Error.module.css";

const Error = () => {
  const navigate = useNavigate();
  return (
    <div className={styles["message"]}>
      <img src="/success.png" alt="" />
      <div className={styles["text"]}>Ошибка 404! Товар не существует.</div>
      <Button appearence="big" onClick={() => navigate("/")}>
        На главную
      </Button>
    </div>
  );
};

export default Error;
