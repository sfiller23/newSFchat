import type { User } from "../../interfaces/auth";
import type { ChatIds } from "../../interfaces/chat";

export const updatedChatIds = (user: User, chatId: string): ChatIds => {
  const updatedUserChatId = {
    ...user.chatIds[chatId],
    lastMessageNotSeen: false,
  };
  const newUserChatIdsObj = { ...user.chatIds, [chatId]: updatedUserChatId };
  return newUserChatIdsObj;
};
