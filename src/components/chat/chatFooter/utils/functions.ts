import { v4 as uid } from "uuid";
import { MessageStatus } from "../../../../constants/enums";
import type { User } from "../../../../interfaces/auth";
import type { ChatObj, Message } from "../../../../interfaces/chat";
import {
  sendNewMessage,
  setChatSeen,
  setMessageArrived,
} from "../../../../redux/chat/chatThunk";
import type { AppDispatch } from "../../../../redux/store";
import { setMessageSeen } from "../../../../utils/common-functions";

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
