import { createSelector } from "@reduxjs/toolkit";
import type { User } from "../../interfaces/auth";
import type { ChatObj } from "../../interfaces/chat";
import { useAppSelector } from "../hooks/reduxHooks";
import type { RootState } from "../store";

/**
 * Chat Selectors
 * This file contains selectors and custom hooks for accessing and transforming chat-related state
 * from the Redux store. These selectors are optimized using `createSelector` from Redux Toolkit
 * to ensure efficient memoization and avoid unnecessary re-renders.
 */

const selectUser = createSelector(
  (state) => state.chatReducer.user,
  (user: User): User => ({
    userId: user?.userId,
    displayName: user?.displayName,
    email: user?.email,
    loggedIn: user?.loggedIn,
    chatIds: { ...user?.chatIds },
  })
);

export const useCurrentUser = () => useAppSelector(selectUser);

const selectUsers = createSelector(
  (state) => state.chatReducer.users,
  (users: User[]): User[] =>
    users.map((user: User) => {
      return {
        userId: user.userId,
        displayName: user.displayName,
        email: user.email,
        loggedIn: user.loggedIn,
        chatIds: { ...user?.chatIds },
      };
    })
);

export const useUsers = () => useAppSelector(selectUsers);

const selectSideBarUsers = createSelector(
  (state) => state.chatReducer.sideBarUsers,
  (users: User[]): User[] =>
    users.map((user: User) => {
      return {
        userId: user.userId,
        displayName: user.displayName,
        email: user.email,
        loggedIn: user.loggedIn,
        chatIds: { ...user?.chatIds },
      };
    })
);

export const useSideBarUsers = () => useAppSelector(selectSideBarUsers);

const selectCurrentChat = createSelector(
  (state) => state.chatReducer.currentChat,
  (chat: ChatObj): ChatObj | undefined => ({
    chatId: chat?.chatId,
    admin: chat?.admin,
    participant: chat?.participant,
    messages: chat?.messages,
    writing: {
      status: chat?.writing?.status as boolean,
      writerID: chat?.writing?.writerID as string,
    },
  })
);

export const useCurrentChat = () => useAppSelector(selectCurrentChat);

const selectIsNewChatMessage = (state: RootState) =>
  state.chatReducer.isNewChatMessage;

export const useIsNewChatMessage = () => useAppSelector(selectIsNewChatMessage);
