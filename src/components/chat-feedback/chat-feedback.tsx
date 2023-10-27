import React, { useState } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import StyledButton from '../styled-components/styled-button';
import { useAppDispatch } from '../../store';
import { sendChatNpmRating, setFeedbackRatingGiven } from '../../slices/chat-slice';
import { StyledButtonType } from '../../constants';
import useChatSelector from '../../hooks/use-chat-selector';

const ChatFeedback = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { feedback } = useChatSelector();
  const [selectedFeedbackButtonValue, setSelectedFeedbackButtonValue] = useState<string>('');

  const handleFeedback = (feedbackRating: string | null) => {
    if (feedbackRating === null) return;
    setSelectedFeedbackButtonValue(feedbackRating);
    dispatch(sendChatNpmRating({ NpmRating: parseInt(feedbackRating, 10) }));
    dispatch(setFeedbackRatingGiven(true));
  };
  return (
    <ChatFeedbackStyle>
      <p className="feedback-paragraph above">{t('feedback.upperText', { organization: window._env_.ORGANIZATION_NAME })}</p>
      {feedback.showFeedbackWarning && <p className="missing-feeback">{t('feedback.warningText')}</p>}
      <div className="feedback-box-input">
        {Array.from(Array(11).keys()).map((val: number) => (
          <StyledButton
            className="feedback-btn"
            onClick={(e) => handleFeedback(e.currentTarget.textContent)}
            styleType={StyledButtonType.GRAY}
            key={val}
            active={selectedFeedbackButtonValue === val.toString()}
          >
            <span>{val}</span>
          </StyledButton>
        ))}
      </div>
      <p className="feedback-paragraph below">{t('feedback.lowerText')}</p>
    </ChatFeedbackStyle>
  );
};

const ChatFeedbackStyle = styled.div`
  height: auto;
  padding-top: 0.8em;

  border-top: 2px solid #f0f1f2;
  flex-direction: column;
  display: flex;
  color: blue;

  .feedback-paragraph {
    margin: 0 0.8em;
    font-size: 14px;
  }

  .feedback-paragraph.above:after {
    content: '*';
    color: #ff4800;
  }

  .feedback-btn {
    padding: 0.5rem;
    width: 32px;
    vertical-align: baseline;
    margin: 0;
  }

  .feedback-box-input {
    justify-content: space-around;
    display: flex;
    flex-flow: row nowrap;
    margin: 1rem 0.8em 2rem 0.8em;
  }

  .missing-feeback {
    color: #ff4800;
    margin: 0 0.8em -0.5rem 0.8em;
    font-size: 0.75rem;
  }
`;

export default ChatFeedback;
