import { ipcMain, shell, BrowserWindow } from 'electron';
import Store from 'electron-store';
import { AppSettings } from './types';
import { checkOllamaStatus, getOllamaModels } from './ollama-api';
import { registerGlobalShortcut } from './shortcut-handler';
import { updateTrayMenu } from './tray-manager';

export function setupIpcHandlers(store: Store<AppSettings>) {
  ipcMain.handle('check-ollama-status', checkOllamaStatus);

  ipcMain.handle('get-settings', () => store.store);

  ipcMain.handle(
    'save-settings',
    (event, settings: Partial<AppSettings>) => {
      store.set(settings);
      
      const currentSettings = store.store;

      if (settings.shortcut) {
        registerGlobalShortcut(settings.shortcut);
      }
      
      if (settings.targetLanguage || settings.appLanguage) {
        updateTrayMenu(currentSettings.targetLanguage, currentSettings.appLanguage);
      }

      const window = BrowserWindow.fromWebContents(event.sender);
      if (window) {
        window.webContents.send('settings-updated', currentSettings);
      }
      return currentSettings;
    },
  );

  ipcMain.handle('get-ollama-models', getOllamaModels);

  ipcMain.handle('open-external-link', (_event, url: string) => {
    shell.openExternal(url);
  });
}