import React, { memo, MouseEventHandler } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { setIsChatOpen } from '../../slices/chat-slice';
import { showConfirmationModal } from '../../slices/widget-slice';
import Close from '../../static/icons/close.svg';
import Minimize from '../../static/icons/minimize.svg';
import Shield from '../../static/icons/shield.svg';
import { useAppDispatch } from '../../store';
import styles from './chat-header.module.scss';
import useChatSelector from '../../hooks/use-chat-selector';
import useAuthenticationSelector from '../../hooks/use-authentication-selector';

interface ChatHeaderType {
  detailHandler: MouseEventHandler<HTMLButtonElement>;
  isDetailSelected: boolean;
}

const ChatHeader = (props: ChatHeaderType): JSX.Element => {
  const { detailHandler, isDetailSelected } = props;
  const { t } = useTranslation();
  const { chatId } = useChatSelector();
  const { isAuthenticated } = useAuthenticationSelector();
  const minimizeChat = () => dispatch(setIsChatOpen(false));
  const dispatch = useAppDispatch();

  return (
    <ChatHeaderStyles>
      <div className={`${styles.header}`}>
        <motion.button
          whileHover={{ scale: 1.2 }}
          className={`${styles.detailsButton} hamburger-icon ${isDetailSelected ? 'active' : ''}`}
          title={t('header.button.detail.label')}
          onClick={detailHandler}
          aria-label={t('header.button.detail.label')}
          type="button"
        >
          <span className={`hamburger-icon ${isDetailSelected ? 'active' : ''}`} />
        </motion.button>
        <div className={styles.title}>
          {chatId && isAuthenticated && (
            <div className={styles.shield}>
              <img src={Shield} alt={t('image.alt.text.shield.icon')} />
            </div>
          )}
          {t('widget.title')}
        </div>
        <div className={styles.actions}>
          <button title={t('header.button.minimize.label')} onClick={minimizeChat} aria-label={t('header.button.minimize.label')} type="button">
            <img src={Minimize} alt="Minimize icon" />
          </button>
          <button
            title={t('header.button.close.label')}
            onClick={() => {
              dispatch(showConfirmationModal());
            }}
            aria-label={t('header.button.close.label')}
            type="button"
          >
            <img src={Close} alt="Close icon" />
          </button>
        </div>
      </div>
    </ChatHeaderStyles>
  );
};

export default memo(ChatHeader);

const ChatHeaderStyles = styled.div`
  .hamburger-icon {
    background-image: url(data:image/svg+xml;base64,PHN2ZyBpZD0iSGFtYnVyZ2VyX2ljb24iIGRhdGEtbmFtZT0iSGFtYnVyZ2VyIGljb24iIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgdmlld0JveD0iMCAwIDMyIDMyIj4KICA8ZyBpZD0iSGFtYnVyZ2VyIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMTcuNSAtMjU0LjUpIj4KICAgIDxsaW5lIGlkPSJMaW5lIiB4MT0iMTkiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDI0LjUgMjY0LjUpIiBmaWxsPSJub25lIiBzdHJva2U9IiNmZmYiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLXdpZHRoPSIyIi8+CiAgICA8bGluZSBpZD0iTGluZS0yIiBkYXRhLW5hbWU9IkxpbmUiIHgxPSIxOSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMjQuNSAyNzAuNSkiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2Utd2lkdGg9IjIiLz4KICAgIDxsaW5lIGlkPSJMaW5lLTMiIGRhdGEtbmFtZT0iTGluZSIgeDE9IjE5IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgyNC41IDI3Ni41KSIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZmZmIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS13aWR0aD0iMiIvPgogIDwvZz4KICA8cmVjdCBpZD0iQm9yZGVyIiB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIGZpbGw9Im5vbmUiLz4KPC9zdmc+Cg==);
    background-repeat: no-repeat;
    width: 32px;
    height: 32px;
    transition: 250ms background-image;

    &.active {
      background-image: url(data:image/svg+xml;base64,PHN2ZyBpZD0iSGFtYnVyZ2VyX2ljb24iIGRhdGEtbmFtZT0iSGFtYnVyZ2VyIGljb24iIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgdmlld0JveD0iMCAwIDMyIDMyIj4KICA8ZyBpZD0iSGFtYnVyZ2VyIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMTcuNSAtMjU0LjUpIj4KICAgIDxsaW5lIGlkPSJMaW5lIiB4MT0iMTkiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDI0LjUgMjY0LjUpIiBmaWxsPSJub25lIiBzdHJva2U9IiMwMDNjZmYiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLXdpZHRoPSIyIi8+CiAgICA8bGluZSBpZD0iTGluZS0yIiBkYXRhLW5hbWU9IkxpbmUiIHgxPSIxOSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMjQuNSAyNzAuNSkiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwM2NmZiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2Utd2lkdGg9IjIiLz4KICAgIDxsaW5lIGlkPSJMaW5lLTMiIGRhdGEtbmFtZT0iTGluZSIgeDE9IjE5IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgyNC41IDI3Ni41KSIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMDAzY2ZmIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS13aWR0aD0iMiIvPgogIDwvZz4KICA8cmVjdCBpZD0iQm9yZGVyIiB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIGZpbGw9Im5vbmUiLz4KPC9zdmc+Cg==);
      background-color: white;
      border-radius: 8px;
    }
  }
`;
