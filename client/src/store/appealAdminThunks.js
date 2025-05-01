import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "./axiosInstance";

// Получить все обращения
export const fetchAllAppeals = createAsyncThunk(
  "adminAppeals/fetchAll",
  async (_, thunkAPI) => {
    try {
      const response = await axiosInstance.get("/appeal/admin/get-apeeals");
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Ошибка при загрузке обращений");
    }
  }
);

// Ответить на обращение
export const replyToAppeal = createAsyncThunk(
  "adminAppeals/reply",
  async ({ appealId, description  }, thunkAPI) => {
    try {
      const response = await axiosInstance.post(`/appeal/admin/reply/${appealId}`, {
        description,
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);
