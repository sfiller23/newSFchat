import LoggedInIcon from "../../../UI/loggedInIcon/loggedInIcon";
import type { User } from "../../../interfaces/auth";
import type { ChatObj } from "../../../interfaces/chat";
import { useUsers } from "../../../redux/chat/chatSelectors";
import "./_chat-header.scss";

/**
 * ChatHeader Component
 * This component displays the header of the chat interface, including the name of the chat participant,
 * their online status, and a "writing" indicator if the participant is typing.
 */

const ChatHeader = (props: { currentChat?: ChatObj; currentUser: User }) => {
  const { currentChat, currentUser } = props;

  const users = useUsers();

  return (
    <div className="chat-header">
      <>
        {/* Display a "writing" indicator if the other participant is typing */}
        {currentChat?.writing?.status &&
          currentChat.writing.writerID !== currentUser?.userId && ( // Show it but not to me
            <span className="writing-gif-container">
              <img src="/writing.gif" alt="Writing..." />
            </span>
          )}
        {/* Display the chat display name and online status respectively to the side i am */}
        {currentChat?.chatId &&
          (currentChat.admin?.userId !== currentUser?.userId ? ( //He's side
            <>
              <span className="logged-in-icon-container">
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
            // my side
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
