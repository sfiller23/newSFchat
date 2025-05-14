import { memo, useCallback, useEffect, useState } from "react";
import { useAppDispatch } from "../../../redux/hooks/reduxHooks";
import "./_user-list.scss";

import { updateUser } from "../../../redux/chat/chatSlice";

import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../../api/firebase/api";
import type { User } from "../../../interfaces/auth";
import { useSideBarUsers } from "../../../redux/chat/chatSelectors";
import {
  getChatById,
  getUsers,
  initNewChat,
  setChatSeen,
} from "../../../redux/chat/chatThunk";
import { chatExists, createChat } from "../../../utils/chatHelpers";
import ListItem from "./listItem/ListItem";

/**
 * UserList Component
 * This component displays a list of users. It allows the current user to select another user
 * to start or continue a chat. It also listens for real-time updates to the user list from Firebase Firestore.
 */

export const UserList = (props: { currentUser: User }) => {
  const { currentUser } = props;

  const sideBarUsers = useSideBarUsers();

  const [listItemActiveUid, setListItemActiveUid] = useState("");

  const dispatch = useAppDispatch();

  /**
   * Subscribes to real-time updates for the user list from Firebase Firestore.
   * Updates the Redux store when users are added or modified.
   */
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "users"), (doc) => {
      doc.docChanges().forEach((change) => {
        switch (change.type) {
          case "added":
            (async () => {
              await dispatch(getUsers());
            })();
            break;
          case "modified":
            dispatch(updateUser(change.doc.data()));
            break;
          default:
            return;
        }
      });
    });

    return () => {
      unsubscribe();
    };
    // dispatch is a stable function no need to include it
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Opens a chat between the current user and the selected user.
   * If a chat already exists, it retrieves the chat and marks it as seen.
   * If no chat exists, it creates a new chat and marks it as seen.
   */
  const openChat = useCallback(async (admin: User, participant: User) => {
    if (chatExists(admin, participant)) {
      const chatId = chatExists(admin, participant);
      await dispatch(getChatById(chatId as string));
      if (chatId) {
        await dispatch(setChatSeen(admin, participant, chatId as string));
      }
      return;
    }
    const chatObj = createChat(admin, participant);
    await dispatch(initNewChat(chatObj));
    if (chatObj.chatId) {
      await dispatch(setChatSeen(admin, participant, chatObj.chatId));
    }
    // dispatch is a stable function no need to include it
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setUserActive = useCallback((uid: string) => {
    setListItemActiveUid(uid);
    localStorage.setItem("activeUid", uid);
  }, []);

  const handleClick = useCallback(
    async (uid: string, admin: User, participant: User) => {
      setUserActive(uid);
      await openChat(admin, participant);
    },
    [openChat, setUserActive]
  );

  return (
    <div className="user-list-container">
      <ul className="user-list">
        {sideBarUsers?.map((user) => {
          return (
            <ListItem
              key={user.userId}
              currentUser={currentUser}
              user={user}
              handleClick={handleClick}
              listItemActiveUid={listItemActiveUid}
            />
          );
        })}
      </ul>
    </div>
  );
};

export default memo(UserList);
