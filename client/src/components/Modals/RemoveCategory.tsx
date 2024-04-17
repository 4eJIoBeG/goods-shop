import Modal from "react-bootstrap/Modal";
import {
  Form,
  Button,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "react-bootstrap";
import { useEffect, useState } from "react";
import { removeCategory } from "../../store/item.slice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { Category } from "../../interfaces/category.interface";
import axios, { AxiosError } from "axios";

interface Props {
  show: boolean;
  onHide: () => void;
}

const RemoveCategory = ({ show, onHide }: Props) => {
  const [category, setCategory] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );
  const dispatch = useDispatch<AppDispatch>();
  const token = useSelector((state: RootState) => state.user.token) as string;

  const handleDeleteClick = async () => {
    const confirmDelete = window.confirm(
      "Вы уверены, что хотите удалить эту категорию?",
    );
    if (confirmDelete) {
      try {
        if (token && selectedCategory) {
          await dispatch(removeCategory({ id: selectedCategory?.id, token }));
          setSelectedCategory(null);
          onHide();
          console.log("Категория удалена");
          getCategory();
        } else {
          console.error("Ошибка: токен отсутствует.");
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      // Пользователь отменил удаление
      console.log("Удаление отменено");
    }
  };

  useEffect(() => {
    getCategory();
  }, []);

  const getCategory = async () => {
    try {
      const { data } = await axios.get<Category[]>(
        `${import.meta.env.VITE_API_URL}/category`,
      );
      setCategory(data);
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log(error.message);
      }
      console.log(error);
    }
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Удалить категорию
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Dropdown className="mt-3">
            <DropdownToggle>
              {selectedCategory?.name || "Выберите категорию"}
            </DropdownToggle>
            <DropdownMenu>
              {category.map((cat) => (
                <DropdownItem
                  onClick={() => setSelectedCategory(cat)}
                  key={cat.id}
                >
                  {cat.name}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={onHide}>
          Закрыть
        </Button>
        <Button variant="success" onClick={handleDeleteClick}>
          Удалить
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default RemoveCategory;
