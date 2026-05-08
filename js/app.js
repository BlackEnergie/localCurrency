/* ============================================================
   LocalCurrency â€” Point d'entrÃ©e de l'application
   Orchestre les modules : branche l'API sur l'UI,
   initialise l'Ã©tat, enregistre le Service Worker.
   ============================================================ */

import { state }                                  from './state.js';
import { loadFromStorage, loadFavorites, loadHistory,
         isCacheStale }                           from './storage.js';
import { parseInput, formatInputValue }           from './format.js';
import { THEME_KEY }                              from './currencies.js';
import {
  populateSelects, calculate,
  updateUpdateBar, updateStatusUI,
  renderFavorites, updateStarButton, toggleFavorite,
  applyTheme, initThemePicker,
  addToHistory, renderHistory,
  initComboboxes, setCurrency,
} from './ui.js';
import { fetchRates } from './api.js';

/* ============================================================
   Initialisation
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  registerServiceWorker();
  setupNetworkListeners();
  setupUIListeners();

  /* Appliquer le thème sauvegardé avant tout rendu */
  try { applyTheme(localStorage.getItem(THEME_KEY) || 'violet'); } catch { applyTheme('violet'); }
  initThemePicker();
  initComboboxes();

  loadFromStorage();
  loadFavorites();
  loadHistory();

  const amountEl = document.getElementById('amount');
  const initVal  = parseInput(amountEl.value);
  if (isFinite(initVal) && !isNaN(initVal)) amountEl.value = formatInputValue(initVal);

  if (state.rates) {
    populateSelects();
    /* Auto-sélectionner le premier favori si disponible */
    if (state.favorites.length > 0) {
      const { from, to } = state.favorites[0];
      setCurrency('from', from);
      setCurrency('to', to);
    }
    calculate();
  }

  renderFavorites();
  renderHistory();
  updateUpdateBar();
  fetchRates();
});

/* ============================================================
   Service Worker
   ============================================================ */
function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return;

  /* Recharger automatiquement quand un nouveau SW prend le contrôle */
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    window.location.reload();
  });

  navigator.serviceWorker.register('./sw.js')
    .catch(err => console.warn('Service Worker non enregistré :', err));
}

function applyUpdate(worker) {
  worker.postMessage('SKIP_WAITING');
}

/* ============================================================
   RÃ©seau â€” Ã©vÃ©nements online/offline
   ============================================================ */
function setupNetworkListeners() {
  window.addEventListener('online', () => {
    if (isCacheStale()) fetchRates();
    else updateStatusUI(true);
  });
  window.addEventListener('offline', () => updateStatusUI(false));
}

/* ============================================================
   Ã‰couteurs d'Ã©vÃ©nements UI
   (ici car ils dÃ©pendent Ã  la fois de ui.js et api.js)
   ============================================================ */
function setupUIListeners() {
  const amountEl = document.getElementById('amount');

  amountEl.addEventListener('input', calculate);

  amountEl.addEventListener('keydown', e => {
    if (e.key === 'Enter') { e.preventDefault(); amountEl.blur(); }
  });

  amountEl.addEventListener('focus', () => {
    const n = parseInput(amountEl.value);
    if (isFinite(n) && !isNaN(n)) amountEl.value = String(n).replace('.', ',');
    amountEl.select();
  });

  amountEl.addEventListener('blur', () => {
    const n = parseInput(amountEl.value);
    if (isFinite(n) && !isNaN(n)) amountEl.value = formatInputValue(n);
    addToHistory();
  });

  document.getElementById('from-currency').addEventListener('change', () => {
    calculate(); updateStarButton(); addToHistory();
  });
  document.getElementById('to-currency').addEventListener('change', () => {
    calculate(); updateStarButton(); addToHistory();
  });

  document.getElementById('btn-favorite').addEventListener('click', () => {
    const btn = document.getElementById('btn-favorite');
    const svg = btn.querySelector('svg');
    svg.classList.add('pop');
    svg.addEventListener('animationend', () => svg.classList.remove('pop'), { once: true });
    toggleFavorite();
  });

  document.getElementById('btn-swap').addEventListener('click', () => {
    const fromCode = document.getElementById('from-currency').value;
    const toCode   = document.getElementById('to-currency').value;
    setCurrency('from', toCode);
    setCurrency('to', fromCode);

    const btn = document.getElementById('btn-swap');
    btn.classList.add('swapping');
    btn.addEventListener('animationend', () => btn.classList.remove('swapping'), { once: true });

    calculate();
    updateStarButton();
  });
}

