import type { ThunkDispatch, UnknownAction } from "@reduxjs/toolkit";
import type { User } from "../interfaces/auth";
import type { ChatObj } from "../interfaces/chat";
import type { ChatState } from "../redux/chat/chatSlice";
import { setNewMessageSeen } from "../redux/chat/chatThunk";

export const setMessageSeen = async (
  chat: ChatObj,
  dispatch: ThunkDispatch<ChatState, undefined, UnknownAction>,
  user: User
) => {
  if (chat) {
    if (chat.messages.length !== 0) {
      if (chat?.messages[chat?.messages.length - 1].senderId !== user?.userId) {
        // if last message didn't sent by me
        await dispatch(setNewMessageSeen(chat.chatId));
      }
    }
  }
};

export const isNewMessage = (
  user: User,
  currentUser: User
): string | undefined => {
  for (const chatId in user.chatIds) {
    if (
      currentUser.chatIds[chatId] &&
      currentUser.chatIds[chatId].lastMessageNotSeen
    ) {
      return currentUser.chatIds[chatId].senderId;
    }
  }
};
