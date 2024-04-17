import { useState } from "react";
import Button from "../../components/Button/Button";
import CreateCategory from "../../components/Modals/CreateCategory";
import CreateItem from "../../components/Modals/CreateItem";
import styles from "./Admin.module.css";
import RemoveCategory from "../../components/Modals/RemoveCategory";

const Admin = () => {
  const [categoryVisible, setCategoryVisible] = useState(false);
  const [categoryRemoveVisible, setRemoveCategoryVisible] = useState(false);
  const [itemVisible, setItemVisible] = useState(false);
  return (
    <div className={styles["admin"]}>
      <h1>Панель администратора</h1>
      <div className={styles["buttons"]}>
        <Button
          onClick={() => setCategoryVisible(true)}
          className={styles["add-category"]}
        >
          Добавить категорию
        </Button>
        <Button
          onClick={() => setRemoveCategoryVisible(true)}
          className={styles["remove-category"]}
        >
          Удалить категорию
        </Button>
        <Button
          onClick={() => setItemVisible(true)}
          className={styles["add-item"]}
        >
          Добавить товар
        </Button>
      </div>

      <CreateCategory
        show={categoryVisible}
        onHide={() => setCategoryVisible(false)}
      />
      <RemoveCategory
        show={categoryRemoveVisible}
        onHide={() => setRemoveCategoryVisible(false)}
      />
      <CreateItem show={itemVisible} onHide={() => setItemVisible(false)} />
    </div>
  );
};

export default Admin;
