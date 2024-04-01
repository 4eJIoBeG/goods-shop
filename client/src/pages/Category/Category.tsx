import { useLoaderData } from "react-router-dom";
import BackButton from "../../components/BackButton";
import { Category } from "../../interfaces/category.interface";

const Category = () => {
  const data = useLoaderData() as Category;

  return (
    <div>
      <BackButton />
      <div>{data.name}</div>
    </div>
  );
};

export default Category;
