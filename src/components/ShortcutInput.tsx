import React, { useState } from 'react';
import { useSettings } from '../context/SettingsContext';
import { useTranslations } from '../hooks/useTranslations';
import styles from '../styles/ShortcutInput.module.css';

const ShortcutInput: React.FC = () => {
  const { settings, handleSettingChange } = useSettings();
  const t = useTranslations();
  const [isRecording, setIsRecording] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
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

  if (!settings) return null;
  
  return (
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
          onKeyDown={handleKeyDown}
        />
      </div>
    </div>
  );
};

export default ShortcutInput;