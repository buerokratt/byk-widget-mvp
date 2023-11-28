import { useEffect, useState } from 'react';
import { useAppDispatch } from '../store';
import sse from '../services/sse-service';
import useChatSelector from './use-chat-selector';
import { RUUTER_ENDPOINTS } from '../constants';
import { setChat } from '../slices/chat-slice';
import { Chat } from '../model/chat-model';

const useGetChat = (): void => {
  const { chatId, isChatEnded, } = useChatSelector();
  const dispatch = useAppDispatch();
  const [sseUrl, setSseUrl] = useState('');

  useEffect(() => {
    if (isChatEnded || !chatId){
      setSseUrl('');
    } else if(chatId) {
      setSseUrl(`${RUUTER_ENDPOINTS.GET_CHAT_BY_ID}?id=${chatId}`);
    }
  },[chatId, isChatEnded]);

  useEffect(() => {
    let events: EventSource | undefined;
    if (sseUrl){
      events = sse(
        sseUrl,
        (data: Chat) => dispatch(setChat(data))
      );
    }
    return () => {
      events?.close();
    };
  }, [sseUrl]);
};

export default useGetChat;
