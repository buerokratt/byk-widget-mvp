import React from 'react';
import { useTranslation } from 'react-i18next';
import { Message } from '../../../model/message-model';
import { AUTHOR_ROLES, CHAT_EVENTS } from '../../../constants';
import { sendMessageWithNewEvent, updateMessage } from '../../../slices/chat-slice';
import { useAppDispatch } from '../../../store';
import styles from '../chat-message.module.scss';

const PermissionMessage = (props: { message: Message }): JSX.Element => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { message } = props;

  const permissionResponse = (accepted: boolean) => {
    const responseMessage: Message = {
      ...message,
      event: accepted ? CHAT_EVENTS.ASK_PERMISSION_ACCEPTED : CHAT_EVENTS.ASK_PERMISSION_REJECTED,
      authorTimestamp: new Date().toISOString(),
      authorRole: AUTHOR_ROLES.END_USER,
      content: '',
    };
    dispatch(updateMessage(responseMessage));
    dispatch(sendMessageWithNewEvent(responseMessage));
  };

  return (
    <>
      <div>{t('notifications.ask-permission')}</div>
      <div className="buttons">
        <button onClick={() => permissionResponse(false)} type="button" className={styles['decline-event-button']}>
          {t('chatMessage.deny')}
        </button>
        <button onClick={() => permissionResponse(true)} type="button" className={styles['event-button']}>
          {t('chatMessage.accept')}
        </button>
      </div>
    </>
  );
};

export default PermissionMessage;
