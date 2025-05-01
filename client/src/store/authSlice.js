import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { jwtDecode as jwt_decode } from "jwt-decode";

export const signup = createAsyncThunk(
  "auth/signup",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/user/signup",
        userData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const signin = createAsyncThunk(
  "auth/signin",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/user/signin",
        userData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const tokenFromStorage = localStorage.getItem("token");
let decodedUser = null;
let isInitializedFromStart = false;


if (tokenFromStorage) {
  try {
    const decoded = jwt_decode(tokenFromStorage);
    decodedUser = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };
    isInitializedFromStart = true; 
  } catch (error) {
    localStorage.removeItem("token")
  }
}

const initialState = {
  user: decodedUser,
  token: tokenFromStorage,
  isAuthenticated: !!tokenFromStorage && !!decodedUser,
  isInitialized: isInitializedFromStart, 
  status: "idle",
  error: null,
  successMessage: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isInitialized = true;
      localStorage.removeItem("token"); //очищаем localStorage
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signup.fulfilled, (state, action) => {
        // state.user = action.payload;
        state.user = null;
        // state.token = action.payload.token;
        state.token = null;
        state.status = "succeeded";
        state.successMessage = action.payload.message;
      })
      .addCase(signup.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload.message;
      })
      .addCase(signin.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(signin.fulfilled, (state, action) => {
        const decode = jwt_decode(action.payload.token);
        state.status = "succeeded";
        state.token = action.payload.token;
        state.user = {
          id: decode.id,
          email: decode.email,
          role: decode.role,
        };
        //сохраняем токен в localStorage
        localStorage.setItem("token", action.payload.token);
        state.isAuthenticated = true;
        state.isInitialized = true;
      })
      .addCase(signin.rejected, (state, action) => {
        state.status = "faild";
        state.token = action.payload?.message || "Ошибка входа";
        state.isAuthenticated = false;
        state.isInitialized = true;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
