import LoggedInIcon from "../../../UI/loggedInIcon/loggedInIcon";
import type { User } from "../../../interfaces/auth";
import type { ChatObj } from "../../../interfaces/chat";
import { useUsers } from "../../../redux/chat/chatSelectors";
import "./_chat-header.scss";

const ChatHeader = (props: { currentChat: ChatObj; currentUser: User }) => {
  const { currentChat, currentUser } = props;

  const users = useUsers();

  return (
    <div className="chat-header">
      <>
        {currentChat?.writing?.status &&
          currentChat.writing.writerID !== currentUser?.userId && (
            <span className="writing-gif-container">
              <img src="/writing.gif" alt="Writing..." />
            </span>
          )}
        {currentChat.chatId &&
          (currentChat.admin?.userId !== currentUser?.userId ? (
            <>
              <span className="logged-in-icon-container">
                {" "}
                <LoggedInIcon
                  loggedIn={
                    users?.find(
                      (user) => user.userId === currentChat.admin?.userId
                    )?.loggedIn
                  }
                />
              </span>
              <span>
                <h3>{currentChat.admin?.displayName}</h3>
              </span>
            </>
          ) : (
            <>
              <span className="logged-in-icon-container">
                <LoggedInIcon
                  loggedIn={
                    users.find(
                      (user) => user.userId === currentChat.participant.userId
                    )?.loggedIn
                  }
                />
              </span>
              <span>
                <h3>{currentChat.participant?.displayName}</h3>
              </span>
            </>
          ))}
      </>
    </div>
  );
};

export default ChatHeader;
