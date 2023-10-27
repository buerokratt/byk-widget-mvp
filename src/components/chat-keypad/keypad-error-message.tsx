import React from 'react';
import styled from 'styled-components';

type errorMessageType = {
  children: string;
};

const KeypadErrorMessage = (props: errorMessageType): JSX.Element => {
  const { children } = props;
  if (!children) return <></>;
  return <ErrorMessageComponentStyles>{children}</ErrorMessageComponentStyles>;
};

const ErrorMessageComponentStyles = styled.div<errorMessageType>`
  color: #f00;
  display: flex;
  justify-content: center;
`;

export default KeypadErrorMessage;
