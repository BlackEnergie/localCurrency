/* ============================================================
   LocalCurrency — Appel API taux de change
   Dépend de ui.js pour les mises à jour d'interface ; ui.js
   n'importe pas api.js → pas de dépendance circulaire.
   ============================================================ */

import { state }                         from './state.js';
import { API_URL }                       from './currencies.js';
import { isCacheStale, saveToStorage }   from './storage.js';
import {
  populateSelects, calculate,
  updateUpdateBar, updateStatusUI,
  showToast, setRefreshLoading,
} from './ui.js';

export async function fetchRates() {
  if (state.isLoading) return;
  state.isLoading = true;
  setRefreshLoading(true);

  try {
    const controller = new AbortController();
    const timeout    = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(API_URL, {
      signal: controller.signal,
      cache:  'no-store',
    });
    clearTimeout(timeout);

    /* Détecter si la réponse vient du cache Service Worker (= hors ligne) */
    const fromSwCache = response.headers.get('X-Served-From') === 'sw-cache';

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = await response.json();

    if (data.result !== 'success') throw new Error('Réponse API invalide');

    if (fromSwCache) {
      /* Données servies par le SW hors ligne */
      populateSelects();
      calculate();
      updateUpdateBar();
      updateStatusUI(false);
      if (state.rates) showToast('Hors ligne — cache local utilisé');
    } else {
      /* Données fraîches depuis le réseau */
      const wasStale   = isCacheStale();
      state.rates      = data.rates;
      state.base       = data.base_code;
      state.lastUpdate = new Date();
      saveToStorage();

      populateSelects();
      calculate();
      updateUpdateBar();
      updateStatusUI(true);
      if (wasStale) showToast('Taux mis à jour ✓');
    }

  } catch (err) {
    if (err.name === 'AbortError') {
      showToast('Requête expirée — vérifiez votre connexion');
    } else if (!navigator.onLine) {
      showToast(state.rates
        ? 'Hors ligne — cache local utilisé'
        : 'Hors ligne et aucun cache disponible');
    } else {
      showToast('Impossible de charger les taux');
    }
    updateStatusUI(navigator.onLine);
  } finally {
    state.isLoading = false;
    setRefreshLoading(false);
  }
}
