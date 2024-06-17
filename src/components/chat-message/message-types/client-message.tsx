import React from 'react';
import { motion } from 'framer-motion';
import classNames from 'classnames';
import { Message } from '../../../model/message-model';
import styles from '../chat-message.module.scss';
import PersonIcon from '../../../static/icons/person.svg';
import Linkifier from './linkifier';

const rightAnimation = {
  animate: { opacity: 1, x: 0 },
  initial: { opacity: 0, x: 20 },
  transition: { duration: 0.25, delay: 0.25 },
};

const ClientMessage = (props: { message: Message }): JSX.Element => {
  const {
    message: { content },
  } = props;

  return (
    <motion.div animate={rightAnimation.animate} initial={rightAnimation.initial} transition={rightAnimation.transition}>
      <div className={classNames(styles.message, styles.client)}>
        <div className={styles.icon}>
          <img src={PersonIcon} alt="Person icon" />
        </div>
        <div className={styles.content}>
          <Linkifier message={decodeURIComponent(content?.replaceAll(/\\n/g, '\n') ?? '')} />
        </div>
      </div>
    </motion.div>
  );
};

export default ClientMessage;
