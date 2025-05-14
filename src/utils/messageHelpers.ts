import type { ThunkDispatch, UnknownAction } from "@reduxjs/toolkit";
import { v4 as uid } from "uuid";
import { MessageStatus } from "../constants/enums";
import type { User } from "../interfaces/auth";
import type { ChatObj, Message } from "../interfaces/chat";
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

export const getMessageObj = (
  currentUser: User,
  messageText: string,
  chatId: string
): Message => {
  const messageId = uid();
  const messageObj: Message = {
    messageId: messageId,
    displayName: currentUser.displayName,
    text: messageText,
    sentTime: Date.now(),
    status: MessageStatus.SENT,
    chatId: chatId,
    senderId: currentUser.userId,
  };
  return messageObj;
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
