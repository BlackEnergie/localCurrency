/* ============================================================
   LocalCurrency â€” Point d'entrÃ©e de l'application
   Orchestre les modules : branche l'API sur l'UI,
   initialise l'Ã©tat, enregistre le Service Worker.
   ============================================================ */

import { state }                                  from './state.js';
import { loadFromStorage, loadFavorites,
         isCacheStale }                           from './storage.js';
import { parseInput, formatInputValue }           from './format.js';
import { THEME_KEY }                              from './currencies.js';
import {
  populateSelects, calculate,
  updateUpdateBar, updateStatusUI,
  renderFavorites, updateStarButton, toggleFavorite,
  showUpdateToast, applyTheme, initThemePicker,
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

  loadFromStorage();
  loadFavorites();

  const amountEl = document.getElementById('amount');
  const initVal  = parseInput(amountEl.value);
  if (isFinite(initVal) && !isNaN(initVal)) amountEl.value = formatInputValue(initVal);

  if (state.rates) {
    populateSelects();
    calculate();
  }

  renderFavorites();
  updateUpdateBar();
  fetchRates();
});

/* ============================================================
   Service Worker
   ============================================================ */
function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return;

  /* Recharger dès que le nouveau SW prend le contrôle */
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    window.location.reload();
  });

  navigator.serviceWorker.register('./sw.js').then(registration => {

    /* Attache un listener statechange sur un worker en cours d'install,
       et affiche le toast quand il passe à 'installed' (= waiting). */
    function trackWorker(worker) {
      if (!worker) return;
      if (worker.state === 'installed' && navigator.serviceWorker.controller) {
        showUpdateToast(() => applyUpdate(worker));
        return;
      }
      worker.addEventListener('statechange', () => {
        if (worker.state === 'installed' && navigator.serviceWorker.controller) {
          showUpdateToast(() => applyUpdate(worker));
        }
      });
    }

    /* Cas 1 : SW déjà en attente quand register() résout */
    if (registration.waiting) {
      showUpdateToast(() => applyUpdate(registration.waiting));
      return;
    }

    /* Cas 2 : SW en cours d'installation quand register() résout
       (race condition : updatefound a déjà tiré avant le .then) */
    if (registration.installing) {
      trackWorker(registration.installing);
    }

    /* Cas 3 : mise à jour détectée plus tard pendant la session */
    registration.addEventListener('updatefound', () => {
      trackWorker(registration.installing);
    });

  }).catch(err => console.warn('Service Worker non enregistré :', err));
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

  amountEl.addEventListener('focus', () => {
    const n = parseInput(amountEl.value);
    if (isFinite(n) && !isNaN(n)) amountEl.value = String(n).replace('.', ',');
    amountEl.select();
  });

  amountEl.addEventListener('blur', () => {
    const n = parseInput(amountEl.value);
    if (isFinite(n) && !isNaN(n)) amountEl.value = formatInputValue(n);
  });

  document.getElementById('from-currency').addEventListener('change', () => {
    calculate(); updateStarButton();
  });
  document.getElementById('to-currency').addEventListener('change', () => {
    calculate(); updateStarButton();
  });

  document.getElementById('btn-favorite').addEventListener('click', () => {
    const btn = document.getElementById('btn-favorite');
    const svg = btn.querySelector('svg');
    svg.classList.add('pop');
    svg.addEventListener('animationend', () => svg.classList.remove('pop'), { once: true });
    toggleFavorite();
  });

  document.getElementById('btn-swap').addEventListener('click', () => {
    const fromEl = document.getElementById('from-currency');
    const toEl   = document.getElementById('to-currency');
    [fromEl.value, toEl.value] = [toEl.value, fromEl.value];

    const btn = document.getElementById('btn-swap');
    btn.classList.add('swapping');
    btn.addEventListener('animationend', () => btn.classList.remove('swapping'), { once: true });

    calculate();
    updateStarButton();
  });
}

