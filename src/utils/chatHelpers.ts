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

export const chatExists = (
  admin: User,
  participant: User
): boolean | string => {
  if (admin.chatIds) {
    // If i have chats
    for (const chatId in admin.chatIds) {
      if (participant.chatIds && participant.chatIds[chatId]) {
        // If he have chats and it between us (same chatId)
        localStorage.setItem("chatId", chatId);
        return chatId;
      }
    }
  }
  return false;
};

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

export const updateChat = async (
  currentUser: User,
  receiver: User,
  messageObj: Message,
  dispatch: AppDispatch
) => {
  const updatedAdmin = updatedChatIdsState(currentUser, messageObj, true);
  const updatedParticipant = updatedChatIdsState(receiver, messageObj, false);
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
  setMessageSeen(currentChat, dispatch, currentUser);
  await dispatch(setChatSeen(currentUser, receiver, currentChat.chatId));
};
