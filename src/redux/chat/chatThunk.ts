import { createAsyncThunk } from "@reduxjs/toolkit";

import {
  arrayUnion,
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";

import {
  createEntity,
  getAllEntities,
  getEntityFromCollection,
  updateEntity,
} from "../../api/firebase/api";
import { MessageStatus } from "../../constants/enums";
import type { User } from "../../interfaces/auth";
import type { ChatObj, Chats, Message } from "../../interfaces/chat";
import { db } from "../../main";
import type { AppDispatch } from "../store";
import { setCurrentChat, setUser, setUsers } from "./chatSlice";

export function getUser(userId: string) {
  return async function getUserThunk(dispatch: AppDispatch) {
    try {
      const user = await getEntityFromCollection("users", userId);
      dispatch(setUser(user));
    } catch (error) {
      alert(error);
    }
  };
}

export function getUsers() {
  return async function getUsersThunk(dispatch: AppDispatch) {
    try {
      const users = await getAllEntities("users");
      dispatch(setUsers(users));
    } catch (error) {
      alert(error);
    }
  };
}

export function getChatById(chatId: string) {
  return async function getChatByIdThunk(dispatch: AppDispatch) {
    try {
      const currentChat = await getEntityFromCollection("chats", chatId);
      dispatch(setCurrentChat(currentChat));
    } catch (error) {
      alert(error);
    }
  };
}

export function initNewChat(chatObj: ChatObj) {
  return async function initNewChatThunk() {
    try {
      await createEntity("chats", chatObj.chatId, chatObj);

      await updateEntity("users", chatObj.admin.userId, {
        chatIds: chatObj.admin.chatIds,
      });
      await updateEntity("users", chatObj.participant.userId, {
        chatIds: chatObj.participant.chatIds,
      });
    } catch (error) {
      alert(error);
    }
  };
}

export function sendNewMessage(message: Message, currentChat: ChatObj) {
  return async function sendNewMessageThunk() {
    try {
      const newAdminChatIdsObj = {
        ...currentChat.admin.chatIds,
        [currentChat.chatId]: {
          lastMessageNotSeen: true,
          senderId: message.senderId,
        },
      };
      const newParticipantChatIdsObj = {
        ...currentChat.participant.chatIds,
        [currentChat.chatId]: {
          lastMessageNotSeen: true,
          senderId: message.senderId,
        },
      };
      await updateDoc(doc(db, "chats", message.chatId), {
        messages: arrayUnion(message),
      });
      await updateEntity("users", currentChat.admin.userId, {
        chatIds: newAdminChatIdsObj,
      });
      await updateEntity("users", currentChat.participant.userId, {
        chatIds: newParticipantChatIdsObj,
      });
    } catch (error) {
      alert(error);
    }
  };
}

export function setMessageArrived(chatId: string) {
  return async function setMessageArrivedThunk() {
    try {
      const chat = await getEntityFromCollection("chats", chatId);
      const messages = chat?.messages;
      messages[messages.length - 1].status = MessageStatus.ARRIVED;
      await updateEntity("chats", chatId, { messages: messages });
    } catch (error) {
      alert(error);
    }
  };
}

export function setChatSeen(currentChat: ChatObj) {
  return async function setChatSeenThunk() {
    try {
      const newAdminChatIdsObj = {
        ...currentChat.admin.chatIds,
        [currentChat.chatId]: {
          ...currentChat.admin.chatIds[currentChat.chatId],
          lastMessageNotSeen: false,
        },
      };
      const newParticipantChatIdsObj = {
        ...currentChat.participant.chatIds,
        [currentChat.chatId]: {
          ...currentChat.participant.chatIds[currentChat.chatId],
          lastMessageNotSeen: false,
        },
      };

      await updateEntity("users", currentChat.admin.userId, {
        chatIds: newAdminChatIdsObj,
      });
      await updateEntity("users", currentChat.participant.userId, {
        chatIds: newParticipantChatIdsObj,
      });
    } catch (error) {
      alert(error);
    }
  };
}

export function setNewMessageSeen(chatId: string) {
  return async function setNewMessageSeenThunk() {
    try {
      const chat = await getEntityFromCollection("chats", chatId);
      console.log(chat, "from thunk");
      const messages: Message[] = chat?.messages.map((message: Message) => {
        message.status = MessageStatus.SEEN;
        return message;
      });
      await updateEntity("chats", chatId, { messages: messages });
    } catch (error) {
      alert(error);
    }
  };
}

export const setWritingState = createAsyncThunk(
  "setWritingState",
  async (args: { isWriting: boolean; chatId: string; writerID: string }) => {
    await updateDoc(doc(db, "chats", args.chatId), {
      writing: { status: args.isWriting, writerID: args.writerID },
    });
  }
);

export const setMessageSeenReq = createAsyncThunk(
  "setMessageSeen",
  async (chatId: string) => {
    const q = query(collection(db, "chats"), where("chatId", "==", chatId));
    const querySnapshot = await getDocs(q);
    let chat: Partial<ChatObj> = {};
    querySnapshot.forEach((doc) => {
      chat = { chatId: doc.id, ...doc.data() };
    });
    if (chat.messages) {
      chat.messages.forEach((message) => {
        message.status = MessageStatus.SEEN;
      });
      await updateDoc(doc(db, "chats", chatId), {
        messages: chat.messages,
      });
    }
  }
);

export const updateChat = createAsyncThunk(
  "updateChat",
  async (args: { chatId: string; message: Message }) => {
    try {
      if (args.chatId) {
        await updateDoc(doc(db, "chats", args.chatId), {
          messages: arrayUnion(args.message),
        });
        const q = query(
          collection(db, "chats"),
          where("chatId", "==", args.chatId)
        );
        const querySnapshot = await getDocs(q);
        let chat: Partial<ChatObj> = {};
        querySnapshot.forEach((doc) => {
          chat = { chatId: doc.id, ...doc.data() };
        });
        if (chat.messages) {
          chat.messages[chat.messages.length - 1].status =
            MessageStatus.ARRIVED;
          await updateDoc(doc(db, "chats", args.chatId), {
            messages: chat.messages,
          });
        }
      }
    } catch (error) {
      alert(`${error} In updateChat`);
    }
  }
);

export const getUserById = createAsyncThunk(
  "getUserById",
  async (userId: string) => {
    try {
      const q = query(collection(db, "users"), where("userId", "==", userId));
      const querySnapshot = await getDocs(q);
      let user: Partial<User> = {};
      querySnapshot.forEach((doc) => {
        user = { userId: doc.id, ...doc.data() };
      });
      return user;
    } catch (error) {
      alert(`${error} In getUserById`);
    }
  }
);

// export const getUsers = createAsyncThunk("getUsers", async () => {
//   try {
//     const querySnapshot = await getDocs(collection(db, "users"));
//     const usersArray: User[] = [];
//     querySnapshot.forEach((doc) => {
//       usersArray.push({ userId: doc.id, ...doc.data() } as User);
//     });
//     return usersArray;
//   } catch (error) {
//     alert(`${error} In getDocs`);
//   }
// });

export const getChats = createAsyncThunk("getChats", async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "chats"));
    let chatObj: Partial<Chats> = {};
    querySnapshot.forEach((doc) => {
      chatObj = { ...chatObj, [doc.id]: { ...doc.data() } } as Chats;
    });
    return chatObj;
  } catch (error) {
    alert(`${error} In getChats`);
  }
});
