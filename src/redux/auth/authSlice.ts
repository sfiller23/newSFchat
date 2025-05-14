import { createSlice } from "@reduxjs/toolkit";
import type { User } from "../../interfaces/auth";

/**
 * Auth Slice
 * This Redux slice manages the authentication state of the application.
 * It includes actions for authenticating a user and logging out.
 * The state includes user details such as userId, displayName, email, and login status.
 */

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
    /**
     * Authenticate Action
     * Updates the state with the authenticated user's details.
     * Also stores the userId in localStorage for persistence.
     */
    authenticate: (state, action) => {
      state.userId = action.payload.userId;
      state.displayName = action.payload.displayName ?? "";
      state.email = action.payload.email;
      state.loggedIn = true;
      state.chatIds = action.payload.chatIds ?? "";
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
