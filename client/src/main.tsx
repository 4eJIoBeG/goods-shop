import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import Error from "./pages/Error/Error.tsx";
import Register from "./pages/Register/Register.tsx";
import Login from "./pages/Login/Login.tsx";
import { Layout } from "./layout/Menu/Layout.tsx";
import Success from "./pages/Success/Success.tsx";
import Shop from "./pages/Shop/Shop.tsx";
import Basket from "./pages/Basket/Basket.tsx";
import RequireAuth from "./helpers/RequireAuth.tsx";
import Admin from "./pages/Admin/Admin.tsx";
import {
  ADMIN_ROUTE,
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
import { Provider } from "react-redux";
import { store } from "./store/store.ts";
import ProfilePage from "./pages/ProfilePage/ProfilePage.tsx";
import RequireAdminAuth from "./helpers/RequireAdminAuth.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Navigate to="/items" replace />,
      },
    ],
  },
  {
    path: SHOP_ROUTE,
    element: <Layout />,
    children: [
      {
        path: SHOP_ROUTE,
        element: <Shop />,
      },
      {
        path: `${SHOP_ROUTE}${ITEM_ROUTE}/:id`,
        element: <ItemPage />,
        errorElement: <Error />,
        loader: async ({ params }) => {
          const { data } = await axios.get(
            `${import.meta.env.VITE_API_URL}/item/${params.id}`,
          );
          return data;
        },
      },
      {
        path: `${SHOP_ROUTE}${CATEGORY_ROUTE}/:categoryId`,
        element: <Shop />,
        errorElement: <Error />,
      },
    ],
  },
  {
    path: ADMIN_ROUTE,
    element: (
      <RequireAdminAuth>
        <Layout />
      </RequireAdminAuth>
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
    ],
  },
  {
    path: SUCCESS_ROUTE,
    element: (
      <RequireAuth>
        <Layout />
      </RequireAuth>
    ),
    children: [
      {
        path: SUCCESS_ROUTE,
        element: <Success />,
      },
    ],
  },
  {
    path: LOGIN_ROUTE,
    element: <Layout />,
    children: [
      {
        path: LOGIN_ROUTE,
        element: <Login />,
      },
    ],
  },
  {
    path: REGISTRATION_ROUTE,
    element: (
      <RequireAdminAuth>
        <Layout />
      </RequireAdminAuth>
    ),
    children: [
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
