import { useEffect, useRef } from "react";
import { FaCheck, FaCheckDouble } from "react-icons/fa6";
import { MessageStatus } from "../../../constants/enums";
import type { User } from "../../../interfaces/auth";
import type { Message as MessageProps } from "../../../interfaces/chat";
import "./_message.scss";

/**
 * Message Component
 * This component represents an individual chat message. It displays the message text,
 * the time it was sent, and the delivery status (e.g., sent, arrived, seen).
 * It also differentiates between messages sent by the current user and received messages.
 */

const Message = (props: Partial<MessageProps> & { currentUser: User }) => {
  const {
    text,
    sentTime,
    status = MessageStatus.SENT,
    senderId,
    currentUser,
  } = props;

  const bottomRef = useRef<HTMLDivElement>(null);

  /**
   * Scrolls the message into view when it is rendered.
   */
  useEffect(() => {
    bottomRef.current?.scrollIntoView();
  }, [bottomRef.current?.scrollIntoView]);

  return (
    <div
      ref={bottomRef}
      className={`message-container ${
        senderId === currentUser?.userId ? "sender" : "receiver"
      }`}
    >
      <div className="message-text-container">
        <p>{text}</p>
      </div>
      <div className="message-date-time-container">
        <p>{new Date(sentTime as number).toLocaleString()}</p>

        {/* Display the message status if the current user is the sender */}
        {senderId === currentUser?.userId && (
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
