import { createSelector } from "@reduxjs/toolkit";
import type { User } from "../../interfaces/auth";
import type { ChatObj, Chats } from "../../interfaces/chat";

export const selectUser = createSelector(
  (state) => state.chatReducer.user,
  (user): User => ({
    userId: user?.userId,
    displayName: user?.displayName,
    email: user?.email,
    loggedIn: user?.loggedIn,
    chatIds: { ...user?.chatIds },
  })
);
export const selectUsers = createSelector(
  (state) => state.chatReducer.users,
  (users): User[] =>
    [...users].map((user) => {
      return {
        userId: user?.userId,
        displayName: user?.displayName,
        email: user?.email,
        loggedIn: user?.loggedIn,
        chatIds: { ...user?.chatIds },
      };
    })
);

// export const selectUsers = createSelector(
//   (state) => state.chatReducer.users,
//   (users): User[] => users
// );
export const selectChats = createSelector(
  (state) => state.chatReducer.chats,
  (chats): Chats => chats
);
export const selectCurrentChat = createSelector(
  (state) => state.chatReducer.currentChat,
  (currentChat): ChatObj | undefined => currentChat
);
