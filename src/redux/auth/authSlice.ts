import { createSlice } from "@reduxjs/toolkit";
import type { User } from "../../interfaces/auth";

const initialState: User = {
  userId: "",
  displayName: "",
  email: "",
  loggedIn: false,
  chatIds: {},
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    authenticate: (state, action) => {
      state = { ...action.payload, loggedIn: true };
      localStorage.setItem("userId", action.payload.userId);
    },
    logout: (state) => {
      Object.assign(state, initialState);
      localStorage.clear();
    },
  },
});

//Add reducer functions below if you have some
export const { authenticate, logout } = authSlice.actions;
export default authSlice.reducer;
