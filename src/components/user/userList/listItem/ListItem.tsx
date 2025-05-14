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

/**
 * ListItem Component
 * This component represents an individual user in the user list. It displays the user's name,
 * online status, and highlights if there is a new message from the user. It also handles
 * user selection and interaction.
 */

const ListItem = (props: ListItemProps) => {
  const { currentUser, user, handleClick, listItemActiveUid } = props;

  const [isNewUserMessage, setIsNewUserMessage] = useState(false);

  const dispatch = useAppDispatch();

  /**
   * Checks if there is a new message from the user and updates the state.
   * Also updates the Redux store to indicate if there is a new chat message.
   */
  useEffect(() => {
    if (user && user.userId === isNewMessage(user, currentUser)) {
      setIsNewUserMessage(true);
      dispatch(setIsNewChatMessage(true)); // The global state is needed for mobile view (there is an indicator that shows that there is a new message from some users)
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
        // Get active user id from state or localStorage (stable on refresh)
        (listItemActiveUid === user?.userId && "active") ||
        (activeUid === user?.userId && "active")
      } 

       ${isNewUserMessage && "new-message"}`}
    >
      <LoggedInIcon loggedIn={user?.loggedIn} />
      <h5>{user?.displayName}</h5>
    </li>
  );
};

export default memo(ListItem);
