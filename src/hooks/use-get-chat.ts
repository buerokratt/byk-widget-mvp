import { useEffect } from 'react';
import { useAppDispatch } from '../store';
import { setChat } from '../slices/chat-slice';
import { Chat } from '../model/chat-model';
import chatService from '../services/chat-service';
import useChatSelector from './use-chat-selector';

const useGetChat = (): void => {
  const { isChatEnded, chatId } = useChatSelector();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if(isChatEnded || !chatId) {
      return;
    }

    chatService.getChatById(chatId).then((chat) => {
      dispatch(setChat(chat));
    });
  }, [isChatEnded, chatId]);
};

export default useGetChat;
