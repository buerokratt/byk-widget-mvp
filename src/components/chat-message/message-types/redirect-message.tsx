import React from "react";
import { useTranslation } from "react-i18next";
import { Message } from "../../../model/message-model";
import { CHAT_EVENTS } from "../../../constants";
import {
  generateForwardingRequest,
  removeChatForwardingValue,
  sendMessageWithNewEvent,
  updateMessage,
} from "../../../slices/chat-slice";
import { useAppDispatch } from "../../../store";
import styles from "../chat-message.module.scss";

const RedirectMessage = (props: { message: Message }): JSX.Element => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { message } = props;

  const redirectResponse = (accepted: boolean) => {
    const responseMessage: Message = {
      ...message,
      event: accepted
        ? CHAT_EVENTS.REQUESTED_CHAT_FORWARD_ACCEPTED
        : CHAT_EVENTS.REQUESTED_CHAT_FORWARD_REJECTED,
      authorTimestamp: new Date().toISOString(),
      content: "",
    };
    dispatch(updateMessage(responseMessage));
    dispatch(sendMessageWithNewEvent(responseMessage));

    if (accepted) {
      dispatch(generateForwardingRequest());
    } else {
      dispatch(removeChatForwardingValue());
    }
  };

  return (
    <>
      <div>{t("redirect.ask-permission")}</div>
      <div className="buttons">
        <button
          onClick={() => redirectResponse(false)}
          type="button"
          className={styles["redirect-event-button"]}
        >
          {t("chatMessage.deny")}
        </button>
        <button
          onClick={() => redirectResponse(true)}
          type="button"
          className={styles["redirect-event-button"]}
        >
          {t("chatMessage.accept")}
        </button>
      </div>
    </>
  );
};

export default RedirectMessage;
