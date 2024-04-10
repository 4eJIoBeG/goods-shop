import Modal from "react-bootstrap/Modal";
import {
  Form,
  Button,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  FormControl,
  Row,
  Col,
} from "react-bootstrap";
import axios, { AxiosError } from "axios";
import { Category } from "../../interfaces/category.interface";
import { BASE_URL_API } from "../../helpers/API";
import { useEffect, useState } from "react";

const CreateItem = ({ show, onHide }) => {
  const [category, setCategory] = useState<Category[]>([]);
  const [info, setInfo] = useState([]);

  const getCategory = async () => {
    try {
      const { data } = await axios.get<Category[]>(`${BASE_URL_API}/category`);
      setCategory(data);
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log(error.message);
      }
      console.log(error);
    }
  };

  const addInfo = () => {
    setInfo([...info, { title: "", description: "", number: Date.now() }]);
  };
  const removeInfo = (number) => {
    setInfo(info.filter((item) => item.number !== number));
  };

  useEffect(() => {
    getCategory();
  }, []);

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
          Добавить товар
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Dropdown className="mt-3">
            <DropdownToggle>Выберите категорию</DropdownToggle>
            <DropdownMenu>
              {category.map((cat) => (
                <DropdownItem key={cat.id}>{cat.name}</DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
          <FormControl className="mt-3" placeholder="Введите название товара" />
          <FormControl
            className="mt-3"
            placeholder="Введите стоимость товара"
            type="number"
          />
          <FormControl
            className="mt-3"
            placeholder="Введите количество товара"
            type="number"
            min={1}
          />
          <FormControl className="mt-3" type="file" />
          <hr />
          <Button variant="success" onClick={addInfo}>
            Добавить характеристику
          </Button>
          {info.map((item) => (
            <Row key={item.number} className="mt-3">
              <Col md={4}>
                <FormControl placeholder="Название" />
              </Col>
              <Col md={4}>
                <FormControl placeholder="Описание" />
              </Col>
              <Col md={4}>
                <Button
                  variant="danger"
                  onClick={() => removeInfo(item.number)}
                >
                  Удалить
                </Button>
              </Col>
            </Row>
          ))}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={onHide}>
          Закрыть
        </Button>
        <Button variant="success">Добавить</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CreateItem;
