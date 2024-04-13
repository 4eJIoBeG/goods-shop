import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { Product } from "../interfaces/product.interface";
import { RootState } from "./store";
import { ProductCardProps } from "../components/ProductCard/ProductCard.props";

export interface ItemState {
  items: { rows: Product[]; count: number };
  isLoading: boolean;
  error: string | null;
  searchReq: string | "";
}

const initialState: ItemState = {
  items: { rows: [], count: 0 },
  isLoading: false,
  error: null,
  searchReq: "",
};

export const getAllInCategory = createAsyncThunk<
  { rows: Product[]; count: number },
  { page: number; limit: number; categoryId: number },
  { rejectValue: string }
>(
  "item/getAllInCategory",
  async ({ page, limit, categoryId }, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(
        `${
          import.meta.env.VITE_API_URL
        }/item?page=${page}&limit=${limit}&categoryId=${categoryId}`,
      );
      return { rows: data.rows, count: data.count };
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(
          error.response?.data.message || "Произошла ошибка",
        );
      } else {
        return rejectWithValue("Произошла неизвестная ошибка");
      }
    }
  },
);

export const getAll = createAsyncThunk<
  { rows: Product[]; count: number },
  { page: number; limit: number },
  { rejectValue: string }
>("item/getAll", async ({ page, limit }, { rejectWithValue }) => {
  try {
    const { data } = await axios.get(
      `${import.meta.env.VITE_API_URL}/item?page=${page}&limit=${limit}`,
    );
    return { rows: data.rows, count: data.count };
  } catch (error) {
    if (error instanceof AxiosError) {
      return rejectWithValue(
        error.response?.data.message || "Произошла ошибка",
      );
    } else {
      return rejectWithValue("Произошла неизвестная ошибка");
    }
  }
});

export const createItem = createAsyncThunk<
  ProductCardProps,
  { formData: FormData; token: string },
  { state: RootState }
>("item/createItem", async (params: { formData: FormData; token: string }) => {
  const { formData, token } = params;
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    };

    const { data } = await axios.post(
      `${import.meta.env.VITE_API_URL}/item`,
      formData,
      config,
    );

    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data.message);
    } else {
      throw new Error("Неизвестная ошибка при добавлении товара");
    }
  }
});

export const fetchItemsBySearch = createAsyncThunk(
  "items/fetchBySearch",
  async (searchQuery: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/item/search?query=${searchQuery}`,
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(
          error.response?.data.message || "Произошла ошибка",
        );
      } else {
        return rejectWithValue("Произошла неизвестная ошибка");
      }
    }
  },
);

export const addCategory = createAsyncThunk(
  "items/addCategory",
  async (
    { categoryName, token }: { categoryName: string; token: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/category`,
        { name: categoryName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(
          error.response?.data.message || "Произошла ошибка",
        );
      } else {
        return rejectWithValue("Произошла неизвестная ошибка");
      }
    }
  },
);

export const itemSlice = createSlice({
  name: "item",
  initialState,
  reducers: {
    search: (state, action) => {
      state.searchReq = action.payload;
    },
    searchClear: (state) => {
      state.searchReq = "";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getAllInCategory.fulfilled, (state, action) => {
      if (!action.payload) {
        return;
      }
      state.items.rows = action.payload.rows;
      state.items.count = action.payload.count;
    });
    builder.addCase(getAll.fulfilled, (state, action) => {
      if (!action.payload) {
        return;
      }
      state.items.rows = action.payload.rows;
      state.items.count = action.payload.count;
    });
    builder.addCase(fetchItemsBySearch.fulfilled, (state, action) => {
      state.items = action.payload;
      state.isLoading = false;
    });
  },
});

export default itemSlice.reducer;
export const itemActions = itemSlice.actions;
