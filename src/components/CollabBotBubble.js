import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiMessageCircle } from 'react-icons/fi';
import styles from './CollabBotBubble.module.css';

const CollabBotBubble = () => {
  const location = useLocation();
  const isActive = location.pathname === '/collabbot';

  return (
    <Link
      to="/collabbot"
      className={`${styles.bubble} ${isActive ? styles.active : ''}`}
      aria-label="Open CollabBot AI"
    >
      <span className={styles.iconWrap}><FiMessageCircle /></span>
      <span className={styles.textWrap}>
        <span className={styles.title}>CollabBot AI</span>
        <span className={styles.subtitle}>Match + teamwork help</span>
      </span>
    </Link>
  );
};

export default CollabBotBubble;
