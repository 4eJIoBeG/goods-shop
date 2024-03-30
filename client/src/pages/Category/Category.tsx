import { useLoaderData } from "react-router-dom";
import BackButton from "../../components/BackButton";
import { Category } from "./Category.props";

const Category = () => {
  const data = useLoaderData() as Category;
  const [items, setItems] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | undefined>();

  const getItems = async () => {
    const params = {
      page: 1,
      limit: 50,
      category: categoryId,
    };
    try {
      const { data } = await axios.get<ApiResponse>(
        `${BASE_URL_API}/item?limit=${params.limit}&page=${params.page}&category=${params.category}`,
      );

      setItems(data.rows);
    } catch (error) {
      if (error instanceof AxiosError) {
        setError(error.message);
      }
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  console.log(data);

  return (
    <div>
      <BackButton />
      <div>{data.name}</div>
    </div>
  );
};

export default Category;
