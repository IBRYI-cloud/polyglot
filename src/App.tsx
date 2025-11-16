import React, { useState, useEffect } from 'react';
import { useSettings } from './context/SettingsContext';
import Header from './components/Header';
import Settings from './components/Settings';
import Footer from './components/Footer';
import OfflineModal from './components/OfflineModal';
import TutorialModal from './components/TutorialModal';
import styles from './styles/App.module.css';
import { useTranslations } from './hooks/useTranslations';

const App: React.FC = () => {
  const [ollamaStatus, setOllamaStatus] = useState<
    'checking' | 'online' | 'offline'
  >('checking');
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const { settings } = useSettings();
  const t = useTranslations();

  const retryConnection = () => {
    setOllamaStatus('checking');
    window.api.checkOllamaStatus().then((status) => {
      setOllamaStatus(status.success ? 'online' : 'offline');
    });
  };

  useEffect(() => {
    retryConnection();

    const cleanupStatusListener = window.api.onOllamaStatusChanged(
      ({ status }) => {
        setOllamaStatus(status as 'online' | 'offline');
      },
    );

    const cleanupProcessingListener = window.api.onProcessingStatusChanged(
      ({ status }) => {
        document.body.style.cursor = status === 'start' ? 'wait' : 'default';
      }
    );

    return () => {
      cleanupStatusListener();
      cleanupProcessingListener();
    };
  }, []);

  if (ollamaStatus === 'offline') {
    return <OfflineModal onRetry={retryConnection} />;
  }

  if (ollamaStatus === 'checking' || !settings || !t.loadingOllama) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>{t.loadingOllama || 'Connecting to Ollama...'}</p>
      </div>
    );
  }

  return (
    <div className={styles.appContainer}>
      {isTutorialOpen && (
        <TutorialModal onClose={() => setIsTutorialOpen(false)} />
      )}
      <Header
        ollamaStatus={ollamaStatus}
        onHelpClick={() => setIsTutorialOpen(true)}
      />
      <main className={styles.mainContent}>
        <Settings onOpenTutorial={() => setIsTutorialOpen(true)} />
      </main>
      <Footer />
    </div>
  );
};

export default App;