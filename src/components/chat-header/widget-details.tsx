import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import StyledButton from '../styled-components/styled-button';
import { SESSION_STORAGE_TARA_LOGIN_REDIRECT, StyledButtonType, TERMS_AND_CONDITIONS_LINK } from '../../constants';
import EU_SF_logo_src from '../../static/icons/sf_logo_horizontal.jpg';
import NEXT_GEN_FLAGS from '../../static/icons/NextGen_Rahastanud_EL_NextGeneration.jpg';
import useChatSelector from '../../hooks/use-chat-selector';
import useAuthenticationSelector from '../../hooks/use-authentication-selector';

const WidgetDetails = (): JSX.Element => {
  const { t } = useTranslation();
  const { chatId } = useChatSelector();
  const { isAuthenticated } = useAuthenticationSelector();

  return (
    <WidgetDetailsStyles initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <div className="content">
        <div className="btn-group">
          {chatId && !isAuthenticated && (
            <AuthenticateWithTaraStyles
              className="authenticateWithTara"
              onClick={() => {
                sessionStorage.setItem(SESSION_STORAGE_TARA_LOGIN_REDIRECT, window.location.pathname);
                window.location.href = window._env_.TIM_AUTHENTICATION_URL;
              }}
              styleType={StyledButtonType.GRAY}
            >
              {t('authenticate.with-tara')}
            </AuthenticateWithTaraStyles>
          )}
          <TermsAndConditionsStyles
            className="termsAndConditions"
            onClick={() => window.open(TERMS_AND_CONDITIONS_LINK, '_blank')}
            styleType={StyledButtonType.GRAY}
          >
            <span className="terms-btn-text">{t('widget.terms-and-conditions')}</span>
            <span className="external_link_icon" />
          </TermsAndConditionsStyles>
        </div>
        <div className="detail-text">
          <h4>{t('widget.details-header')}</h4>
          <p>{t('widget.details-body')}</p>
        </div>
        <div className="flags center">
          <img className="eu-sf-logo" src={EU_SF_logo_src} alt={t('alt.label.EU_SF')} height="90" width="160" />
          <img className="next-gen-flags" src={NEXT_GEN_FLAGS} alt={t('alt.label.NEXT_GEN')} height="90" width="198" />
        </div>
      </div>
    </WidgetDetailsStyles>
  );
};

const AuthenticateWithTaraStyles = styled(StyledButton)`
  display: flex;
  align-items: center;
`;

const TermsAndConditionsStyles = styled(StyledButton)`
  display: flex;
  align-items: center;

  .external_link_icon {
    background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNnB4IiBoZWlnaHQ9IjE2cHgiIGNsYXNzPSJpY29uIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgYXJpYS1oaWRkZW49InRydWUiIHJvbGU9ImltZyI+PGcgZmlsbD0iIzAwM0NGRiI+PHBhdGggZD0iTTY5LjM3IDU0LjExdjI1LjgzYTIuNjEgMi42MSAwIDAxLTIuNiAyLjZIMjBhMi42MSAyLjYxIDAgMDEtMi42LTIuNnYtNDYuOGEyLjYxIDIuNjEgMCAwMTIuNi0yLjZoMzEuNDlWMjRIMTQuMTJhMy4yNiAzLjI2IDAgMDAtMy4yNSAzLjI1djU4LjVBMy4yNiAzLjI2IDAgMDAxNC4xMiA4OWg1OC41YTMuMjYgMy4yNiAwIDAwMy4yNS0zLjI1VjU0LjExeiIvPjxwYXRoIGQ9Ik01MC43NSA1NC44NWwzMC42Mi0zMC42MlY1MWEzLjkxIDMuOTEgMCAwMDMuOSAzLjg5QTMuODYgMy44NiAwIDAwODkuMTMgNTFWMTQuODhBMy44NiAzLjg2IDAgMDA4NS4yNyAxMUg0OS4xM2EzLjg3IDMuODcgMCAxMDAgNy43M2gyNi43Nkw0NS4yNiA0OS4zN2EzLjg4IDMuODggMCAxMDUuNDkgNS40OHoiLz48L2c+PC9zdmc+);
    background-repeat: no-repeat;
    width: 16px;
    margin-left: .25rem;
    margin-top: -.25rem;
    height: 16px;
    transition: 250ms background-image;
  }

  :hover {
    .external_link_icon {
      background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNnB4IiBoZWlnaHQ9IjE2cHgiIGNsYXNzPSJpY29uIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgYXJpYS1oaWRkZW49InRydWUiIHJvbGU9ImltZyI+PGcgZmlsbD0id2hpdGUiPjxwYXRoIGQ9Ik02OS4zNyA1NC4xMXYyNS44M2EyLjYxIDIuNjEgMCAwMS0yLjYgMi42SDIwYTIuNjEgMi42MSAwIDAxLTIuNi0yLjZ2LTQ2LjhhMi42MSAyLjYxIDAgMDEyLjYtMi42aDMxLjQ5VjI0SDE0LjEyYTMuMjYgMy4yNiAwIDAwLTMuMjUgMy4yNXY1OC41QTMuMjYgMy4yNiAwIDAwMTQuMTIgODloNTguNWEzLjI2IDMuMjYgMCAwMDMuMjUtMy4yNVY1NC4xMXoiLz48cGF0aCBkPSJNNTAuNzUgNTQuODVsMzAuNjItMzAuNjJWNTFhMy45MSAzLjkxIDAgMDAzLjkgMy44OUEzLjg2IDMuODYgMCAwMDg5LjEzIDUxVjE0Ljg4QTMuODYgMy44NiAwIDAwODUuMjcgMTFINDkuMTNhMy44NyAzLjg3IDAgMTAwIDcuNzNoMjYuNzZMNDUuMjYgNDkuMzdhMy44OCAzLjg4IDAgMTA1LjQ5IDUuNDh6Ii8+PC9nPjwvc3ZnPg==);
    }
`;

const WidgetDetailsStyles = styled(motion.div)`
  display: flex;
  overflow: auto;
  flex-direction: column;
  gap: 0.5rem;
  align-items: center;
  margin: auto;

  .eu-sf-logo {
    margin-top: 3px;
  }

  .btn-group {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0.5rem;

    .authenticateWithTara {
      width: 70%;
      margin: 0.5rem;
    }

    .termsAndConditions {
      padding: 0.5rem;
      margin-bottom: 0.8rem;
      width: 70%;
      justify-content: center;
    }
  }

  .flags > * {
    padding: 0 0.5rem;
    margin-bottom: 1rem;
  }

  .button {
    padding: 1rem 0.5rem;
    overflow: hidden;

    &.second {
      margin-top: -1rem;
    }
  }

  .center {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .detail-text {
    padding: 0 0.5rem;
    margin-top: -1rem;

    p {
      font-size: small;
      margin-top: -1rem;
    }
  }

  .link-icon {
    padding-left: 0.5rem;
  }
`;

export default WidgetDetails;
