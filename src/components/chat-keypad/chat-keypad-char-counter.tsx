import React, { ReactElement } from 'react';
import styled, { css } from 'styled-components';
import {
  CHAT_STATUS,
  FEEDBACK_MESSAGE_LIMIT_VISIBILE_AT,
  FEEDBACK_MESSAGE_LIMIT_WARNING_AT,
  FEEDBACK_MESSAGE_MAX_CHAR_LIMIT,
  MESSAGE_MAX_CHAR_LIMIT,
  MESSAGE_VISIBILITY_LIMIT,
  MESSAGE_WARNING_LIMIT,
} from '../../constants';
import useChatSelector from '../../hooks/use-chat-selector';

interface ChatKeypadCharCounterType {
  userInput: string;
}

const ChatKeypadCharCounter = (props: ChatKeypadCharCounterType): ReactElement => {
  const { chatStatus } = useChatSelector();
  let maxCharLimit;
  let charWarningLimit;
  let charVisibilityLimit;

  if (chatStatus === CHAT_STATUS.ENDED) {
    maxCharLimit = FEEDBACK_MESSAGE_MAX_CHAR_LIMIT;
    charWarningLimit = FEEDBACK_MESSAGE_LIMIT_WARNING_AT;
    charVisibilityLimit = FEEDBACK_MESSAGE_LIMIT_VISIBILE_AT;
  } else {
    maxCharLimit = MESSAGE_MAX_CHAR_LIMIT;
    charWarningLimit = MESSAGE_WARNING_LIMIT;
    charVisibilityLimit = MESSAGE_VISIBILITY_LIMIT;
  }

  const { userInput = '' } = props;
  const currentCount = userInput.length;

  return (
    <ChatKeypadCharCounterStyle warning={currentCount >= charWarningLimit} isVisible={currentCount >= charVisibilityLimit}>
      {currentCount}/{maxCharLimit}
    </ChatKeypadCharCounterStyle>
  );
};

const grayVariant = css`
  color: #a7a9ab;
`;
const orangeVariant = css`
  color: #ff4800;
`;

const ChatKeypadCharCounterStyle = styled.div<{ warning: boolean; isVisible: boolean }>`
  ${(props) => (props.warning ? orangeVariant : grayVariant)}
  visibility: ${(props) => (props.isVisible ? 'visible' : 'hidden')};
  font-size: 0.7rem;
  margin: -0.5rem 3.5rem 0.25rem 0;
  display: flex;
  justify-content: flex-end;
`;

export default ChatKeypadCharCounter;
