import type { User } from "../../../../interfaces/auth";
import type { Message } from "../../../../interfaces/chat";

export const getUpdateUserChatIds = (user: User, newMessage: Message): User => {
  console.log(user.chatIds, "in function before executing");
  const updatedUserChatIds = {
    ...user.chatIds,
    [newMessage.chatId]: {
      lastMessageNotSeen: true,
      senderId: newMessage.senderId,
    },
  };
  console.log(updatedUserChatIds, "from function");
  const updatedUser: User = {
    userId: user.userId,
    displayName: user.displayName,
    email: user.email,
    loggedIn: user.loggedIn,
    chatIds: updatedUserChatIds,
  };
  return updatedUser;
};

export const addChatId = (
  user: User,
  newMessage: Message,
  initial: boolean
): User => {
  console.log(user.chatIds, "in function before executing");
  const updatedUserChatIds = {
    ...user.chatIds,
    [newMessage.chatId]: {
      lastMessageNotSeen: !initial,
      senderId: newMessage.senderId,
    },
  };
  console.log(updatedUserChatIds, "from function");
  const updatedUser: User = {
    userId: user.userId,
    displayName: user.displayName,
    email: user.email,
    loggedIn: user.loggedIn,
    chatIds: updatedUserChatIds,
  };
  return updatedUser;
};
