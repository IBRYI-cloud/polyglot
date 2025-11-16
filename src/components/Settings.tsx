import React, { useState, useEffect } from 'react';
import { useSettings } from '../context/SettingsContext';
import { useTranslations } from '../hooks/useTranslations';
import styles from '../styles/Settings.module.css';

const canonicalLanguages = ['Português Brasileiro', 'Inglês', 'Espanhol', 'Chinês'];

interface SettingsProps {
  onOpenTutorial: () => void;
}

const CopyIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
  </svg>
);

const CheckIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

const Settings: React.FC<SettingsProps> = ({ onOpenTutorial }) => {
  const { settings, handleSettingChange } = useSettings();
  const t = useTranslations();
  const [models, setModels] = useState<string[]>([]);
  const [isCopied, setIsCopied] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const languageOptions = canonicalLanguages.map((lang, index) => ({
    value: lang,
    label: t.targetLanguages?.[index] || lang,
  }));

  const fetchModels = async () => {
    const result = await window.api.getOllamaModels();
    if (result.success && result.models) {
      setModels(result.models.map((m) => m.name));
    } else {
      setModels([]);
    }
  };

  useEffect(() => {
    fetchModels();
  }, []);

  const handleCopyCommand = () => {
    const command = "ollama pull gemma3:4b";
    navigator.clipboard.writeText(command);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };
  
  const handleShortcutKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const keys: string[] = [];
    if (e.ctrlKey) keys.push('Control');
    if (e.altKey) keys.push('Alt');
    if (e.shiftKey) keys.push('Shift');

    const key = e.key.toUpperCase();
    if (!['CONTROL', 'ALT', 'SHIFT', 'META'].includes(key)) {
      keys.push(key);
    }

    const shortcut = keys.join('+');
    if (keys.length > 1 && settings && shortcut !== settings.shortcut) {
      handleSettingChange('shortcut', shortcut);
    }
    setIsRecording(false);
  };

  if (!settings || !t.shortcutLabel) return null;

  return (
    <div className={styles.settingsContainer}>
      <div className={styles.shortcutShowcase}>
        <h2>{t.shortcutLabel}</h2>
        <p>{t.shortcutHint}</p>
        <div
            className={styles.shortcutInputWrapper}
            onClick={() => document.getElementById('shortcut-input')?.focus()}
        >
            <div className={styles.shortcutIconContainer}>
                <img 
                    src="/language-translator-icon.svg" 
                    alt="Translate Icon" 
                    className={styles.shortcutIcon} 
                />
            </div>
            <input 
                id="shortcut-input"
                className={styles.shortcutInput}
                type="text"
                readOnly
                value={settings.shortcut.replace(/\+/g, ' + ')}
                placeholder={isRecording ? t.shortcutRecording : t.shortcutSet}
                onFocus={() => setIsRecording(true)}
                onBlur={() => setIsRecording(false)}
                onKeyDown={handleShortcutKeyDown}
            />
        </div>
      </div>

      <div className={styles.settingsGrid}>
        <div className={styles.settingItem}>
          <label htmlFor="language-select">{t.targetLanguageLabel}</label>
          <select
            id="language-select"
            value={settings.targetLanguage}
            onChange={(e) => handleSettingChange('targetLanguage', e.target.value)}
          >
            {languageOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <p>{t.targetLanguageHint}</p>
        </div>
        <div className={`${styles.settingItem} ${styles.modelSettingItem}`}>
          <label htmlFor="model-select">{t.ollamaModelLabel}</label>
          <div className={styles.inputWithButton}>
            <select
              id="model-select"
              value={settings.selectedModel}
              onChange={(e) => handleSettingChange('selectedModel', e.target.value)}
            >
              <option value="" disabled>
                {t.selectModel}
              </option>
              {models.map((model) => (
                <option key={model} value={model}>
                  {model}
                </option>
              ))}
            </select>
            <button className={styles.reloadBtn} onClick={fetchModels} title={t.reloadModelsTooltip}>
              ↻
            </button>
          </div>
          <p>{t.ollamaModelHint}</p>
          <div className={styles.modelSuggestion}>
            <p className={styles.suggestionText}>{t.modelSuggestion}</p>
            <div className={styles.commandBoxWrapper}>
              <div className={styles.commandBox}>
                <code>ollama pull gemma3:4b</code>
              </div>
              <button
                onClick={handleCopyCommand}
                className={styles.copyBtn}
                title={isCopied ? t.copied : t.copy}
              >
                {isCopied ? <CheckIcon /> : <CopyIcon />}
              </button>
            </div>
          </div>
        </div>
        <div className={`${styles.settingItem} ${styles.settingItemButton}`} onClick={onOpenTutorial}>
          <img src="/suffix.svg" alt="Suffix Icon" className={styles.settingItemIcon} />
          <div className={styles.settingItemButtonText}>
            <h3>{t.suffixTableTitle}</h3>
            <p>{t.suffixTableHint}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;