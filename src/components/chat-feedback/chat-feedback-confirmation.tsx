import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import SmileIcon from '../../static/icons/smiling_buerokratt.svg';
import { FEEDBACK_CONFIRMATION_TIMEOUT } from '../../constants';

const ChatFeedbackConfirmation = (): JSX.Element => {
  const { t } = useTranslation();

  return (
    <FeedbackConfirmationStyle>
      <div className="smile-icon">
        <img src={SmileIcon} alt="Smile icon" />
        <h2 className="feedback-confirmation-message">{t('feedback.confirmationText')}</h2>
      </div>
      <TimeoutBar timeout={`${FEEDBACK_CONFIRMATION_TIMEOUT}ms`} />
    </FeedbackConfirmationStyle>
  );
};
export default ChatFeedbackConfirmation;

const FeedbackConfirmationStyle = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 2rem 0;

  .feedback-confirmation-message {
    padding: 1rem 0;
    color: #003cff;
  }

  .smile-icon {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
`;

const TimeoutBar = styled.div<{ timeout: string }>`
  position: relative;
  margin-bottom: -1rem;
  width: 100%;
  display: flex;

  ::after {
    animation: timeout ${(props) => props.timeout} forwards linear;
    background-color: #003cff;
    content: '';
    height: 1rem;
    position: absolute;
  }

  @keyframes timeout {
    from {
      width: 100%;
    }
    to {
      width: 0;
    }
  }
`;
