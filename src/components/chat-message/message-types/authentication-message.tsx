import React from 'react';
import { useTranslation } from 'react-i18next';
import { SESSION_STORAGE_TARA_LOGIN_REDIRECT } from '../../../constants';
import useChatSelector from '../../../hooks/use-chat-selector';
import useAuthenticationSelector from '../../../hooks/use-authentication-selector';
import styles from '../chat-message.module.scss';

const AuthenticationMessage = (): JSX.Element => {
  const { t } = useTranslation();
  const { chatId, isChatEnded } = useChatSelector();
  const { isAuthenticated } = useAuthenticationSelector();

  const authenticateUser = () => {
    sessionStorage.setItem(SESSION_STORAGE_TARA_LOGIN_REDIRECT, window.location.pathname);
    window.location.assign(window._env_.TIM_AUTHENTICATION_URL);
  };

  return (
    <>
      <div className="authenticationbox-explanation-text">{t('notifications.authenticate')}</div>
      <button
        disabled={isChatEnded || isAuthenticated}
        onClick={() => authenticateUser()}
        type="button"
        className={`${styles['event-button']} ${isAuthenticated ? styles.authenticated : ''}`}
      >
        {chatId && isAuthenticated ? (
          <span>{t('notifications.authenticate.is-authenticated')}</span>
        ) : (
          <span>{t('notifications.authenticate.needs-authentication')}</span>
        )}
      </button>
    </>
  );
};

export default AuthenticationMessage;
