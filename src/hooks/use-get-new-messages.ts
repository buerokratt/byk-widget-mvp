import { useEffect, useState } from 'react';
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
  const [sseUrl, setSseUrl] = useState('');
  const [lastReadMessageTimestampValue, setLastReadMessageTimestampValue] = useState('');

  useEffect(() => {
    if(lastReadMessageTimestamp && !lastReadMessageTimestampValue){
      setLastReadMessageTimestampValue(lastReadMessageTimestamp);
    }
  }, [lastReadMessageTimestamp]);

  useEffect(() => {
    if(isChatEnded) {
      setSseUrl('');
    }
    else if (chatId && lastReadMessageTimestampValue) {
      setSseUrl(`${RUUTER_ENDPOINTS.GET_NEW_MESSAGES}?chatId=${chatId}&timeRangeBegin=${lastReadMessageTimestampValue.split('+')[0]}`);
    }
  }, [isChatEnded, chatId, lastReadMessageTimestampValue]);

  useEffect(() => {
    let events: EventSource | undefined;

    if (sseUrl) {  
      const onMessage = (messages: Message[]) => {
        const newDisplayableMessages = messages.filter((msg) => msg.event !== CHAT_EVENTS.GREETING);
        const stateChangingEventMessages = messages.filter((msg) => isStateChangingEventMessage(msg));
        dispatch(addMessagesToDisplay(newDisplayableMessages));
        dispatch(handleStateChangingEventMessages(stateChangingEventMessages));
      };

      events = sse(sseUrl, onMessage);
    }
  
    return () => {
      events?.close();
    };
  }, [sseUrl]);
};

export default useGetNewMessages;
