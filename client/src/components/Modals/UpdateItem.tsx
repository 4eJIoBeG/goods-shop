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
import { ICategory } from "../../interfaces/category.interface";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getItem, updateItem } from "../../store/item.slice";
import { AppDispatch, RootState } from "../../store/store";
import { Info } from "../../interfaces/product.interface";
import { useLoaderData } from "react-router-dom";
import { ProductCardProps } from "../ProductCard/ProductCard.props";

interface Props {
  show: boolean;
  onHide: () => void;
}

const UpdateItem = ({ show, onHide }: Props) => {
  const { id } = useLoaderData() as ProductCardProps;
  const itemData = useSelector((state: RootState) => state.item.currentItem);

  const dispatch = useDispatch<AppDispatch>();
  const [category, setCategory] = useState<ICategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(
    null,
  );
  const [info, setInfo] = useState<Info[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [price, setPrice] = useState<number>(0);
  const [percent, setPercent] = useState<number>(0);
  const [code, setCode] = useState<number | string>("");
  const [quantity, setQuantity] = useState<number | string>(0);
  const [name, setName] = useState<string>("");
  const token = useSelector((state: RootState) => state.user.token) as string;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string>("");

  const calculateTotalPrice = (price: number, percent: number) => {
    const percentageAmount = (price / 100) * percent;
    return Math.ceil(price + percentageAmount);
  };

  const getCategory = async () => {
    try {
      const { data } = await axios.get<ICategory[]>(
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

  const addInfo = () => {
    setInfo([...info, { title: "", description: "", id: Date.now() }]);
  };

  const removeInfo = (id: number) => {
    setInfo(info.filter((item) => item.id !== id));
  };

  const changeInfo = (key: string, value: string, id: number) => {
    setInfo(
      info.map((item) => (item.id === id ? { ...item, [key]: value } : item)),
    );
  };

  const selectFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFile(event.target.files?.[0] ?? null);
  };

  const updItem = () => {
    setIsLoading(true);

    const formData = new FormData();

    if (name !== itemData?.name) {
      formData.append("name", name);
    }

    if (calculateTotalPrice(price, percent) !== itemData?.price) {
      formData.append("price", `${calculateTotalPrice(price, percent)}`);
    }

    if (selectedCategory?.id !== itemData?.categoryId) {
      formData.append("categoryId", `${selectedCategory?.id}`);
    }

    if (quantity !== itemData?.quantity) {
      formData.append("quantity", `${quantity}`);
    }

    if (code !== itemData?.code) {
      formData.append("code", `${code}`);
    }

    if (file) {
      formData.append("img", file);
    }

    if (JSON.stringify(info) !== JSON.stringify(itemData?.info)) {
      formData.append("info", JSON.stringify(info));
    }

    try {
      dispatch(updateItem({ id, formData, token })).unwrap();
      console.log("Item updated.");
      setMessage("Товар успешно обновлен!");
      setPercent(0);
      dispatch(getItem(id));
      onHide();
    } catch (error) {
      if (error instanceof AxiosError) {
        setError(error.message);
      }
      console.error("Ошибка при обновлении товара", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getCategory();
    dispatch(getItem(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (itemData && category.length > 0) {
      const foundCategory = category.find(
        (cat) => cat.id === itemData.categoryId,
      );
      setSelectedCategory(foundCategory || null);
      setName(itemData.name);
      setCode(itemData.code);
      setPrice(Number(itemData.price) || 0);
      setQuantity(itemData.quantity || 0);
      setInfo(itemData.info || []);
    }
  }, [itemData, category]);

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
            placeholder="Введите новое название товара"
          />
          <FormControl
            value={code}
            onChange={(event) => setCode(event.target.value)}
            className="mt-3"
            placeholder="Введите новый код товара"
          />
          <Row className="mt-3">
            <Col md={8}>
              <FormControl
                value={price}
                onChange={(event) => setPrice(Number(event.target.value))}
                className="mt-3"
                placeholder="Введите стоимость товара"
                type="number"
                min={1}
              />
            </Col>
            <Col md={4}>
              <FormControl
                value={percent}
                onChange={(event) => setPercent(Number(event.target.value))}
                className="mt-3"
                placeholder="Введите процент товара"
                type="number"
                min={1}
              />
            </Col>
          </Row>
          <FormControl
            value={quantity}
            onChange={(event) => setQuantity(Number(event.target.value))}
            className="mt-3"
            placeholder="Введите новое количество товара"
            type="number"
            min={1}
          />
          количество товара
          <FormControl className="mt-3" type="file" onChange={selectFile} />
          <hr />
          <Button variant="success" onClick={addInfo}>
            Добавить характеристику
          </Button>
          {info.map((item) => (
            <Row key={item.id} className="mt-3">
              <Col md={4}>
                <FormControl
                  value={item.title}
                  onChange={(event) =>
                    changeInfo("title", event.target.value, item.id)
                  }
                  placeholder="Название"
                />
              </Col>
              <Col md={4}>
                <FormControl
                  value={item.description}
                  onChange={(event) =>
                    changeInfo("description", event.target.value, item.id)
                  }
                  placeholder="Описание"
                />
              </Col>
              <Col md={4}>
                <Button variant="danger" onClick={() => removeInfo(item.id)}>
                  Удалить
                </Button>
              </Col>
            </Row>
          ))}
        </Form>
      </Modal.Body>
      {isLoading && "Обрабатываем запрос..."}
      {error && "Произошла ошибка!"}
      {message}
      <Modal.Footer>
        <Button variant="danger" onClick={onHide}>
          Закрыть
        </Button>
        <Button variant="success" onClick={updItem}>
          Обновить
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UpdateItem;
