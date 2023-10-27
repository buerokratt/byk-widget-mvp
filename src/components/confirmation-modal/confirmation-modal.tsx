import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { endChat } from '../../slices/chat-slice';
import { closeConfirmationModal } from '../../slices/widget-slice';
import { RootState, useAppDispatch } from '../../store';

export default function ConfirmationModal(): JSX.Element {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const isConfirmationModelOpen = useSelector((state: RootState) => state.widget.showConfirmationModal);

  if (!isConfirmationModelOpen) return <></>;
  return (
    <ConfirmationModalStyles>
      <div className="content" role="dialog" aria-modal="true" aria-labelledby="confirmation_modal_title">
        <h2 id="confirmation_modal_title" className="title">
          {t('widget.action.close-confirmation')}
        </h2>
        <div className="actions">
          <button className="button" title={t('header.button.confirmation.yes')} type="button" onClick={() => dispatch(endChat())}>
            {t('widget.action.yes')}
          </button>
          <button className="button" type="button" title={t('header.button.confirmation.no')} onClick={() => dispatch(closeConfirmationModal())}>
            {t('widget.action.no')}
          </button>
        </div>
      </div>
    </ConfirmationModalStyles>
  );
}

const ConfirmationModalStyles = styled.div`
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  bottom: 0;
  left: 0;
  position: absolute;
  right: 0;
  top: 0;

  .actions {
    align-items: center;
    display: flex;
    justify-content: space-evenly;
  }

  .button {
    background-color: transparent;
    border: 2px solid #003cff;
    border-radius: 100px;
    color: #003cff;
    font-family: 'Aino Regular';
    font-style: normal;
    font-weight: bold;
    font-size: 0.8em;
    flex-basis: 10ch;
    padding: 0.5rem;
    text-align: center;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    transition: background-color 250ms, color 250ms;

    :active,
    :hover,
    :focus {
      background-color: #003cff;
      cursor: pointer;
      color: #fff;
    }
  }

  .content {
    background-color: #fff;
    box-shadow: 0 2px 2px rgba(167, 169, 171, 0.2);
    display: flex;
    flex-flow: column nowrap;
    left: 50%;
    min-width: 70%;
    padding: 1.5rem;
    position: absolute;
    top: 50%;
    transform: translate3d(-50%, -50%, 0);
  }

  .title {
    color: #003cff;
    font-family: 'Aino Headline';
    font-size: 1.5em;
    margin: 0 0 1.5rem 0;
  }
`;
