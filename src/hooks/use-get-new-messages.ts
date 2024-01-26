import { useCallback, useEffect, useState } from 'react';
import { useAppDispatch } from '../store';
import sse from '../services/sse-service';
import useChatSelector from './use-chat-selector';
import { Message } from '../model/message-model';
import { addMessagesToDisplay, handleStateChangingEventMessages } from '../slices/chat-slice';
import { isStateChangingEventMessage, notGreetingMessages } from '../utils/state-management-utils';

const useGetNewMessages = (): void => {
  const { isChatEnded, chatId } = useChatSelector();
  const dispatch = useAppDispatch();
  const [sseUrl, setSseUrl] = useState('');

  const onMessage = useCallback((messages: Message[]) => {
    const newDisplayableMessages = messages.filter(notGreetingMessages);
    const stateChangingEventMessages = messages.filter(isStateChangingEventMessage);
    dispatch(addMessagesToDisplay(newDisplayableMessages));
    dispatch(handleStateChangingEventMessages(stateChangingEventMessages));
  }, [dispatch]);

  useEffect(() => {
    if(isChatEnded)
      setSseUrl('')
    else if (chatId)
      setSseUrl(`/${chatId}`);
  }, [isChatEnded, chatId]);

  useEffect(() => {
    const events = sseUrl ? sse(sseUrl, onMessage) : null;
  
    return () => { 
      events?.close();
    }
  }, [sseUrl]);
};

export default useGetNewMessages;
