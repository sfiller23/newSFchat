import { useEffect, useRef } from "react";
import { FaCheck, FaCheckDouble } from "react-icons/fa6";
import { MessageStatus } from "../../../constants/enums";
import type { User } from "../../../interfaces/auth";
import type { Message as MessageProps } from "../../../interfaces/chat";
import "./_message.scss";

const Message = (props: Partial<MessageProps> & { user: User }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  const { text, sentTime, status = MessageStatus.SENT, senderId, user } = props;

  useEffect(() => {
    bottomRef.current?.scrollIntoView();
  }, [bottomRef.current?.scrollIntoView]);

  return (
    <div
      ref={bottomRef}
      className={`message-container ${
        senderId === user?.userId ? "sender" : "receiver"
      }`}
    >
      <div className="message-text-container">
        <p>{text}</p>
      </div>
      <div className="message-date-time-container">
        <p>{new Date(sentTime as number).toLocaleString()}</p>

        {senderId === user?.userId && (
          <span>
            {status === MessageStatus.SENT && (
              <span>
                <FaCheck />
              </span>
            )}
            {status === MessageStatus.ARRIVED && (
              <span>
                <FaCheckDouble />
              </span>
            )}
            {status === MessageStatus.SEEN && (
              <span style={{ color: "#7ca67c" }}>
                <FaCheckDouble />
              </span>
            )}
          </span>
        )}
      </div>
    </div>
  );
};

export default Message;
