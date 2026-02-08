import { afterEach, beforeAll } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';
import { expect } from 'vitest';

expect.extend(matchers);

beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  });
});

afterEach(() => {
  cleanup();
});

// jsdom may not provide a full localStorage; ensure getItem/setItem exist for ThemeContext etc.
const storage = {};
Object.defineProperty(globalThis, 'localStorage', {
  value: {
    getItem: (key) => storage[key] ?? null,
    setItem: (key, value) => { storage[key] = String(value); },
    removeItem: (key) => { delete storage[key]; },
    clear: () => { for (const k of Object.keys(storage)) delete storage[k]; },
    get length() { return Object.keys(storage).length; },
    key: (i) => Object.keys(storage)[i] ?? null,
  },
  writable: true,
});

// jsdom does not implement matchMedia (used by ThemeContext for prefers-color-scheme)
Object.defineProperty(globalThis, 'matchMedia', {
  value: (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
  writable: true,
});
