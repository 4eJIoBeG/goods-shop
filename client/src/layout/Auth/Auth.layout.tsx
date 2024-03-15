import { Outlet } from "react-router-dom";
import styles from "./AuthLayout.module.css";

const AuthLayout = () => {
  return (
    <div className={styles["layout"]}>
      <div className={styles["logo"]}>
        <span>SCP Foundation Admin</span>
        <img src="/scp.png" alt="scp-logo" />
        <span>Secure. Contain. Protect.</span>
      </div>
      <div className={styles["content"]}>
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
