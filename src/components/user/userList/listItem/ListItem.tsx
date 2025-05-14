import { memo, useEffect, useState } from "react";
import LoggedInIcon from "../../../../UI/loggedInIcon/loggedInIcon";
import type { User } from "../../../../interfaces/auth";
import {
  setIsNewChatMessage,
  type ChatState,
} from "../../../../redux/chat/chatSlice";
import { useAppDispatch } from "../../../../redux/hooks/reduxHooks";
import { isNewMessage } from "../../../../utils/messageHelpers";
import "./_list-item.scss";

interface ListItemProps extends Partial<ChatState> {
  currentUser: User;
  handleClick: (uid: string, admin: User, participant: User) => Promise<void>;
  listItemActiveUid: string;
}

const ListItem = (props: ListItemProps) => {
  const { currentUser, user, handleClick, listItemActiveUid } = props;

  const [isNewUserMessage, setIsNewUserMessage] = useState(false);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (user && user.userId === isNewMessage(user, currentUser)) {
      setIsNewUserMessage(true);
      dispatch(setIsNewChatMessage(true));
    } else {
      setIsNewUserMessage(false);
      dispatch(setIsNewChatMessage(false));
    }
    // dispatch is a stable function no need to include it
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, currentUser]);

  const activeUid = localStorage.getItem("activeUid");

  return (
    <li
      onClick={async () => {
        await handleClick(user?.userId as string, currentUser, user as User);
      }}
      className={`list-item ${
        (listItemActiveUid === user?.userId && "active") ||
        (activeUid && activeUid === user?.userId && "active")
      } 

       ${isNewUserMessage && "new-message"}`}
    >
      <LoggedInIcon loggedIn={user?.loggedIn} />
      <h5>{user?.displayName}</h5>
    </li>
  );
};

export default memo(ListItem);
