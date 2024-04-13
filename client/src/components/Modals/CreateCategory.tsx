import Modal from "react-bootstrap/Modal";
import { Form, Button } from "react-bootstrap";
import { useState } from "react";
import { addCategory } from "../../store/item.slice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { AxiosError } from "axios";

interface Props {
  show: boolean;
  onHide: () => void;
}

const CreateCategory = ({ show, onHide }: Props) => {
  const [categoryName, setCategoryName] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const token = useSelector((state: RootState) => state.user.token) as string;

  const addNewCategory = () => {
    if (!categoryName) {
      alert("Пожалуйста, введите название категории");
      return;
    }

    try {
      dispatch(addCategory({ categoryName, token }));
      console.log("Item created.");
    } catch (error) {
      if (error instanceof AxiosError) {
        setError(error.message);
      }
      console.error("Ошибка при добавлении категории", error);
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
          Добавить категорию
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Control
            value={categoryName}
            onChange={(event) => setCategoryName(event.target.value)}
            placeholder="Введите название категории"
          />
          {error && "Ошибка добавления"}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={onHide}>
          Закрыть
        </Button>
        <Button variant="success" onClick={addNewCategory}>
          Добавить
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CreateCategory;
