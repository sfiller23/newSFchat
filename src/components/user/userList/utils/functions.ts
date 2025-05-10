import { v4 as uid } from "uuid";
import type { User } from "../../../../interfaces/auth";
import type { ChatObj } from "../../../../interfaces/chat";

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
