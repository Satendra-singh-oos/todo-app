import { BASE_URL } from "../../constants";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../helpers/axiosInstance";

const initialState = {
  loading: false,
  status: false,
  userData: null,
};

interface LoginInfo {
  email: string;
  password: string;
}

interface UserData {
  name: string;
  email: string;
  password: string;
}

interface ChangePassword {
  oldPassword: string;
  newPassword: string;
}

export const createAccount = createAsyncThunk(
  "register",
  async (data: UserData) => {
    try {
      const response = await axiosInstance.post("/users/register", data);
      alert("Registerd Successfully!");
      return response.data;
    } catch (error: any) {
      alert(error?.response?.data?.error);
    }
  }
);

export const userLogin = createAsyncThunk("login", async (data: LoginInfo) => {
  try {
    const response = await axiosInstance.post("/users/login", data);
    alert("Login User Succesfully");
    return response.data.data.user;
  } catch (error: any) {
    alert(error?.response?.data?.error);
  }
});

export const userLogout = createAsyncThunk("logout", async () => {
  try {
    const response = await axiosInstance.post("/users/logout");
    alert("User Logout Succesfully");
    return response.data;
  } catch (error: any) {
    alert(error?.response?.data?.error);
    throw error;
  }
});

export const refreshAccesToken = createAsyncThunk(
  "refreshAccesToken",
  async (data: any) => {
    try {
      const response = await axiosInstance.post("/users/refresh-token", data);
      return response.data;
    } catch (error: any) {
      alert(error?.response?.data?.error);
      throw error;
    }
  }
);

export const changePassword = createAsyncThunk(
  "changePassword",
  async (data: ChangePassword) => {
    try {
      const response = await axiosInstance.post("/users/change-password", data);
      alert(response?.data.message);
      return response.data;
    } catch (error: any) {
      alert(error?.response?.data?.error);
      throw error;
    }
  }
);

export const getCurrentUser = createAsyncThunk(
  "getCurrentUser",
  async (data: any) => {
    try {
      const response = await axiosInstance.get("/users/getCurrentUser", data);
      return response.data.data;
    } catch (error: any) {
      alert(error?.response?.data?.error);
      throw error;
    }
  }
);

export const updateUserDetails = createAsyncThunk(
  "updateUserDetails",
  async (data: any) => {
    try {
      const response = await axiosInstance.patch("/users/update-account", data);
      return response.data;
    } catch (error: any) {
      alert(error?.response?.data?.error);
      throw error;
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(createAccount.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(createAccount.fulfilled, (state) => {
      state.loading = false;
    });

    builder.addCase(userLogin.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(userLogin.fulfilled, (state, action) => {
      state.loading = false;
      state.status = true;
      state.userData = action.payload;
    });

    builder.addCase(userLogout.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(userLogout.fulfilled, (state) => {
      state.loading = false;
      state.status = true;
      state.userData = null;
    });

    builder.addCase(getCurrentUser.pending, (state) => {
      state.loading = false;
    });

    builder.addCase(getCurrentUser.fulfilled, (state, action) => {
      state.loading = false;
      state.status = true;
      state.userData = action.payload;
    });

    builder.addCase(getCurrentUser.rejected, (state, action) => {
      state.loading = false;
      state.status = true;
      state.userData = null;
    });

    builder.addCase(updateUserDetails.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(updateUserDetails.fulfilled, (state, action) => {
      state.loading = false;
      state.status = true;
      state.userData = action.payload;
    });
  },
});

export default authSlice.reducer;
