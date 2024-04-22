import { Link, useNavigate } from "react-router-dom";
import Button from "../../components/Button/Button";
import Header from "../../components/Header/Header";
import Input from "../../components/Input/Input";
import styles from "./Login.module.css";
import { FormEvent, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { login, userActions } from "../../store/user.slice";

export type LoginForm = {
  email: { value: string };
  password: { value: string };
};

const Login = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { token, loginErrorMessage } = useSelector(
    (state: RootState) => state.user,
  );

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token, navigate]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    dispatch(userActions.clearLoginErrorMessage());
    const target = event.target as typeof event.target & LoginForm;
    const { email, password } = target;
    await sendLogin(email.value, password.value);
  };

  const sendLogin = async (email: string, password: string) => {
    dispatch(login({ email, password }));
  };

  return (
    <div className={styles["login"]}>
      <Header>Вход</Header>
      {loginErrorMessage && (
        <div className={styles["error"]}>{loginErrorMessage}</div>
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
        <Button appearence="big">Войти</Button>
      </form>

      <div className={styles["links"]}>
        <div>Нет аккаунта?</div>
        <Link to="https://t.me/greendie1">Обратитесь к администратору</Link>
      </div>
    </div>
  );
};

export default Login;
