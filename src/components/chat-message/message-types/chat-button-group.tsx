import React, { useMemo, useState } from 'react';
import { Message } from '../../../model/message-model';
import { AUTHOR_ROLES, CHAT_MODES } from '../../../constants';
import { useAppDispatch } from '../../../store';
import { addMessage, initChat, queueMessage, sendNewMessage } from '../../../slices/chat-slice';
import useChatSelector from '../../../hooks/use-chat-selector';
import styles from '../chat-message.module.scss';

type MessageButton = {
  title: string;
  payload: string;
}

const ChatButtonGroup = ({ message }: { message: Message }): JSX.Element => {
  const dispatch = useAppDispatch();
  const { chatId, loading, chatMode, messages } = useChatSelector();

  const parsedButtons: MessageButton[] = useMemo(() => {
    try {
      return JSON.parse(decodeURIComponent(message.buttons!)) as MessageButton[];
    } catch(e) {
      console.error(e);
      return [];
    }
  }, [message.buttons]);

  const addNewMessageToState = (buttonPayload: string): void => {
    const message: Message = {
      chatId,
      content: buttonPayload,
      authorTimestamp: new Date().toISOString(),
      authorRole: AUTHOR_ROLES.END_USER,
    };

    dispatch(addMessage(message));

    if (!chatId && !loading) {
      dispatch(initChat(message));
    }
    if (loading) {
      dispatch(queueMessage(message));
    }
    if (chatId) {
      dispatch(sendNewMessage(message));
    }
  }

  const enabled = messages[messages.length - 1] === message && chatMode === CHAT_MODES.FLOW;


  return (
    <div className={styles.buttonsRow}>
      {parsedButtons?.map(({ title, payload }) => (
        <button
          key={payload}
          type="button"
          className={styles['action-button']}
          onClick={() => addNewMessageToState(payload)}
          disabled={!enabled}
        >
          {title}
        </button>
      ))}
    </div>
  );
}

export default ChatButtonGroup;
