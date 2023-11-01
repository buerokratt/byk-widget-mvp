import { useEffect } from 'react';
import { useAppDispatch } from '../store';
import sse from '../services/sse-service';
import useChatSelector from './use-chat-selector';
import { RUUTER_ENDPOINTS } from '../constants';
import { setChat } from '../slices/chat-slice';
import { Chat } from '../model/chat-model';

const useGetChat = (): void => {
  const { lastReadMessageTimestamp, isChatEnded, isChatRedirected, chatId } = useChatSelector();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!chatId || isChatEnded) return undefined;

    const events = sse(
      `${RUUTER_ENDPOINTS.GET_CHAT_BY_ID}?id=${chatId}`,
      (data: Chat) => dispatch(setChat(data))
    );

    return () => {
      events.close();
    };
  }, [dispatch, lastReadMessageTimestamp, chatId, isChatEnded, isChatRedirected]);
};

export default useGetChat;
