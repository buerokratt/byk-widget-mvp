import React, { HTMLAttributes, ReactNode } from 'react';
import styled, { css } from 'styled-components';
import { StyledButtonType } from '../../constants';

type StyledButtonProps = {
  active?: boolean;
  children?: ReactNode;
  disabled?: boolean;
  styleType: StyledButtonType;
} & HTMLAttributes<HTMLButtonElement>;

StyledButton.defaultProps = {
  active: false,
  children: null,
  disabled: false,
};

export default function StyledButton(props: StyledButtonProps): JSX.Element {
  const { children, disabled } = props;

  return children ? (
    <StyledButtonStyles {...props} disabled={disabled}>
      {children}
    </StyledButtonStyles>
  ) : (
    <></>
  );
}

const activeStyles = css`
  background-color: #003cff;
  color: #fff;
`;

const lightStyles = css`
  background-color: #fff;
  color: #003cff;

  :hover {
    background-color: #f0f1f2;
  }
`;
const grayStyles = css`
  background-color: #f0f1f2;
  color: #003cff;

  :hover {
    background-color: #003cff;
    color: #fff;
  }
`;
const darkStyles = css`
  background-color: #003cff;
  color: #f0f1f2;

  :hover {
    background-color: #003cff;
    color: #fff;
  }
`;

const StyledButtonStyles = styled.button<StyledButtonProps>`
  border: 0;
  cursor: pointer;
  font-family: 'Aino Regular';
  font-size: 1em;
  margin: 0 0.5rem;
  padding: 0.5rem 2.5rem;
  transition: 250ms color, 250ms background-color;

  &[disabled] {
    background-color: #f0f1f2;
    color: #a7a9ab;
    cursor: not-allowed;

    :hover,
    :focus {
      background-color: #f0f1f2;
      color: #a7a9ab;
    }
  }

  ${(props) => props.styleType === StyledButtonType.LIGHT && lightStyles}
  ${(props) => props.styleType === StyledButtonType.GRAY && grayStyles}
  ${(props) => props.styleType === StyledButtonType.DARK && darkStyles}
  ${(props) => props.active && activeStyles}
`;
