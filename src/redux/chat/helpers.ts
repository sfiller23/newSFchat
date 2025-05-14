import type { User } from "../../interfaces/auth";
import type { ChatIds } from "../../interfaces/chat";

/**
 * Updates the `chatIds` object for a user by marking the last message in a chat as "seen".
 */

export const updatedChatIds = (user: User, chatId: string): ChatIds => {
  const updatedUserChatId = {
    ...user.chatIds[chatId],
    lastMessageNotSeen: false,
  };
  const newUserChatIdsObj = { ...user.chatIds, [chatId]: updatedUserChatId };
  return newUserChatIdsObj;
};
