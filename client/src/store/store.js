import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import userReducer from "./userSlice";
import userTreesReducer from "./userTreesSlice"
import treeReducer from "./trees/treeSlice";

import userAppealsReducer from "./userAppealsSlice"
import appealReducer from "./appealSlice"

import adminAppealsReducer from "./adminAppealsSlice";

import { jwtDecode as jwt_decode } from "jwt-decode";

// начальное состояние из localStorage
const token = localStorage.getItem("token");
let user = null;

if (token) {
  try {
    const decoded = jwt_decode(token);
    user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };
  } catch (err) {
    localStorage.removeItem("token"); // если токен невалиден
  }
}

const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    userTrees: userTreesReducer,
    trees: treeReducer,

    userAppeals: userAppealsReducer,
    appeals: appealReducer,
    adminAppeals: adminAppealsReducer,

  },
  preloadedState: {
    auth: {
      user: user,
      token: token,
      status: "idle",
      error: null,
    },
  },
});

export default store;
