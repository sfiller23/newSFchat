import type { ChatIds } from "./chat";

export interface User {
  userId: string;
  displayName: string;
  email: string;
  loggedIn: boolean;
  chatIds: ChatIds;
}
