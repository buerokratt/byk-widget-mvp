import React from 'react';
import styled from 'styled-components';

interface WarningNotificationProps {
  warningMessage: string;
}

const WarningNotification = (props: WarningNotificationProps): JSX.Element => {
  const { warningMessage = '' } = props;
  return (
    <WarningStyle>
      <div className="warning">{warningMessage}</div>
    </WarningStyle>
  );
};

const WarningStyle = styled.div`
  .warning {
    text-align: center;
    padding: 0.25em;
    color: #3c0078;
    background-color: #fcedc5;
  }
`;
export default WarningNotification;
