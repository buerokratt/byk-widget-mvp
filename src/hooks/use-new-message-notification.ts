import { useEffect, useState } from 'react';
import { useAppDispatch } from '../store';

import dingAudio from '../static/ding.mp3';
import { resetNewMessagesAmount } from '../slices/chat-slice';
import useChatSelector from './use-chat-selector';

const useNewMessageNotification = (): void => {
  const dispatch = useAppDispatch();
  const [dingEffect] = useState(new Audio(dingAudio));
  const { isChatOpen, newMessagesAmount } = useChatSelector();

  useEffect(() => {
    if (newMessagesAmount !== 0 && (!isChatOpen || document.hidden)) {
      dingEffect.play();
    }
    if (isChatOpen) {
      dispatch(resetNewMessagesAmount());
    }
  }, [dingEffect, isChatOpen, newMessagesAmount]);
};

export default useNewMessageNotification;
