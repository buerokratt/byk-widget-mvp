import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { useAppDispatch } from '../../store';
import {
  addMessage,
  clearMessageQueue,
  initChat,
  queueMessage,
  sendFeedbackMessage,
  sendNewMessage,
  setFeedbackMessageGiven,
  setFeedbackWarning,
} from '../../slices/chat-slice';
import Send from '../../static/icons/send.svg';
import styles from './chat-keypad.module.scss';
import useChatSelector from '../../hooks/use-chat-selector';
import KeypadErrorMessage from './keypad-error-message';
import ChatKeypadCharCounter from './chat-keypad-char-counter';
import { AUTHOR_ROLES, CHAT_STATUS, MESSAGE_MAX_CHAR_LIMIT, MESSAGE_QUE_MAX_LENGTH, StyledButtonType } from '../../constants';
import { Message } from '../../model/message-model';
import StyledButton from '../styled-components/styled-button';

const ChatKeyPad = (): JSX.Element => {
  const [userInput, setUserInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isKeypadDisabled, setKeypadDisabled] = useState(false);
  const { feedback, chatId, loading, messageQueue, chatStatus } = useChatSelector();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const handleTextFeedback = () => {
    if (!feedback.isFeedbackRatingGiven) {
      dispatch(setFeedbackWarning(true));
      return;
    }
    dispatch(setFeedbackWarning(false));
    dispatch(sendFeedbackMessage({ userInput }));
    dispatch(setFeedbackMessageGiven(true));
    setKeypadDisabled(true);
  };
  useEffect(() => {
    if (messageQueue.length >= MESSAGE_QUE_MAX_LENGTH) {
      setKeypadDisabled(true);
    }
  }, [messageQueue]);

  useEffect(() => {
    if (chatId && !loading && messageQueue.length > 0) {
      messageQueue.forEach((message) => {
        setTimeout(() => {
          dispatch(sendNewMessage({ ...message, chatId }));
        }, 250);
      });
      dispatch(clearMessageQueue());
      setKeypadDisabled(false);
    }
  }, [chatId, dispatch, loading, messageQueue]);

  const isInputValid = () => {
    if (!userInput.trim()) return false;
    if (userInput.length >= MESSAGE_MAX_CHAR_LIMIT) {
      setErrorMessage(t('keypad.long-message-warning'));
      return false;
    }
    return true;
  };

  const addNewMessageToState = (): void => {
    if (!isInputValid()) return;
    const message: Message = {
      chatId,
      content: userInput,
      authorTimestamp: new Date().toISOString(),
      authorRole: AUTHOR_ROLES.END_USER,
    };

    dispatch(addMessage(message));
    setUserInput('');

    if (!chatId && !loading) {
      dispatch(initChat(message));
    }
    if (loading) {
      dispatch(queueMessage(message));
    }
    if (chatId) {
      dispatch(sendNewMessage(message));
    }
  };
  const keypadClasses = classNames(styles.keypad);
  return (
    <div>
      <KeypadErrorMessage>{errorMessage}</KeypadErrorMessage>
      <div className={`${keypadClasses}`}>
        <input
          disabled={isKeypadDisabled}
          aria-label={t('keypad.input.label')}
          className={`${styles.input}`}
          value={userInput}
          placeholder={t('keypad.input.placeholder')}
          onChange={(e) => {
            setUserInput(e.target.value);
            setErrorMessage('');
          }}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              if (chatStatus === CHAT_STATUS.ENDED && !!chatId) handleTextFeedback();
              else {
                event.preventDefault();
                addNewMessageToState();
              }
            }
          }}
        />
        {chatStatus === CHAT_STATUS.ENDED && !!chatId ? (
          <FeedbackButtonStyle onClick={() => handleTextFeedback()} styleType={StyledButtonType.GRAY}>
            {t('chat.feedback.button.label')}
          </FeedbackButtonStyle>
        ) : (
          <div
            onKeyPress={addNewMessageToState}
            onClick={addNewMessageToState}
            className={styles.button}
            title={t('keypad.button.label')}
            aria-label={t('keypad.button.label')}
            role="button"
            tabIndex={0}
          >
            <img src={Send} alt="Send icon" />
          </div>
        )}
      </div>
      <ChatKeypadCharCounter userInput={userInput} />
    </div>
  );
};

const FeedbackButtonStyle = styled(StyledButton)`
  padding: 0.5rem 1rem;
`;

export default ChatKeyPad;
