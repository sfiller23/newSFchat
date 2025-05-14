import { MessageStatus } from "../constants/enums";
import type { User } from "./auth";

export interface Message {
  messageId: string;
  displayName: string;
  text: string;
  sentTime: number;
  status: MessageStatus;
  chatId: string;
  senderId: string;
}

export interface ChatObj {
  chatId: string;
  admin: User;
  participant: User;
  messages: Message[];
  writing?: { status: boolean; writerID: string };
}

export interface ChatIds {
  [chatId: string]: { lastMessageNotSeen: boolean; senderId: string };
}
