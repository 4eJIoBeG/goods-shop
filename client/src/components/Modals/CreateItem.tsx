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
import { useDispatch, useSelector } from "react-redux";
import { createItem } from "../../store/item.slice";
import { AppDispatch, RootState } from "../../store/store";

interface Props {
  show: boolean;
  onHide: () => void;
}

const CreateItem = ({ show, onHide }: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const [category, setCategory] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );
  const [info, setInfo] = useState<
    { title: string; description: string; index: number }[]
  >([]);
  const [file, setFile] = useState<File | null>(null);
  const [price, setPrice] = useState<number | string>(0);
  const [code, setCode] = useState<number | string>("");
  const [quantity, setQuantity] = useState<number | string>(0);
  const [name, setName] = useState<string>("");
  const token = useSelector((state: RootState) => state.user.token) as string;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    setInfo([...info, { title: "", description: "", index: Date.now() }]);
  };

  const removeInfo = (index: number) => {
    setInfo(info.filter((item) => item.index !== index));
  };

  const changeInfo = (key: string, value: string, index: number) => {
    setInfo(
      info.map((item) =>
        item.index === index ? { ...item, [key]: value } : item,
      ),
    );
  };

  const selectFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFile(event.target.files?.[0] ?? null);
  };

  const addItem = () => {
    setIsLoading(true);
    if (!name || !price || !quantity || !file || !selectedCategory) {
      alert("Пожалуйста, заполните все поля.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", `${price}`);
    formData.append("categoryId", `${selectedCategory.id}`);
    formData.append("quantity", `${quantity}`);
    formData.append("code", `${code}`);
    formData.append("img", file);
    formData.append("info", JSON.stringify(info));

    try {
      dispatch(createItem({ formData, token }));
      console.log("Item created.");
    } catch (error) {
      if (error instanceof AxiosError) {
        setError(error.message);
      }
      console.error("Ошибка при добавлении товара", error);
    } finally {
      setIsLoading(false);
    }
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
          <FormControl
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="mt-3"
            placeholder="Введите название товара"
          />
          <FormControl
            value={code}
            onChange={(event) => setCode(event.target.value)}
            className="mt-3"
            placeholder="Введите название товара"
          />
          <FormControl
            value={price}
            onChange={(event) => setPrice(Number(event.target.value))}
            className="mt-3"
            placeholder="Введите стоимость товара"
            type="number"
          />
          <FormControl
            value={quantity}
            onChange={(event) => setQuantity(Number(event.target.value))}
            className="mt-3"
            placeholder="Введите количество товара"
            type="number"
            min={1}
          />
          <FormControl className="mt-3" type="file" onChange={selectFile} />
          <hr />
          <Button variant="success" onClick={addInfo}>
            Добавить характеристику
          </Button>
          {info.map((item) => (
            <Row key={item.index} className="mt-3">
              <Col md={4}>
                <FormControl
                  value={item.title}
                  onChange={(event) =>
                    changeInfo("title", event.target.value, item.index)
                  }
                  placeholder="Название"
                />
              </Col>
              <Col md={4}>
                <FormControl
                  value={item.description}
                  onChange={(event) =>
                    changeInfo("description", event.target.value, item.index)
                  }
                  placeholder="Описание"
                />
              </Col>
              <Col md={4}>
                <Button variant="danger" onClick={() => removeInfo(item.index)}>
                  Удалить
                </Button>
              </Col>
            </Row>
          ))}
        </Form>
      </Modal.Body>
      {isLoading && "Обрабатываем запрос..."}
      {error && "Произошла ошибка!"}
      <Modal.Footer>
        <Button variant="danger" onClick={onHide}>
          Закрыть
        </Button>
        <Button variant="success" onClick={addItem}>
          Добавить
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CreateItem;
