import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../axiosInstance";

// Создать статус
export const createStatus = createAsyncThunk(
  "trees/createStatus",
  async (status_name, thunkAPI) => {
    try {
      const response = await axiosInstance.post("tree/new-status", {
        status_name,
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// Создать пометку
export const createSpecialNote = createAsyncThunk(
  "create/createNote",
  async (note, thunkAPI) => {
    try {
      const response = await axiosInstance.post("tree/new-note", { note });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// Создать среду
export const createEnv = createAsyncThunk(
  "create/createEnv",
  async (name, thunkAPI) => {
    try {
      const response = await axiosInstance.post("tree/new-env", { name });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// Создать состояние
export const createCondition = createAsyncThunk(
  "create/createCondition",
  async (name, thunkAPI) => {
    try {
      const response = await axiosInstance.post("tree/new-condition", { name });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// удалить особую пометку
export const deleteNote = createAsyncThunk(
  "trees/deleteStatus",
  async (id, thunkAPI) => {
    try {
      await axiosInstance.delete(`/tree/admin/note/${id}`);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// удалить среду
export const deleteEnv = createAsyncThunk(
  "trees/deleteStatus",
  async (id, thunkAPI) => {
    try {
      await axiosInstance.delete(`/tree/admin/env/${id}`);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// удалить состояние
export const deleteCondition = createAsyncThunk(
  "trees/deleteStatus",
  async (id, thunkAPI) => {
    try {
      await axiosInstance.delete(`/tree/admin/condition/${id}`);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// удалить статус
export const deleteStatus = createAsyncThunk(
  "trees/deleteStatus",
  async (id, thunkAPI) => {
    try {
      await axiosInstance.delete(`/tree/admin/status/${id}`);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const updateNote = createAsyncThunk(
  "trees/updateNote",
  async ({ id, note }, thunkAPI) => {
    try {
     const response =  await axiosInstance.put(`/tree/note/update/${id}`, { note });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const updateEnv = createAsyncThunk(
  "trees/updateEnv",
  async ({ id, name }, thunkAPI) => {
    try {
     const response =  await axiosInstance.put(`/tree/env/update/${id}`, { name });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "Ошибка при обновлении среды");
    }
  }
);

export const updateCondition = createAsyncThunk(
  "trees/updateCondition",
  async ({ id, name }, thunkAPI) => {
    try {
     const response =  await axiosInstance.put(`/tree/condition/update/${id}`, { name });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "Ошибка при обновлении состояния");
    }
  }
);

export const updateStatus = createAsyncThunk(
  "trees/updateStatus",
  async ({ id, name }, thunkAPI) => {
    try {
     const response =  await axiosInstance.put(`/tree/status/update/${id}`, { name });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "Ошибка при обновлении статуса");
    }
  }
);

