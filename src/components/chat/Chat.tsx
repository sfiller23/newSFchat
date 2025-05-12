import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { db } from "../../api/firebase/api";
import type { User } from "../../interfaces/auth";
import { useCurrentChat } from "../../redux/chat/chatSelectors";
import { setCurrentChat } from "../../redux/chat/chatSlice";
import { useAppDispatch } from "../../redux/hooks/reduxHooks";
import "./_chat.scss";
import ChatFooter from "./chatFooter/ChatFooter";
import ChatHeader from "./chatHeader/ChatHeader";
import Message from "./message/Message";

const Chat = (props: { currentUser: User }) => {
  const { currentUser } = props;

  const dispatch = useAppDispatch();

  const currentChat = useCurrentChat();

  const [currentChatId, setCurrentChatId] = useState("");

  const chatId = localStorage.getItem("chatId");
  //const [chat, setChat] = useState<ChatObj>();

  //const location = useLocation();

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatId) {
      // (async () => {
      //   if (currentChatId !== chatId) {
      //     await dispatch(getChatById(chatId));
      setCurrentChatId(chatId);
      //   }
      // })();
    }
  }, [chatId]);

  // useEffect(() => {
  //   if (currentChat) {
  //     setChat(chats[currentChat.chatId]);
  //   }
  // }, [chats, currentChat]);

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
  }, [currentChatId]);

  return (
    <>
      <ChatHeader currentChat={currentChat} currentUser={currentUser} />
      <div ref={scrollRef} className="chat-message-board-container">
        <div className="chat-message-board">
          {currentChat &&
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
