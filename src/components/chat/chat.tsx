import { motion } from "framer-motion";
import React, { memo, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import useChatSelector from "../../hooks/use-chat-selector";
import { FEEDBACK_CONFIRMATION_TIMEOUT, CHAT_MODES } from "../../constants";
import ChatContent from "../chat-content/chat-content";
import ChatHeader from "../chat-header/chat-header";
import ChatKeyPad from "../chat-keypad/chat-keypad";
import ConfirmationModal from "../confirmation-modal/confirmation-modal";
import styles from "./chat.module.scss";
import { useAppDispatch } from "../../store";
import {
  getEstimatedWaitingTime,
  getGreeting,
  resetState,
  setEstimatedWaitingTimeToZero,
  setIsFeedbackConfirmationShown,
} from "../../slices/chat-slice";
import WarningNotification from "../warning-notification/warning-notification";
import ChatFeedback from "../chat-feedback/chat-feedback";
import ChatFeedbackConfirmation from "../chat-feedback/chat-feedback-confirmation";
import WaitingTimeNotification from "../waiting-time-notification/waiting-time-notification";
import EndUserContacts from "../end-user-contacts/end-user-contacts";
import WidgetDetails from "../chat-header/widget-details";
import useAuthenticationSelector from "../../hooks/use-authentication-selector";

const Chat = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const [showWidgetDetails, setShowWidgetDetails] = useState(false);
  const [showFeedbackResult, setShowFeedbackResult] = useState(false);
  const { t } = useTranslation();
  const { isAuthenticated } = useAuthenticationSelector();
  const {
    isChatEnded,
    chatId,
    messageQueue,
    estimatedWaiting,
    showContactForm,
    customerSupportId,
    feedback,
    messages,
    chatMode,
  } = useChatSelector();

  useEffect(() => {
    if (
      feedback.isFeedbackRatingGiven &&
      feedback.isFeedbackMessageGiven &&
      !feedback.isFeedbackConfirmationShown
    ) {
      setShowFeedbackResult(true);
      setTimeout(async () => {
        dispatch(setIsFeedbackConfirmationShown(true));
        setShowFeedbackResult(false);
        dispatch(resetState());
      }, FEEDBACK_CONFIRMATION_TIMEOUT);
    }
  }, [
    dispatch,
    feedback.isFeedbackConfirmationShown,
    feedback.isFeedbackMessageGiven,
    feedback.isFeedbackRatingGiven,
  ]);

  useEffect(() => {
    if (!chatId && !feedback.isFeedbackConfirmationShown && !messages.length)
      dispatch(getGreeting());
  }, [dispatch, chatId, feedback.isFeedbackConfirmationShown, messages]);

  useEffect(() => {
    if (customerSupportId !== "") dispatch(setEstimatedWaitingTimeToZero());
    else if (estimatedWaiting.time === 0) dispatch(getEstimatedWaitingTime());
  }, [estimatedWaiting.time, dispatch, customerSupportId]);

  return (
    <div className={styles.chatWrapper}>
      <motion.div
        className={`${styles.chat} ${
          isAuthenticated ? styles.authenticated : ""
        }`}
        style={{ y: 400 }}
        animate={{ y: 0 }}
      >
        <ChatHeader
          isDetailSelected={showWidgetDetails}
          detailHandler={() => setShowWidgetDetails(!showWidgetDetails)}
        />
        {messageQueue.length >= 5 && (
          <WarningNotification warningMessage={t("chat.error-message")} />
        )}
        {estimatedWaiting.time > 0 &&
          estimatedWaiting.isActive &&
          !showWidgetDetails && <WaitingTimeNotification />}
        {showWidgetDetails && <WidgetDetails />}
        {!showWidgetDetails && showContactForm && <EndUserContacts />}
        {!showWidgetDetails && !showContactForm && <ChatContent />}
        {showFeedbackResult ? (
          <ChatFeedbackConfirmation />
        ) : (
          <>
            {!showWidgetDetails &&
              !showContactForm &&
              !feedback.isFeedbackConfirmationShown &&
              isChatEnded &&
              chatId && <ChatFeedback />}
            {!showWidgetDetails &&
              !showContactForm &&
              !feedback.isFeedbackConfirmationShown &&
              chatMode === CHAT_MODES.FREE && <ChatKeyPad />}
            <ConfirmationModal />
          </>
        )}
      </motion.div>
    </div>
  );
};

export default memo(Chat);
