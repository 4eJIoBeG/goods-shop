import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Error from "./pages/Error/Error.tsx";
import Register from "./pages/Register/Register.tsx";
import Login from "./pages/Login/Login.tsx";
import AuthLayout from "./layout/Auth/Auth.layout.tsx";
import { Layout } from "./layout/Menu/Layout.tsx";
import Success from "./pages/Success/Success.tsx";
import Shop from "./pages/Shop/Shop.tsx";
import Basket from "./pages/Basket/Basket.tsx";
import RequireAuth from "./helpers/RequireAuth.tsx";
import Admin from "./pages/Admin/Admin.tsx";
import {
  ADMIN_ROUTE,
  AUTH_ROUTE,
  BASKET_ROUTE,
  LOGIN_ROUTE,
  REGISTRATION_ROUTE,
  SHOP_ROUTE,
  SUCCESS_ROUTE,
} from "./utils/consts.ts";

const router = createBrowserRouter([
  {
    path: SHOP_ROUTE,
    element: <Layout />,
    children: [
      {
        path: SHOP_ROUTE,
        element: <Shop />,
      },
    ],
  },
  {
    path: ADMIN_ROUTE,
    element: (
      <RequireAuth>
        <Layout />
      </RequireAuth>
    ),
    children: [
      {
        path: ADMIN_ROUTE,
        element: <Admin />,
      },
    ],
  },
  {
    path: BASKET_ROUTE,
    element: (
      <RequireAuth>
        <Layout />
      </RequireAuth>
    ),
    children: [
      {
        path: BASKET_ROUTE,
        element: <Basket />,
      },
      {
        path: SUCCESS_ROUTE,
        element: <Success />,
      },
    ],
  },
  {
    path: AUTH_ROUTE,
    element: <AuthLayout />,
    children: [
      {
        path: LOGIN_ROUTE,
        element: <Login />,
      },
      {
        path: REGISTRATION_ROUTE,
        element: <Register />,
      },
    ],
  },

  {
    path: "*",
    element: <Layout />,
    children: [
      {
        path: "*",
        element: <Error />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
