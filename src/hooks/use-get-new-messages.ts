import { useCallback, useEffect, useState } from 'react';
import { useAppDispatch } from '../store';
import sse from '../services/sse-service';
import useChatSelector from './use-chat-selector';
import { Message } from '../model/message-model';
import { addMessagesToDisplay, handleStateChangingEventMessages } from '../slices/chat-slice';
import { isStateChangingEventMessage, notGreetingMessages } from '../utils/state-management-utils';
import chatService from '../services/chat-service';
import { CHAT_EVENTS } from '../constants';

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
    if(isChatEnded || !chatId) {
      setSseUrl('');
    }
    else if (chatId && lastReadMessageTimestampValue) {
      setSseUrl(`/${chatId}`);
    }
  }, [isChatEnded, chatId, lastReadMessageTimestampValue]);

  useEffect(() => {
    let events: EventSource | undefined;
    if (sseUrl) {  
      const onMessage = async () => {    
        const messages: Message[] = await chatService.getNewMessages(chatId ?? "",lastReadMessageTimestampValue.split('+')[0]);
        if (messages.length != 0) {
         setLastReadMessageTimestampValue(messages[messages.length - 1].created ?? `${lastReadMessageTimestamp}`);
         const newDisplayableMessages = messages.filter((msg) => msg.event !== CHAT_EVENTS.GREETING);
         const stateChangingEventMessages = messages.filter((msg) => isStateChangingEventMessage(msg));
         dispatch(addMessagesToDisplay(newDisplayableMessages));
         dispatch(handleStateChangingEventMessages(stateChangingEventMessages));
        }
      };

      events = sse(sseUrl, onMessage);
    }
    return () => {
      events?.close();
    };
  }, [sseUrl]);
  
};

export default useGetNewMessages;
