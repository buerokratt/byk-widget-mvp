import { useEffect } from 'react';
import { useAppDispatch } from '../store';
import { setChat } from '../slices/chat-slice';
import chatService from '../services/chat-service';
import useChatSelector from './use-chat-selector';
import { Chat } from '../model/chat-model';
import sse from '../services/sse-service';

const useGetChat = (): void => {
  const { lastReadMessageTimestamp, isChatEnded, isChatRedirected, chatId } = useChatSelector();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!chatId || isChatEnded) return undefined;
    let events: EventSource | undefined;
      const onMessage = async () => {    
       const chat: Chat = await  chatService.getChat();
        if (chat !== undefined) {
         dispatch(setChat(chat))
       }
      };

      events = sse('/chat-list', onMessage);
    
    return () => {
      events?.close();
    };
  }, [dispatch, lastReadMessageTimestamp, chatId, isChatEnded, isChatRedirected]);

  useEffect(() => {
    if(isChatEnded || !chatId) {
      return;
    }

    chatService.getChat().then(chat => {
      dispatch(setChat(chat))
    });

  }, [isChatEnded, chatId]);
};

export default useGetChat;
