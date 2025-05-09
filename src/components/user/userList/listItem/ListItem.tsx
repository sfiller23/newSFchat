import { memo } from "react";
import LoggedInIcon from "../../../../UI/loggedInIcon/loggedInIcon";
import type { User } from "../../../../interfaces/auth";
import type { ChatState } from "../../../../redux/chat/chatSlice";
import "./_list-item.scss";

interface ListItemProps extends Partial<ChatState> {
  currentUser: User;
  handleClick: (uid: string, admin: User, participant: User) => Promise<void>;
  listItemActiveUid: string;
}

const ListItem = (props: ListItemProps) => {
  const { currentUser, user, handleClick, listItemActiveUid } = props;
  const activeUid = localStorage.getItem("activeUid");

  return (
    <li
      onClick={async () => {
        await handleClick(user?.userId as string, currentUser, user as User);
      }}
      className={`list-item ${
        (listItemActiveUid === user?.userId && "active") ||
        (activeUid && activeUid === user?.userId && "active")
      } `}

      //  ${
      //    user?.chatIds &&
      //    user.userId === isNewMessage(user, currentUser, chats as Chats) &&
      //    "new-message"
      //  }`}
    >
      <LoggedInIcon loggedIn={user?.loggedIn} />
      <h5>{user?.displayName}</h5>
    </li>
  );
};

export default memo(ListItem);
