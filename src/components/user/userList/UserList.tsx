import { memo, useCallback, useEffect, useState } from "react";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../redux/hooks/reduxHooks";
import "./_user-list.scss";

import { updateUser, type ChatState } from "../../../redux/chat/chatSlice";

import { collection, onSnapshot } from "firebase/firestore";
import type { User } from "../../../interfaces/auth";
import { db } from "../../../main";
import { selectUsers } from "../../../redux/chat/chatSelectors";
import {
  getChatById,
  getUsers,
  initNewChat,
  setChatSeen,
} from "../../../redux/chat/chatThunk";
import ListItem from "./listItem/ListItem";
import { chatExists, createChat } from "./utils/functions";

export const UserList = (props: Partial<ChatState>) => {
  const { user: currentUser } = props;

  const users = useAppSelector(selectUsers);

  const [listItemActiveUid, setListItemActiveUid] = useState("");

  const dispatch = useAppDispatch();

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
  }, []);

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
        {users?.map((user) => {
          if (currentUser && currentUser.userId !== user.userId) {
            return (
              <ListItem
                key={user.userId}
                currentUser={currentUser}
                user={user}
                handleClick={handleClick}
                listItemActiveUid={listItemActiveUid}
              />
            );
          }
        })}
      </ul>
    </div>
  );
};

export default memo(UserList);
