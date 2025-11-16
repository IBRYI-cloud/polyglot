import { useState, useEffect } from 'react';
import { useSettings } from '../context/SettingsContext';

export function useTranslations() {
  const { settings } = useSettings();
  const [t, setT] = useState<Record<string, any>>({});

  useEffect(() => {
    if (settings?.appLanguage) {
      import(`../../locales/${settings.appLanguage}.json`)
        .then((module) => {
          setT(module.default);
        })
        .catch(console.error);
    }
  }, [settings?.appLanguage]);

  return t;
}