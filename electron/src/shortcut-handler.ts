import { globalShortcut, clipboard, Notification, BrowserWindow } from 'electron';
import { keyboard, Key } from '@nut-tree-fork/nut-js';
import Store from 'electron-store';
import { AppSettings } from './types';
import { generateOllamaResponse } from './ollama-api';
import { actionPrompts, translationPrompt } from './prompts';
import { loadTranslations } from './tray-manager';

let store: Store<AppSettings>;

const languageMap: Record<string, string> = {
    'pt': 'Portuguese (Brazil)',
    'br': 'Portuguese (Brazil)',
    'portugues': 'Portuguese (Brazil)',
    'en': 'English',
    'eng': 'English',
    'english': 'English',
    'zh': 'Chinese',
    'chines': 'Chinese',
    'chinese': 'Chinese',
    'es': 'Spanish',
    'esp': 'Spanish',
    'espanol': 'Spanish',
    'spanish': 'Spanish',
};

export function initializeShortcutHandler(appStore: Store<AppSettings>) {
  store = appStore;
}

async function handleShortcut() {
    const originalClipboard = clipboard.readText();
    clipboard.clear();
    const settings = store.store;
    const t = loadTranslations(settings.appLanguage);

    const win = BrowserWindow.getAllWindows()[0];

    try {
        await keyboard.pressKey(Key.LeftControl, Key.C);
        await keyboard.releaseKey(Key.LeftControl, Key.C);
    } catch (err) {
        console.error("nut-js failed to simulate copy:", err);
        new Notification({ title: 'Polyglot Air Error', body: t.copyError || 'Failed to copy selected text.'}).show();
        return;
    }
    
    await new Promise(resolve => setTimeout(resolve, 200)); 
    
    const selectedText = clipboard.readText();
    
    if (!selectedText || selectedText.trim() === '') {
        new Notification({ title: 'Polyglot Air', body: t.noTextError || 'No text was copied.' }).show();
        clipboard.writeText(originalClipboard);
        return;
    }

    if (!settings.selectedModel) {
        new Notification({ title: 'Polyglot Air Error', body: t.noModelError || 'No Ollama model selected.' }).show();
        clipboard.writeText(originalClipboard);
        return;
    }

    let textToProcess = selectedText;
    let prompt;

    const suffixRegex = /::(\w+)$/;
    const match = selectedText.match(suffixRegex);

    if (match) {
        const suffix = match[1].toLowerCase();
        textToProcess = selectedText.replace(suffixRegex, '').trim();
        
        if (actionPrompts[suffix]) {
            prompt = actionPrompts[suffix](textToProcess);
        } else if (languageMap[suffix]) {
            const targetLanguage = languageMap[suffix];
            prompt = translationPrompt(textToProcess, targetLanguage);
        }
    }
    
    if (!prompt) {
        const defaultTargetLanguage = settings.targetLanguage === 'Português Brasileiro' ? 'Portuguese (Brazil)' : settings.targetLanguage;
        prompt = translationPrompt(textToProcess, defaultTargetLanguage);
    }
    
    const progressNotification = new Notification({
        title: 'Polyglot Air',
        body: t.processingText || 'Processing text...',
        silent: true,
    });
    
    if (win) win.webContents.send('processing-status', { status: 'start' });
    progressNotification.show();

    console.log("\n--- NEW REQUEST ---");
    console.log("▶️ PROMPT SENT TO OLLAMA:");
    console.log(prompt);
    console.log("--------------------");

    try {
        const processedText = await generateOllamaResponse(settings.selectedModel, prompt);
        
        console.log("✅ RESPONSE RECEIVED FROM OLLAMA:");
        console.log(processedText);
        console.log("--- END REQUEST ---\n");
        
        progressNotification.close();

        if (processedText) {
            clipboard.writeText(processedText);
            
            await keyboard.pressKey(Key.LeftControl, Key.V);
            await keyboard.releaseKey(Key.LeftControl, Key.V);

            new Notification({
                title: 'Polyglot Air',
                body: t.processedText || 'Text processed and pasted!',
                silent: true,
            }).show();
        }
    } catch (error) {
        progressNotification.close();
        console.error('Processing error:', error);
        new Notification({ title: 'Polyglot Air Error', body: t.ollamaError || 'Failed to connect to Ollama.' }).show();
    } finally {
        if (win) win.webContents.send('processing-status', { status: 'end' });
        setTimeout(() => {
            if(clipboard.readText() !== originalClipboard) {
                clipboard.writeText(originalClipboard);
            }
        }, 1000);
    }
}

export function registerGlobalShortcut(shortcut: string) {
    globalShortcut.unregisterAll();
    if (!shortcut || !shortcut.includes('+')) {
        console.error(`Attempted to register invalid shortcut: "${shortcut}". Registration skipped.`);
        return;
    }
    if (globalShortcut.register(shortcut, handleShortcut)) {
        console.log(`Shortcut ${shortcut} registered successfully.`);
    } else {
        console.error(`Failed to register shortcut ${shortcut}.`);
    }
}