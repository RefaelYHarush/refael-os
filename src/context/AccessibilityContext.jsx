import React, { createContext, useContext, useState, useEffect } from 'react';

const STORAGE_KEY = 'refael_os_a11y';

const AccessibilityContext = createContext(null);

const defaultState = {
  fontScale: 1,       // 1 | 1.15 | 1.25
  highContrast: false,
  highlightLinks: false,
  reduceMotion: false,
};

function loadState() {
  if (typeof window === 'undefined') return defaultState;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState;
    const parsed = JSON.parse(raw);
    return {
      ...defaultState,
      ...parsed,
      fontScale: [1, 1.15, 1.25].includes(parsed.fontScale) ? parsed.fontScale : defaultState.fontScale,
    };
  } catch {
    return defaultState;
  }
}

function applyToDocument(state) {
  const root = document.documentElement;
  root.style.setProperty('--a11y-font-scale', String(state.fontScale));
  root.dataset.a11yContrast = state.highContrast ? 'high' : '';
  root.dataset.a11yLinks = state.highlightLinks ? 'highlight' : '';
  root.dataset.a11yMotion = state.reduceMotion ? 'reduce' : '';
}

export function AccessibilityProvider({ children }) {
  const [state, setState] = useState(loadState);

  useEffect(() => {
    applyToDocument(state);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {}
  }, [state]);

  const setFontScale = (value) => setState((s) => ({ ...s, fontScale: value }));
  const toggleHighContrast = () => setState((s) => ({ ...s, highContrast: !s.highContrast }));
  const toggleHighlightLinks = () => setState((s) => ({ ...s, highlightLinks: !s.highlightLinks }));
  const toggleReduceMotion = () => setState((s) => ({ ...s, reduceMotion: !s.reduceMotion }));
  const reset = () => setState(defaultState);

  const value = {
    ...state,
    setFontScale,
    toggleHighContrast,
    toggleHighlightLinks,
    toggleReduceMotion,
    reset,
  };

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const ctx = useContext(AccessibilityContext);
  if (!ctx) throw new Error('useAccessibility must be used within AccessibilityProvider');
  return ctx;
}
