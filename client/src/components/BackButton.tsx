import { useNavigate } from "react-router-dom";
import Button from "./Button/Button";

const BackButton = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (navigate) {
      navigate(-1);
    }
    navigate("/");
  };

  return <Button onClick={handleClick}>Назад</Button>;
};

export default BackButton;
