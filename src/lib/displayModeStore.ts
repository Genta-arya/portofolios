import { useState, useEffect } from 'react';

export type DisplayMode = '3d' | 'lite';

const STORAGE_KEY = 'gentha_display_mode';
const EVENT_NAME = 'gentha-display-mode-change';

export function getInitialDisplayMode(): DisplayMode {
  if (typeof window === 'undefined') return '3d';
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === '3d' || saved === 'lite') {
    return saved;
  }
  return '3d';
}

export function setDisplayMode(mode: DisplayMode) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, mode);
  document.documentElement.setAttribute('data-display-mode', mode);
  window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { mode } }));
}

export function useDisplayMode() {
  const [mode, setModeState] = useState<DisplayMode>('3d');
  const [hasChosen, setHasChosen] = useState<boolean>(true);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === '3d' || saved === 'lite') {
      setModeState(saved);
      setHasChosen(true);
      document.documentElement.setAttribute('data-display-mode', saved);
    } else {
      setHasChosen(false);
      // Default to 3d until user chooses
      setModeState('3d');
    }

    const handler = (e: Event) => {
      const customEvent = e as CustomEvent<{ mode: DisplayMode }>;
      if (customEvent.detail?.mode) {
        setModeState(customEvent.detail.mode);
        setHasChosen(true);
      }
    };

    window.addEventListener(EVENT_NAME, handler);
    return () => window.removeEventListener(EVENT_NAME, handler);
  }, []);

  const changeMode = (newMode: DisplayMode) => {
    setModeState(newMode);
    setHasChosen(true);
    setDisplayMode(newMode);
  };

  return {
    mode,
    setMode: changeMode,
    isLite: mode === 'lite',
    hasChosen,
  };
}

