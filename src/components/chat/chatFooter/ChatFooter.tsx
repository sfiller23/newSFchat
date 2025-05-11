import { useEffect, useRef, useState } from "react";
import { PiNavigationArrowThin } from "react-icons/pi";
import { v4 as uid } from "uuid";
import {
  getUserById,
  sendNewMessage,
  setMessageArrived,
  setWritingState,
} from "../../../redux/chat/chatThunk";
import { useAppDispatch } from "../../../redux/hooks/reduxHooks";

import { MessageStatus } from "../../../constants/enums";
import type { User } from "../../../interfaces/auth";
import type {
  ChatObj,
  Message as MessageProps,
} from "../../../interfaces/chat";
import { addMessage, type ChatState } from "../../../redux/chat/chatSlice";
import { setMessageSeen } from "../../../utils/common-functions";
import "./_chat-footer.scss";
import { getUpdateUserChatIds } from "./utils/functions";

const ChatFooter = (props: Partial<ChatState>) => {
  const { currentChat, user } = props;

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
    if (currentChat) {
      setIsChatActive(true);
    }
  }, [currentChat]);

  useEffect(() => {
    if (receiverId) {
      (async () => {
        const userFromList = await dispatch(getUserById(receiverId));
        if (userFromList) {
          setReceiver(userFromList as User);
        }
      })();
    }
  }, [receiverId]);

  const setWriting = (isWritingMode: boolean) => {
    if (currentChat && user) {
      dispatch(
        setWritingState({
          isWriting: isWritingMode,
          chatId: currentChat.chatId,
          writerID: user?.userId,
        })
      );
    }
  };

  const sendMessage = async () => {
    setWriting(false);
    const messageId = uid();
    if (user) {
      const messageObj: MessageProps = {
        messageId: messageId,
        displayName: user.displayName,
        text: messageText,
        sentTime: Date.now(),
        status: MessageStatus.SENT,
        chatId: currentChat?.chatId as string,
        senderId: user.userId,
      };
      if (currentChat) {
        if (currentChat.chatId && receiver && user) {
          dispatch(addMessage(messageObj));
          const updatedAdmin = getUpdateUserChatIds(user, messageObj);
          const updatedParticipant = getUpdateUserChatIds(receiver, messageObj);
          await dispatch(
            sendNewMessage(messageObj, updatedAdmin, updatedParticipant)
          );
          //If sending message did't failed, it's arrived;
          await dispatch(setMessageArrived(messageObj.chatId));
        }
      }
      setMessageText("");
    }
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
              if (e.target.value === "" || e.target.value === undefined) {
                setWriting(false);
              }
              setMessageText(e.target.value);
            }}
            onFocus={() => {
              setMessageSeen(currentChat as ChatObj, dispatch, user as User);
            }}
          />

          <button
            onClick={sendMessage}
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
