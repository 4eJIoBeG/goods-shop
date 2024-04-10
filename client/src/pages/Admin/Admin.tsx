import { useState } from "react";
import Button from "../../components/Button/Button";
import CreateCategory from "../../components/Modals/CreateCategory";
import CreateItem from "../../components/Modals/CreateItem";
import styles from "./Admin.module.css";

const Admin = () => {
  const [categoryVisible, setCategoryVisible] = useState(false);
  const [itemVisible, setItemVisible] = useState(false);
  return (
    <div className={styles["admin"]}>
      <h1>Панель администратора</h1>
      <Button onClick={() => setCategoryVisible(true)}>
        Добавить категорию
      </Button>
      <Button onClick={() => setItemVisible(true)}>Добавить товар</Button>

      <CreateCategory
        show={categoryVisible}
        onHide={() => setCategoryVisible(false)}
      />
      <CreateItem show={itemVisible} onHide={() => setItemVisible(false)} />
    </div>
  );
};

export default Admin;
