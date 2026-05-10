import { configureStore } from '@reduxjs/toolkit';
import tradingReducer from './features/trading/tradingSlice.js';

const STORAGE_KEY = 'trade-world-state-v1';

const loadState = () => {
  try {
    const serialized = localStorage.getItem(STORAGE_KEY);
    return serialized ? JSON.parse(serialized) : undefined;
  } catch {
    return undefined;
  }
};

const saveState = (state) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Trading state still works without persistence when storage is unavailable.
  }
};

export const store = configureStore({
  reducer: {
    trading: tradingReducer,
  },
  preloadedState: loadState(),
});

let saveTimer;
store.subscribe(() => {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => saveState(store.getState()), 250);
});
