import { useAppSelector } from '../store';
import { CHAT_STATUS } from '../constants';
import { ChatState } from '../slices/chat-slice';

interface ExtraProps {
  isChatEnded: boolean;
}

const useChatSelector = (): ChatState & ExtraProps => {
  const chatState = useAppSelector(({ chat }) => chat);
  const extraProps = {
    isChatEnded: chatState?.chatStatus === CHAT_STATUS.ENDED,
  };
  return { ...chatState, ...extraProps };
};

export default useChatSelector;
