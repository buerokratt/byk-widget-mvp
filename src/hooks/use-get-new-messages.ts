import { useEffect } from 'react';
import { useAppDispatch } from '../store';
import sse from '../services/sse-service';
import useChatSelector from './use-chat-selector';
import { Message } from '../model/message-model';
import { CHAT_EVENTS, RUUTER_ENDPOINTS } from '../constants';
import { addMessagesToDisplay, handleStateChangingEventMessages } from '../slices/chat-slice';
import { isStateChangingEventMessage } from '../utils/state-management-utils';

const useGetNewMessages = (): void => {
  const { lastReadMessageTimestamp, isChatEnded, chatId } = useChatSelector();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!chatId || isChatEnded || !lastReadMessageTimestamp) return undefined;
    const sseInstance = sse(`${RUUTER_ENDPOINTS.GET_NEW_MESSAGES}?chatId=${chatId}&timeRangeBegin=${lastReadMessageTimestamp.split('+')[0]}`);

    sseInstance.onMessage((messages: Message[]) => {
      const newDisplayableMessages = messages.filter((msg) => msg.event !== CHAT_EVENTS.GREETING);
      const stateChangingEventMessages = messages.filter((msg) => isStateChangingEventMessage(msg));
      dispatch(addMessagesToDisplay(newDisplayableMessages));
      dispatch(handleStateChangingEventMessages(stateChangingEventMessages));
    });

    return () => sseInstance.close();
  }, [dispatch, lastReadMessageTimestamp, chatId, isChatEnded]);
};

export default useGetNewMessages;
