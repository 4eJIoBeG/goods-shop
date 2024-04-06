import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { BASE_URL_API } from "../helpers/API";
import { Product } from "../interfaces/product.interface";

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
        `${BASE_URL_API}/item?page=${page}&limit=${limit}&categoryId=${categoryId}`,
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
      `${BASE_URL_API}/item?page=${page}&limit=${limit}`,
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
  },
});

export default itemSlice.reducer;
export const itemActions = itemSlice.actions;
