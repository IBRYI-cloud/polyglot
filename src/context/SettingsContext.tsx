import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppSettings } from '../../electron/src/types';

interface SettingsContextType {
  settings: AppSettings | null;
  setSettings: React.Dispatch<React.SetStateAction<AppSettings | null>>;
  toggleTheme: () => void;
  handleLanguageChange: (lang: string) => void;
  handleSettingChange: (key: keyof AppSettings, value: string) => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<AppSettings | null>(null);

  useEffect(() => {
    window.api.getSettings().then((initialSettings) => {
      setSettings(initialSettings);
      document.body.setAttribute('data-theme', initialSettings.theme);
    });

    const cleanup = window.api.onSettingsUpdated((updatedSettings) => {
      setSettings(updatedSettings);
      document.body.setAttribute('data-theme', updatedSettings.theme);
    });

    return cleanup;
  }, []);

  const handleSettingChange = async (key: keyof AppSettings, value: string) => {
    await window.api.saveSettings({ [key]: value });
  };

  const toggleTheme = () => {
    if (settings) {
      const newTheme = settings.theme === 'light' ? 'dark' : 'light';
      handleSettingChange('theme', newTheme);
    }
  };

  const handleLanguageChange = (lang: string) => {
    handleSettingChange('appLanguage', lang);
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        setSettings,
        toggleTheme,
        handleLanguageChange,
        handleSettingChange,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};