import { MessageStatus } from "../constants/enums";
import type { User } from "./auth";

export interface Message {
  displayName: string;
  sender: User;
  receiver: User;
  text: string;
  sentTime: number;
  status: MessageStatus;
  index: number;
  chatId: string;
}

export interface Chats {
  [chatId: string]: ChatObj;
}

export interface ChatObj {
  chatId: string;
  admin: User;
  participant: User;
  messages: Message[];
  writing?: { status: boolean; writerID: string };
}

export interface ChatIds {
  [chatId: string]: { active: boolean };
}
