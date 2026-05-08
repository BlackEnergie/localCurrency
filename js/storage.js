/* ============================================================
   LocalCurrency — Persistance localStorage
   ============================================================ */

import { state } from './state.js';
import { STORAGE_KEY, FAVORITES_KEY, HISTORY_KEY, CACHE_MAX_AGE } from './currencies.js';

export function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const data = JSON.parse(raw);
    if (data && data.rates && data.lastUpdate) {
      state.rates      = data.rates;
      state.base       = data.base || 'USD';
      state.lastUpdate = new Date(data.lastUpdate);
    }
  } catch {
    localStorage.removeItem(STORAGE_KEY);
  }
}

export function saveToStorage() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      rates:      state.rates,
      base:       state.base,
      lastUpdate: state.lastUpdate.toISOString(),
    }));
  } catch {
    console.warn('Impossible d\'écrire dans localStorage.');
  }
}

export function isCacheStale() {
  if (!state.lastUpdate) return true;
  return (Date.now() - state.lastUpdate.getTime()) > CACHE_MAX_AGE;
}

export function loadFavorites() {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    if (raw) state.favorites = JSON.parse(raw);
    if (!Array.isArray(state.favorites)) state.favorites = [];
  } catch {
    state.favorites = [];
  }
}

export function saveFavorites() {
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(state.favorites));
  } catch {
    console.warn('Impossible d\'écrire les favoris dans localStorage.');
  }
}

export function loadHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (raw) state.history = JSON.parse(raw);
    if (!Array.isArray(state.history)) state.history = [];
  } catch {
    state.history = [];
  }
}

export function saveHistory() {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(state.history));
  } catch {
    console.warn('Impossible d\'écrire l\'historique dans localStorage.');
  }
}
