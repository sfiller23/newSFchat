import { createSlice } from "@reduxjs/toolkit";
import type { User } from "../../interfaces/auth";
import type { ChatObj, Chats } from "../../interfaces/chat";

export interface ChatState {
  user?: User;
  users: User[];
  chats: Chats;
  currentChat?: ChatObj;
}

const initialState: ChatState = {
  user: undefined,
  users: [],
  chats: {},
  currentChat: undefined,
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
    addChat: (state, action) => {
      state.chats[action.payload.chatId] = action.payload;
    },
    updateCurrentChat: (state, action) => {
      state.chats[action.payload.chatId] = action.payload;
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
    setCurrentChatMessage: (state, action) => {
      state.currentChat?.messages.push(action.payload);
    },
    setAuthenticatedUser: (state, action) => {
      state.user = action.payload;
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
  setAuthenticatedUser,
  setCurrentChatMessage,
  updateUser,
  clearChat,
  updateCurrentChat,
  setUser,
  setUsers,
  setCurrentChat,
  addChat,
} = chatSlice.actions;

export default chatSlice.reducer;
