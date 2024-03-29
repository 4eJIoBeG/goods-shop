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
  CATEGORY_ROUTE,
  ITEM_ROUTE,
  LOGIN_ROUTE,
  PROFILE_ROUTE,
  REGISTRATION_ROUTE,
  SHOP_ROUTE,
  SUCCESS_ROUTE,
} from "./utils/consts.ts";
import ItemPage from "./pages/ItemPage/ItemPage.tsx";
import axios from "axios";
import { BASE_URL_API } from "./helpers/API.ts";
import Category from "./pages/Category/Category.tsx";
import { Provider } from "react-redux";
import { store } from "./store/store.ts";
import ProfilePage from "./pages/ProfilePage/ProfilePage.tsx";

const router = createBrowserRouter([
  {
    path: SHOP_ROUTE,
    element: <Layout />,
    children: [
      {
        path: SHOP_ROUTE,
        element: <Shop />,
      },
      {
        path: ITEM_ROUTE,
        element: <ItemPage />,
        errorElement: <Error />,
        loader: async ({ params }) => {
          const { data } = await axios.get(`${BASE_URL_API}/item/${params.id}`);
          return data;
        },
      },
      {
        path: CATEGORY_ROUTE,
        element: <Category />,
        errorElement: <Error />,
        loader: async ({ params }) => {
          const { data } = await axios.get(
            `${BASE_URL_API}/category/${params.id}`,
          );
          return data;
        },
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
    path: PROFILE_ROUTE,
    element: (
      <RequireAuth>
        <Layout />
      </RequireAuth>
    ),
    children: [
      {
        path: PROFILE_ROUTE,
        element: <ProfilePage />,
      },
    ],
  },
  {
    path: BASKET_ROUTE,
    element: <Layout />,
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
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>,
);
