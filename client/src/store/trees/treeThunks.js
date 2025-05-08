import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import axiosInstance from "../axiosInstance";

export const fetchTrees = createAsyncThunk(
  "admin/trees",
  async (_, thunkAPI) => {
    const token = localStorage.getItem("token");
    const res = await axios.get("http://localhost:8080/api/tree/trees", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  }
);

export const fetchTreeById = createAsyncThunk(
  "trees/fetchById",
  async (id, thunkAPI) => {
    const res = await axiosInstance.get(`/tree/admin/tree/${id}`);
    return res.data;
  }
);

export const updateTreeById = createAsyncThunk(
  "trees/update",
  async ({ id, data }, thunkAPI) => {
    try {
      const res = await axiosInstance.put(`/tree/admin/tree/${id}`, data);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const fetchConditions = createAsyncThunk(
  "trees/fetchConditions",
  async (_, thunkAPI) => {
    try {
      const res = await axiosInstance.get("/tree/get-conditions");
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const fetchEnvironments = createAsyncThunk(
  "trees/fetchEnvironments",
  async (_, thunkAPI) => {
    try {
      const res = await axios.get("http://localhost:8080/api/tree/get-envs");
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const fetchSpecialNotes = createAsyncThunk(
  "trees/fetchSpecialNotes",
  async (_, thunkAPI) => {
    try {
      const res = await axios.get("http://localhost:8080/api/tree/get-notes");
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);
export const fetchStatuses = createAsyncThunk(
  "trees/fetchStatuses",
  async (_, thunkAPI) => {
    try {
      const res = await axiosInstance.get("/tree/get-statuses");
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const createTree = createAsyncThunk(
  "trees/create",
  async (formValues, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");

      const formData = new FormData();

      formData.append("type", formValues.type.name); // тип дерева
      formData.append("statusId", formValues.statusId); // id статуса
      formData.append("specialNoteId", formValues.specialNoteId); // id особой пометки
      formData.append("envId", formValues.environmentId); // id окружения
      formData.append("conditionId", formValues.conditionId); // id состояния

      formData.append("latitude", formValues.latitude || 0);
      formData.append("longitude", formValues.longitude || 0);
      formData.append("adress", formValues.adress || "");
      formData.append("owner", formValues.owner || "");
      formData.append("year", formValues.year_of_planting.year()); // dayjs объект
      formData.append("height", formValues.height || 0);
      formData.append("diameter", formValues.diameter || 0);
      formData.append("number_of_barrels", formValues.number_of_barrels || 1);
      formData.append("crown_diameter", formValues.crown_diameter || 0);

      // Фото 

      if (formValues.photo && formValues.photo.length > 0) {
        formValues.photo.forEach((fileObj) => {
          formData.append("photo", fileObj.originFileObj);
        });
      }
      // if (formValues.photo && formValues.photo.length > 0) {
      //   formData.append("photo", formValues.photo[0].originFileObj);
      // }
      // // Документ 
      if (formValues.document && formValues.document.length > 0) {
        formValues.document.forEach((fileObj) => {
          formData.append("document", fileObj.originFileObj);
        });
      }
      // if (formValues.document && formValues.document.length > 0) {
      //   formData.append("document", formValues.document[0].originFileObj);
      // }

      for (let [key, val] of formData.entries()) {
        if (val instanceof File) {
          console.log(`${key}: ${val.name} (${val.type}, ${val.size} bytes)`);
        } else {
          console.log(`${key}: ${val}`);
        }
      }
      const res = await axiosInstance.post("/tree/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        // error
        error.response?.data || "Ошибка при добавлении дерева"
      );
    }
  }
);
