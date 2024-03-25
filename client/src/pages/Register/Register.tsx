import { Link, useNavigate } from "react-router-dom";
import Button from "../../components/Button/Button";
import Header from "../../components/Header/Header";
import Input from "../../components/Input/Input";
import styles from "./Register.module.css";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { registration, userActions } from "../../store/user.slice";
import { FormEvent } from "react";

export type RegisterForm = {
  email: { value: string };
  password: { value: string };
  name: { value: string };
  phone: { value: string };
};

const Register = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { registrationErrorMessage } = useSelector(
    (state: RootState) => state.user,
  );

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    dispatch(userActions.clearRegistrationErrorMessage());
    const target = event.target as typeof event.target & RegisterForm;
    const { email, password, name, phone } = target;
    await register(email.value, password.value, name.value, phone.value);
    navigate("/auth/login");
  };

  const register = async (
    email: string,
    password: string,
    name: string,
    phone: string,
  ) => {
    dispatch(registration({ email, password, name, phone }));
  };

  return (
    <div className={styles["register"]}>
      <Header>Регистрация</Header>
      {registrationErrorMessage && (
        <div className={styles["error"]}>{registrationErrorMessage}</div>
      )}
      <form className={styles["form"]} onSubmit={submit}>
        <div className={styles["field"]}>
          <label htmlFor="email">Ваш Еmail</label>
          <Input id="email" type="email" name="email" placeholder="Email" />
        </div>
        <div className={styles["field"]}>
          <label htmlFor="password">Ваш пароль</label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="Password"
          />
        </div>
        <div className={styles["field"]}>
          <label htmlFor="name">Ваше имя</label>
          <Input id="name" name="name" placeholder="Имя" />
        </div>
        <div className={styles["field"]}>
          <label htmlFor="name">Ваш телефон</label>
          <Input id="phone" name="phone" placeholder="Номер телефона" />
        </div>
        <Button appearence="big">Зарегистрироваться</Button>
      </form>

      <div className={styles["links"]}>
        <div>Есть аккаунт?</div>
        <Link to="/auth/login">Войти</Link>
      </div>
    </div>
  );
};

export default Register;
