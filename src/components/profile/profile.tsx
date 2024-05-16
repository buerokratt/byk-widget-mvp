import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { setIsChatOpen } from '../../slices/chat-slice';
import Buerokratt from '../../static/icons/buerokratt.svg';
import { useAppDispatch } from '../../store';
import styles from './profile.module.scss';
import { getFromLocalStorage } from '../../utils/local-storage-utils';

export const Profile = (): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const newMessagesAmount = getFromLocalStorage("newMessagesAmount");

  const openChat = () => {
    dispatch(setIsChatOpen(true));
  };

  const variants = {
    initial: {
      y: 100,
    },
    animate: {
      y: 0,
    },
  };

  return (
    <motion.div key="profile" variants={variants} style={{ position: 'fixed', bottom: 0, right: 0 }} initial="initial" animate="animate">
      <div
        className={styles.profile}
        role="button"
        aria-label={t('profile.button.open-chat')}
        title={t('profile.button.open-chat')}
        onKeyDown={openChat}
        onClick={openChat}
        tabIndex={0}
      >
        <img src={Buerokratt} alt="Buerokratt logo" className={styles.logo} loading='eager'/>
      </div>
      {newMessagesAmount !== null && parseInt(newMessagesAmount, 10) > 0 ? <span className={styles.bubble}>{newMessagesAmount}</span> : null}
    </motion.div>
  );
};

export default Profile;
