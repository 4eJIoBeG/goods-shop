import { useLoaderData } from "react-router-dom";
import BackButton from "../../components/BackButton";
import { Category } from "./Category.props";

const Category = () => {
  const data = useLoaderData() as Category;
  console.log(data);

  return (
    <div>
      <BackButton />
      <div>{data.name}</div>
    </div>
  );
};

export default Category;
