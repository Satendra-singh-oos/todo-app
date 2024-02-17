import { configureStore } from "@reduxjs/toolkit";
import authSliceReducer from "../features/auth/authSlice";
import todoSliceReducer from "../features/todo/todoSlice";

const store = configureStore({
  reducer: {
    auth: authSliceReducer,
    todo: todoSliceReducer,
  },
});

export default store;
