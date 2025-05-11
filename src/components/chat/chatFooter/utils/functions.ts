import type { User } from "../../../../interfaces/auth";
import type { Message } from "../../../../interfaces/chat";

export const getUpdateUserChatIds = (user: User, newMessage: Message): User => {
  const updatedUserChatIds = {
    ...user.chatIds,
    [newMessage.chatId]: {
      lastMessageNotSeen: true,
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
