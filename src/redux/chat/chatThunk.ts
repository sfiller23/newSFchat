import { arrayUnion, doc, updateDoc } from "firebase/firestore";

import {
  createEntity,
  db,
  getAllEntities,
  getEntityFromCollection,
  updateEntity,
} from "../../api/firebase/api";
import { MessageStatus } from "../../constants/enums";
import type { User } from "../../interfaces/auth";
import type { ChatObj, Message } from "../../interfaces/chat";
import type { AppDispatch } from "../store";
import { setCurrentChat, setUser, setUsers } from "./chatSlice";
import { updatedChatIds } from "./helpers";

/**
 * Chat Thunks
 * This file contains asynchronous Redux thunks for managing chat-related operations.
 * These thunks interact with Firebase Firestore to handle users, chats, messages, and writing states.
 */

export function getUser(userId: string) {
  return async function getUserThunk(dispatch: AppDispatch) {
    try {
      const user = await getEntityFromCollection("users", userId);
      dispatch(setUser(user));
    } catch (error) {
      console.error(error);
    }
  };
}

export function getUsers() {
  return async function getUsersThunk(dispatch: AppDispatch) {
    try {
      const users = await getAllEntities("users");
      dispatch(setUsers(users));
    } catch (error) {
      console.error(error);
    }
  };
}

export function getChatById(chatId: string) {
  return async function getChatByIdThunk(dispatch: AppDispatch) {
    try {
      const currentChat = await getEntityFromCollection("chats", chatId);
      dispatch(setCurrentChat(currentChat));
    } catch (error) {
      console.error(error);
    }
  };
}

export function initNewChat(chatObj: ChatObj) {
  return async function initNewChatThunk() {
    try {
      await createEntity("chats", chatObj.chatId, chatObj);

      // Update the chat IDs for both admin and participant
      await updateEntity("users", chatObj.admin.userId, {
        chatIds: chatObj.admin.chatIds,
      });
      await updateEntity("users", chatObj.participant.userId, {
        chatIds: chatObj.participant.chatIds,
      });
    } catch (error) {
      console.error(error);
    }
  };
}

export function sendNewMessage(
  message: Message,
  updatedAdmin: User,
  updatedParticipant: User
) {
  return async function sendNewMessageThunk() {
    try {
      await updateDoc(doc(db, "chats", message.chatId), {
        messages: arrayUnion(message),
      });
      // Update the chat IDs status for both admin and participant (chatSeen: false)
      await updateEntity("users", updatedAdmin.userId, {
        chatIds: updatedAdmin.chatIds,
      });
      await updateEntity("users", updatedParticipant.userId, {
        chatIds: updatedParticipant.chatIds,
      });
    } catch (error) {
      console.error(error);
    }
  };
}

/**
 * Marks the last message in a chat as "arrived".
 */
export function setMessageArrived(chatId: string) {
  return async function setMessageArrivedThunk() {
    try {
      const chat = await getEntityFromCollection("chats", chatId);
      const messages = chat?.messages;
      messages[messages.length - 1].status = MessageStatus.ARRIVED;
      await updateEntity("chats", chatId, { messages: messages });
    } catch (error) {
      console.error(error);
    }
  };
}

/**
 * Marks a chat as "seen" by updating the chat IDs for both admin and participant.
 */
export function setChatSeen(admin: User, participant: User, chatId: string) {
  return async function setChatSeenThunk() {
    try {
      const newAdminChatIdsObj = updatedChatIds(admin, chatId);
      const newParticipantChatIdsObj = updatedChatIds(participant, chatId);

      // Update the chat IDs for both admin and participant (chatSeen: true)
      await updateEntity("users", admin.userId, {
        chatIds: newAdminChatIdsObj,
      });
      await updateEntity("users", participant.userId, {
        chatIds: newParticipantChatIdsObj,
      });
    } catch (error) {
      console.error(error);
    }
  };
}

/**
 * Marks all messages in a chat as "seen".
 */
export function setNewMessageSeen(chatId: string) {
  return async function setNewMessageSeenThunk() {
    try {
      const chat = await getEntityFromCollection("chats", chatId);
      const messages: Message[] = chat?.messages.map((message: Message) => {
        message.status = MessageStatus.SEEN;
        return message;
      });
      await updateEntity("chats", chatId, { messages: messages });
    } catch (error) {
      console.error(error);
    }
  };
}

/**
 * Updates the "writing" state of a chat in Firestore.
 */
export function setWritingState(
  isWriting: boolean,
  chatId: string,
  writerID: string
) {
  return async function setWritingStateThunk() {
    try {
      await updateEntity("chats", chatId, {
        writing: { status: isWriting, writerID: writerID },
      });
    } catch (error) {
      console.error(error);
    }
  };
}
