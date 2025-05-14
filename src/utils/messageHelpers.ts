import type { ThunkDispatch, UnknownAction } from "@reduxjs/toolkit";
import { v4 as uid } from "uuid";
import { MessageStatus } from "../constants/enums";
import type { User } from "../interfaces/auth";
import type { ChatObj, Message } from "../interfaces/chat";
import type { ChatState } from "../redux/chat/chatSlice";
import { setNewMessageSeen } from "../redux/chat/chatThunk";

/**
 * Message Helpers
 * This file contains utility functions for managing message-related operations.
 * These helpers handle tasks such as marking messages as seen, creating new message objects,
 * and checking for new messages in a chat.
 */

/**
 * Marks the last message in a chat as "seen" if it was not sent by the current user.
 * Dispatches an action to update the message status in the Redux store and Firestore.
 * @param chat - The chat object containing the messages.
 * @param dispatch - The Redux dispatch function.
 * @param user - The current user object.
 */
export const setMessageSeen = async (
  chat: ChatObj,
  dispatch: ThunkDispatch<ChatState, undefined, UnknownAction>,
  user: User
) => {
  if (chat) {
    if (chat.messages.length !== 0) {
      if (chat?.messages[chat?.messages.length - 1].senderId !== user?.userId) {
        // If the last message was not sent by the current user
        await dispatch(setNewMessageSeen(chat.chatId));
      }
    }
  }
};

/**
 * Creates a new message object.
 * @param currentUser - The current user sending the message.
 * @param messageText - The text content of the message.
 * @param chatId - The unique ID of the chat the message belongs to.
 * @returns A `Message` object containing the message details.
 */
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

/**
 * Checks if there is a new message in a chat that has not been seen by the current user.
 * @param user - The user object to check for new messages.
 * @param currentUser - The current user object.
 * @returns The sender ID of the new message if one exists, otherwise `undefined`.
 */
export const isNewMessage = (
  // to show new message indicator in the user list on the specific user (that sent the message)
  user: User,
  currentUser: User
): string | undefined => {
  for (const chatId in user.chatIds) {
    if (
      currentUser.chatIds[chatId] && //If I have the chatId
      currentUser.chatIds[chatId].lastMessageNotSeen // and last message not seen
    ) {
      return currentUser.chatIds[chatId].senderId; // return senderId. that in the list if the sender id matches the user from list, it gets the new message indicator
    }
  }
};
