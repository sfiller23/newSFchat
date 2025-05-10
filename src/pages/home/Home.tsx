import { useEffect, useState } from "react";
import Chat from "../../components/chat/Chat";
import UserHeader from "../../components/user/userHeader/UserHeader";
import UserList from "../../components/user/userList/UserList";
import UserSearch from "../../components/user/userSearch/UserSearch";
import { selectUser } from "../../redux/chat/chatSelectors";
import { getUser } from "../../redux/chat/chatThunk";
import { useAppDispatch, useAppSelector } from "../../redux/hooks/reduxHooks";
import Card from "../../UI/card/Card";
import "./_home.scss";

const Home = () => {
  const dispatch = useAppDispatch();

  const user = useAppSelector(selectUser);

  //const chats = useAppSelector((state) => state.chatReducer.chats);

  const [toggleCollapseButton, setToggleCollapseButton] = useState(false);
  //const [newMessage, setNewMessage] = useState(false);

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (userId) {
      (async () => {
        await dispatch(getUser(userId));
      })();
    }
    // dispatch is a stable function no need to include it
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  // useEffect(() => {
  //   setNewMessage(!!isNewMessage(user as User, user as User, chats));
  // }, [user]);

  return (
    <Card classNames={["chat-card"]}>
      <span
        className={`users-container ${toggleCollapseButton ? "open" : "close"}`}
      >
        <UserHeader user={user} />
        <UserSearch />
        <UserList user={user} />
      </span>
      <span
        className={`collapse-button-container ${
          toggleCollapseButton && "open"
        } `}
      >
        {/* <button
          onClick={() => setToggleCollapseButton((s) => !s)}
          className={`collapse-button ${
            newMessage && toggleCollapseButton ? "new-message" : ""
          }`}
        >
          <TbLayoutSidebarLeftCollapseFilled
            className={`collapse-icon ${
              toggleCollapseButton ? "open" : "close"
            }`}
          />
        </button> */}
      </span>
      <span className="chat-container">
        <Chat user={user} />
      </span>
    </Card>
  );
};

export default Home;
