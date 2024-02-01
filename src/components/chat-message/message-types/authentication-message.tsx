import React from 'react';
import { useTranslation } from 'react-i18next';
import useChatSelector from '../../../hooks/use-chat-selector';
import useAuthenticationSelector from '../../../hooks/use-authentication-selector';
import styles from '../chat-message.module.scss';
import { redirectToTim } from '../../../utils/auth-utils';

const AuthenticationMessage = (): JSX.Element => {
  const { t } = useTranslation();
  const { chatId, isChatEnded } = useChatSelector();
  const { isAuthenticated } = useAuthenticationSelector();

  return (
    <>
      <div className="authenticationbox-explanation-text">{t('notifications.authenticate')}</div>
      <button
        disabled={isChatEnded || isAuthenticated}
        onClick={redirectToTim}
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
