import { useEffect, useRef, useState } from "react";
import { PiNavigationArrowThin } from "react-icons/pi";
import { setWritingState, updateChat } from "../../../redux/chat/chatThunk";
import { useAppDispatch } from "../../../redux/hooks/reduxHooks";

import { MessageStatus } from "../../../constants/enums";
import type { User } from "../../../interfaces/auth";
import type {
  ChatObj,
  Message as MessageProps,
} from "../../../interfaces/chat";
import {
  setCurrentChatMessage,
  type ChatState,
} from "../../../redux/chat/chatSlice";
import { setMessageSeen } from "../../../utils/common-functions";
import "./_chat-footer.scss";

const ChatFooter = (props: Partial<ChatState>) => {
  const { currentChat: chat, user } = props;

  const [messageText, setMessageText] = useState("");
  const [isChatActive, setIsChatActive] = useState(false);

  const bottomRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView();
  }, [bottomRef.current]);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (chat) {
      setIsChatActive(true);
    }
  }, [chat]);

  const setWriting = (isWritingMode: boolean) => {
    if (chat && user) {
      dispatch(
        setWritingState({
          isWriting: isWritingMode,
          chatId: chat.chatId,
          writerID: user?.userId,
        })
      );
    }
  };

  const sendMessage = () => {
    setWriting(false);
    if (user) {
      const messageObj: MessageProps = {
        displayName: user.displayName,
        userId: user.userId,
        text: messageText,
        sentTime: Date.now(),
        status: MessageStatus.SENT,
      };
      dispatch(setCurrentChatMessage(messageObj));
      if (chat) {
        if (chat.chatId) {
          dispatch(updateChat({ chatId: chat.chatId, message: messageObj }));
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
              setMessageSeen(chat as ChatObj, dispatch, user as User);
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
