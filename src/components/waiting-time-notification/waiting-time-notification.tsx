import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import useChatSelector from '../../hooks/use-chat-selector';

const WaitingTimeNotification = (): JSX.Element => {
  const { t } = useTranslation();
  const { estimatedWaiting } = useChatSelector();

  return (
    <WaitingTimeStyles>
      <div>{t('notifications.customer-service-busy')}</div>
      <div>{t('notifications.waiting-time', { time: estimatedWaiting.time })}</div>
    </WaitingTimeStyles>
  );
};

const WaitingTimeStyles = styled.div`
  text-align: center;
  padding: 0.25rem;
  background-color: #f0f1f2;
  color: #3c0078;
`;

export default WaitingTimeNotification;
