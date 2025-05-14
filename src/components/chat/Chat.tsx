import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../api/firebase/api";
import type { User } from "../../interfaces/auth";
import { useCurrentChat } from "../../redux/chat/chatSelectors";
import { setCurrentChat } from "../../redux/chat/chatSlice";
import { useAppDispatch } from "../../redux/hooks/reduxHooks";
import "./_chat.scss";
import ChatFooter from "./chatFooter/ChatFooter";
import ChatHeader from "./chatHeader/ChatHeader";
import Message from "./message/Message";

/**
 * Chat Component
 * This component represents the main chat interface. It includes the chat header, message board, and footer.
 * It handles real-time updates to the chat using Firebase Firestore and displays messages dynamically.
 */

const Chat = (props: { currentUser: User }) => {
  const { currentUser } = props;

  const dispatch = useAppDispatch();

  const currentChat = useCurrentChat();

  const [currentChatId, setCurrentChatId] = useState("");

  const chatId = localStorage.getItem("chatId");

  /**
   * Sets the current chat ID from localStorage when the component mounts (on click event on a user from the list).
   */
  useEffect(() => {
    if (chatId) {
      setCurrentChatId(chatId);
    }
  }, [chatId]);

  /**
   * Subscribes to real-time updates for the current chat from Firebase Firestore.
   * Updates the Redux store with the latest chat data.
   */
  useEffect(() => {
    const q = query(
      collection(db, "chats"),
      where("chatId", "==", currentChatId)
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const chat = querySnapshot
        .docChanges()
        .find((chat) => chat.doc.data().chatId === currentChatId);
      dispatch(setCurrentChat(chat?.doc.data()));
    });
    return () => {
      unsubscribe();
    };
    // dispatch is a stable function no need to include it
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentChatId]);

  return (
    <>
      <ChatHeader currentChat={currentChat} currentUser={currentUser} />
      <div className="chat-message-board-container">
        <div className="chat-message-board">
          {currentChat && //validations
            currentChat.messages?.length !== 0 &&
            currentChat.messages?.map((message) => {
              return (
                <Message
                  key={message.sentTime}
                  text={message.text}
                  sentTime={message.sentTime}
                  senderId={message.senderId}
                  status={message.status}
                  currentUser={currentUser}
                />
              );
            })}
        </div>
      </div>
      <ChatFooter currentChat={currentChat} currentUser={currentUser} />
    </>
  );
};

export default Chat;
