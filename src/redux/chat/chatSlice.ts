import { createSlice } from "@reduxjs/toolkit";
import type { User } from "../../interfaces/auth";
import type { ChatObj } from "../../interfaces/chat";

export interface ChatState {
  user?: User;
  users: User[];
  currentChat?: ChatObj;
  isNewChatMessage: boolean;
}

const initialState: ChatState = {
  user: undefined,
  users: [],
  currentChat: undefined,
  isNewChatMessage: false,
};

const chatSlice = createSlice({
  name: "Chat",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setUsers: (state, action) => {
      state.users = action.payload;
    },
    setCurrentChat: (state, action) => {
      state.currentChat = action.payload;
    },
    updateUser: (state, action) => {
      const userIndex = state.users
        .map((user) => user.userId)
        .indexOf(action.payload.userId);
      state.users[userIndex] = action.payload;
      if (state.users[userIndex].userId === state.user?.userId) {
        state.user = action.payload;
      }
    },
    addMessage: (state, action) => {
      state.currentChat?.messages.push(action.payload);
    },
    setIsNewChatMessage: (state, action) => {
      state.isNewChatMessage = action.payload;
    },
    searchUser: (state, action) => {
      state.users = state.users.filter((user) =>
        user.displayName.startsWith(action.payload)
      );
    },
    clearChat: (state) => {
      Object.assign(state, initialState);
    },
  },
});

export const {
  searchUser,
  setIsNewChatMessage,
  updateUser,
  clearChat,
  setUser,
  setUsers,
  setCurrentChat,
  addMessage,
} = chatSlice.actions;

export default chatSlice.reducer;
