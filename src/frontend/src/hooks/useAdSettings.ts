import { useState, useEffect } from 'react';

interface AdSettings {
  enabled: boolean;
  publisherId: string;
}

const STORAGE_KEY = 'mogambo_ad_settings';

const defaultSettings: AdSettings = {
  enabled: false,
  publisherId: '',
};

function loadSettings(): AdSettings {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return { ...defaultSettings, ...JSON.parse(stored) };
    }
  } catch (error) {
    console.error('Failed to load ad settings:', error);
  }
  return defaultSettings;
}

function saveSettings(settings: AdSettings): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Failed to save ad settings:', error);
  }
}

export function useAdSettings() {
  const [settings, setSettings] = useState<AdSettings>(loadSettings);

  useEffect(() => {
    const stored = loadSettings();
    setSettings(stored);
  }, []);

  const updateSettings = (newSettings: Partial<AdSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    saveSettings(updated);
  };

  return {
    settings,
    updateSettings,
  };
}
