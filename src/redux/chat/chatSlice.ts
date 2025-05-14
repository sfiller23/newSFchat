import { createSlice } from "@reduxjs/toolkit";
import type { User } from "../../interfaces/auth";
import type { ChatObj } from "../../interfaces/chat";

/**
 * Chat Slice
 * This Redux slice manages the chat-related state of the application.
 * It includes actions for managing users, chats, messages, and the sidebar user list.
 * The state includes the current user, all users, the current chat, and flags for new messages.
 */

export interface ChatState {
  user?: User;
  users: User[];
  sideBarUsers: User[];
  currentChat?: ChatObj;
  isNewChatMessage: boolean;
}

const initialState: ChatState = {
  user: undefined,
  users: [],
  sideBarUsers: [],
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
      state.sideBarUsers = (action.payload as User[]).filter(
        // Exclude the current user from the sidebar user list
        (user: User) => user.userId !== state.user?.userId
      );
    },
    setCurrentChat: (state, action) => {
      state.currentChat = action.payload;
    },
    updateUser: (state, action) => {
      const userIndex = state.users
        .map((user) => user.userId)
        .indexOf(action.payload.userId);
      state.users[userIndex] = action.payload;
      // Update the current user if the updated user matches the logged-in user
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
      if (!action.payload) {
        state.sideBarUsers = state.users;
        return;
      }
      state.sideBarUsers = state.users.filter((user) =>
        user.displayName.includes(action.payload)
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
