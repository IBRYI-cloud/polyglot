import React from 'react';
import { useTranslations } from '../hooks/useTranslations';
import Logo from './Logo';
import styles from '../styles/Modals.module.css';

interface OfflineModalProps {
  onRetry: () => void;
}

const OfflineModal = ({ onRetry }: OfflineModalProps) => {
  const t = useTranslations();

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.api.openExternalLink('https://ollama.com/download');
  };

  return (
    <div className="offline-modal-overlay">
      <div className={styles.offlineModalContent}>
        <Logo />
        <h2>{t.offlineTitle}</h2>
        <p>{t.offlineMessage}</p>
        <button className={styles.retryBtn} onClick={onRetry}>
          {t.tryAgain}
        </button>
        <p className={styles.downloadPrompt}>
          {t.downloadOllama?.split(' ').slice(0, -1).join(' ')}{' '}
          <a href="#" onClick={handleLinkClick}>
            {t.downloadOllama?.split(' ').pop()}
          </a>
        </p>
        <small>{t.offlineHint}</small>
      </div>
    </div>
  );
};

export default OfflineModal;