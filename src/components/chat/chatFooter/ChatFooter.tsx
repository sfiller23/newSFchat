import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { PiNavigationArrowThin } from "react-icons/pi";

import { setWritingState } from "../../../redux/chat/chatThunk";
import { useAppDispatch } from "../../../redux/hooks/reduxHooks";

import type { User } from "../../../interfaces/auth";
import type { ChatObj } from "../../../interfaces/chat";
import { useUsers } from "../../../redux/chat/chatSelectors";
import { onFocusHandler, updateChat } from "../../../utils/chatHelpers";
import { getMessageObj } from "../../../utils/messageHelpers";
import "./_chat-footer.scss";

const ChatFooter = (props: { currentChat?: ChatObj; currentUser: User }) => {
  const { currentChat, currentUser } = props;

  const users = useUsers();

  const [messageText, setMessageText] = useState("");
  const [isChatActive, setIsChatActive] = useState(false);

  const dispatch = useAppDispatch();

  const bottomRef = useRef<HTMLSpanElement>(null);

  const [receiver, setReceiver] = useState<User>();

  const receiverId = localStorage.getItem("activeUid");

  useEffect(() => {
    bottomRef.current?.scrollIntoView();
  }, [bottomRef.current?.scrollIntoView]);

  useEffect(() => {
    if (currentChat?.chatId) {
      setIsChatActive(true);
    }
  }, [currentChat?.chatId]);

  useEffect(() => {
    if (receiverId) {
      const receiver = users.find((user) => user.userId === receiverId);
      if (receiver) setReceiver(receiver);
    }
  }, [receiverId, users]);

  const setWriting = (isWritingMode: boolean) => {
    if (currentChat && currentUser) {
      dispatch(
        setWritingState(isWritingMode, currentChat.chatId, currentUser.userId)
      );
    }
  };

  const sendMessage = async (
    currentUser: User,
    messageText: string,
    currentChat: ChatObj,
    receiver: User
  ) => {
    setWriting(false);
    const messageObj = getMessageObj(
      currentUser,
      messageText,
      currentChat.chatId
    );
    await updateChat(currentUser, receiver, messageObj, dispatch);
    setMessageText("");
  };

  const onChangeHandler = (e: ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value === "" || e.target.value === undefined) {
      setWriting(false);
    }
    setMessageText(e.target.value);
  };

  return (
    <div className="chat-footer">
      {isChatActive ? (
        <>
          <textarea
            className="input-box"
            placeholder="Enter Message..."
            value={messageText}
            onInput={() => {
              setWriting(true);
            }}
            onMouseLeave={() => {
              setWriting(false);
            }}
            onChange={(e) => {
              onChangeHandler(e);
            }}
            onFocus={() => {
              onFocusHandler(
                currentChat as ChatObj,
                currentUser,
                receiver as User,
                dispatch
              );
            }}
          />

          <button
            onClick={() =>
              sendMessage(
                currentUser,
                messageText,
                currentChat as ChatObj,
                receiver as User
              )
            }
            disabled={messageText ? false : true}
            className="send-button"
          >
            <PiNavigationArrowThin size={20} className="send-icon" />
          </button>
        </>
      ) : (
        <span ref={bottomRef} className="select-user-container">
          <h3>Please select a user to start messaging</h3>
        </span>
      )}
    </div>
  );
};

export default ChatFooter;
