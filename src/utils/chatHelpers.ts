import { v4 as uid } from "uuid";
import type { User } from "../interfaces/auth";
import type { ChatObj, Message } from "../interfaces/chat";
import {
  sendNewMessage,
  setChatSeen,
  setMessageArrived,
} from "../redux/chat/chatThunk";
import type { AppDispatch } from "../redux/store";
import { setMessageSeen } from "./messageHelpers";

/**
 * Chat Helpers
 * This file contains utility functions for managing chat-related operations.
 * These helpers handle tasks such as checking if a chat exists, creating new chats,
 * updating chat states, and managing message-related actions.
 */

/**
 * Checks if a chat already exists between two users.
 * @param admin - The admin user object.
 * @param participant - The participant user object.
 * @returns The chat ID if a chat exists, otherwise `false`.
 */
export const chatExists = (
  admin: User,
  participant: User
): boolean | string => {
  if (admin.chatIds) {
    // Iterate through the admin's chat IDs
    for (const chatId in admin.chatIds) {
      if (participant.chatIds && participant.chatIds[chatId]) {
        // If the participant also has the same chat ID, the chat exists
        localStorage.setItem("chatId", chatId);
        return chatId;
      }
    }
  }
  return false;
};

/**
 * Creates a new chat object between two users.
 * @param admin - The admin user object.
 * @param participant - The participant user object.
 * @returns A new `ChatObj` representing the chat.
 */
export const createChat = (admin: User, participant: User): ChatObj => {
  const chatId = uid();
  localStorage.setItem("chatId", chatId);

  // Create new objects for admin and participant to avoid mutating the original ones
  const updatedAdmin = {
    ...admin,
    chatIds: {
      ...admin.chatIds,
      [chatId]: { lastMessageNotSeen: false, senderId: admin.userId },
    },
  };

  const updatedParticipant = {
    ...participant,
    chatIds: {
      ...participant.chatIds,
      [chatId]: { lastMessageNotSeen: false, senderId: admin.userId },
    },
  };
  const chatObj: ChatObj = {
    chatId,
    admin: updatedAdmin,
    participant: updatedParticipant,
    messages: [],
  };
  return chatObj;
};

/**
 * Updates the `chatIds` state for a user based on a new message.
 * @param user - The user object to update.
 * @param newMessage - The new message object.
 * @param initial - Whether the message is from the current user (`true`) or the receiver (`false`).
 * @returns An updated `User` object with the modified `chatIds`.
 */
const updatedChatIdsState = (
  user: User,
  newMessage: Message,
  initial: boolean
): User => {
  const updatedUserChatIds = {
    ...user.chatIds,
    [newMessage.chatId]: {
      lastMessageNotSeen: !initial,
      senderId: newMessage.senderId,
    },
  };
  const updatedUser: User = {
    userId: user.userId,
    displayName: user.displayName,
    email: user.email,
    loggedIn: user.loggedIn,
    chatIds: updatedUserChatIds,
  };
  return updatedUser;
};

/**
 * Updates the chat state by sending a new message and marking it as arrived.
 * @param currentUser - The current user sending the message.
 * @param receiver - The receiver of the message.
 * @param messageObj - The message object to send.
 * @param dispatch - The Redux dispatch function.
 */
export const updateChat = async (
  currentUser: User,
  receiver: User,
  messageObj: Message,
  dispatch: AppDispatch
) => {
  const updatedAdmin = updatedChatIdsState(currentUser, messageObj, true); //Set new message
  const updatedParticipant = updatedChatIdsState(receiver, messageObj, false);
  //Set new message with chat not seen state
  await dispatch(sendNewMessage(messageObj, updatedAdmin, updatedParticipant));
  //If sending message didn't failed, it's arrived;
  await dispatch(setMessageArrived(messageObj.chatId));
};

export const onFocusHandler = async (
  currentChat: ChatObj,
  currentUser: User,
  receiver: User,
  dispatch: AppDispatch
) => {
  // Mark messages as seen
  setMessageSeen(currentChat, dispatch, currentUser);
  // Mark chat as seen (for the new message indicator in the user list)
  await dispatch(setChatSeen(currentUser, receiver, currentChat.chatId));
};
