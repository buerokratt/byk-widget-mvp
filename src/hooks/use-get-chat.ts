import { useEffect } from 'react';
import { useAppDispatch } from '../store';
import { setChat } from '../slices/chat-slice';
import chatService from '../services/chat-service';
import useChatSelector from './use-chat-selector';

const useGetChat = (): void => {
  const { isChatEnded, chatId } = useChatSelector();
  const dispatch = useAppDispatch();

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
