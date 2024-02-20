import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../helpers/axiosInstance";

const initialState = {
  loading: false,
  status: false,
  todoData: null,
  completed: false,
};

interface todoData {
  title: string;
  description: string;
  completed: Boolean;
}

// interface updateTodoData {
//   todoId: string;
//   title: string;
//   description: string;
//   completed: Boolean;
// }

export const addTodo = createAsyncThunk("addTodo", async (data: todoData) => {
  try {
    const response = await axiosInstance.post("/todos/addTodo", data);
    alert("Your Todo Added Succesfuly");
    return response.data;
  } catch (error: any) {
    alert(error?.response?.data?.error);
    throw error;
  }
});

export const updateTodo = createAsyncThunk(
  "updateTodo",
  async ({ todoId, data }: any) => {
    try {
      const response = await axiosInstance.patch(
        `/todos/updateTodo?id=${todoId}`,
        data
      );
      alert("Updated Todo Succesfuly");

      return response.data;
    } catch (error: any) {
      alert(error?.response?.data?.error);
      throw error;
    }
  }
);

export const getTodoById = createAsyncThunk(
  "getTodoById",
  async (todoId: any) => {
    try {
      const response = await axiosInstance.get(
        `/todos/getTodoById?id=${todoId}`
      );
      alert("Fetch Your Todo by Id");
      return response.data;
    } catch (error: any) {
      alert(error?.response?.data?.error);
      throw error;
    }
  }
);

export const getAllTodo = createAsyncThunk("getAllTodo", async () => {
  try {
    const response = await axiosInstance.get("/todos/getAllTodo");
    return response.data.data;
  } catch (error: any) {
    alert(error?.response?.data?.error);
    throw error;
  }
});

export const deleteTodo = createAsyncThunk("deleteTodo", async (todoId) => {
  try {
    const response = await axiosInstance.delete(
      `/todos/delteTodo?id=${todoId}`
    );
    alert(response.data.message);
    return response.data.data;
  } catch (error: any) {
    alert(error?.response?.data?.error);
    throw error;
  }
});

export const toggleTodo = createAsyncThunk("toggleTodo", async (todoId) => {
  try {
    const response = await axiosInstance.patch(
      `/todos/toggleTodo?id=${todoId}`
    );
    alert(response.data.message);
    return response.data.data;
  } catch (error: any) {
    alert(error?.response?.data?.error);
    throw error;
  }
});

const todoSlice = createSlice({
  name: "todo",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(addTodo.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(addTodo.fulfilled, (state, action) => {
      state.loading = false;
      state.status = true;
      state.todoData = action.payload;
    });

    builder.addCase(updateTodo.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateTodo.fulfilled, (state, action) => {
      state.loading = false;
      state.status = true;
      state.todoData = action.payload;
    });

    builder.addCase(getTodoById.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getTodoById.fulfilled, (state, action) => {
      state.loading = false;
      state.status = true;
      state.todoData = action.payload;
    });

    builder.addCase(getAllTodo.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(getAllTodo.fulfilled, (state, action) => {
      state.loading = false;
      state.status = true;
      state.todoData = action.payload;
    });

    builder.addCase(toggleTodo.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(toggleTodo.fulfilled, (state) => {
      state.loading = false;
      state.completed = !state.completed;
    });

    builder.addCase(deleteTodo.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(deleteTodo.fulfilled, (state) => {
      state.loading = false;
    });
  },
});

export default todoSlice.reducer;
