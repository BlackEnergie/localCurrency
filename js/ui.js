/* ============================================================
   LocalCurrency — Manipulation du DOM
   N'importe pas api.js → pas de dépendance circulaire.
   app.js est responsable de brancher fetchRates sur les events.
   ============================================================ */

import { state }                              from './state.js';
import { POPULAR, CURRENCY_NAMES, CURRENCY_FLAGS } from './currencies.js';
import { formatAmount, formatRate, escapeAttr } from './format.js';
import { saveFavorites, isCacheStale }         from './storage.js';

/* ============================================================
   Conversion
   ============================================================ */
export function convert(amount, from, to) {
  if (!state.rates) return null;
  const rateFrom = state.rates[from];
  const rateTo   = state.rates[to];
  if (!rateFrom || !rateTo) return null;
  return (amount / rateFrom) * rateTo;
}

/* ============================================================
   Calcul et affichage du résultat
   ============================================================ */
export function calculate() {
  const amountRaw = document.getElementById('amount').value;
  const from      = document.getElementById('from-currency').value;
  const to        = document.getElementById('to-currency').value;
  const amount    = parseInputLocal(amountRaw);

  const resultEl   = document.getElementById('result-number');
  const subtitleEl = document.getElementById('result-subtitle');
  const rateEl     = document.getElementById('rate-label');

  if (!state.rates || !from || !to) {
    resultEl.textContent   = '—';
    subtitleEl.textContent = '\u00a0';
    rateEl.textContent     = '—';
    return;
  }

  const unitRate = convert(1, from, to);
  if (unitRate === null) { resultEl.textContent = '—'; return; }

  rateEl.textContent = `1 ${from} = ${formatRate(unitRate)} ${to}`;

  if (isNaN(amount) || amountRaw.trim() === '') {
    resultEl.textContent   = '—';
    subtitleEl.textContent = '\u00a0';
    return;
  }

  const result = convert(amount, from, to);
  resultEl.textContent   = formatAmount(result) + ' ' + to;
  subtitleEl.textContent = formatAmount(amount) + ' ' + from + ' → ' + to;
}

/* parseInput réutilisé localement pour ne pas créer d'import croisé avec format.js */
function parseInputLocal(str) {
  const cleaned = str.replace(/[\u202f\u00a0\s]/g, '').replace(',', '.');
  return parseFloat(cleaned);
}

/* ============================================================
   Listes déroulantes
   ============================================================ */
export function populateSelects() {
  if (!state.rates) return;

  const fromEl = document.getElementById('from-currency');
  const toEl   = document.getElementById('to-currency');

  const savedFrom = fromEl.value || 'USD';
  const savedTo   = toEl.value   || 'EUR';

  const codes = Object.keys(state.rates).sort((a, b) => {
    const pa = POPULAR.indexOf(a);
    const pb = POPULAR.indexOf(b);
    if (pa !== -1 && pb !== -1) return pa - pb;
    if (pa !== -1) return -1;
    if (pb !== -1) return 1;
    return a.localeCompare(b);
  });

  const buildOptions = (selectedCode) => {
    let html     = '';
    let addedSep = false;

    for (const code of codes) {
      if (!addedSep && !POPULAR.includes(code)) {
        html += '<option value="" disabled>────────────────</option>';
        addedSep = true;
      }
      const name = CURRENCY_NAMES[code] || code;
      const flag = CURRENCY_FLAGS[code] ? CURRENCY_FLAGS[code] + ' ' : '';
      const sel  = code === selectedCode ? ' selected' : '';
      html += `<option value="${escapeAttr(code)}"${sel}>${flag}${code} — ${name}</option>`;
    }
    return html;
  };

  fromEl.innerHTML = buildOptions(savedFrom);
  toEl.innerHTML   = buildOptions(savedTo);
  updateStarButton();
}

/* ============================================================
   Favoris
   ============================================================ */
export function currentPair() {
  return {
    from: document.getElementById('from-currency').value,
    to:   document.getElementById('to-currency').value,
  };
}

export function isFavorite(from, to) {
  return state.favorites.some(f => f.from === from && f.to === to);
}

export function toggleFavorite() {
  const { from, to } = currentPair();
  if (!from || !to) return;

  const idx = state.favorites.findIndex(f => f.from === from && f.to === to);
  if (idx === -1) {
    state.favorites.push({ from, to });
    showToast('Ajouté aux favoris ⭐');
  } else {
    state.favorites.splice(idx, 1);
    showToast('Retiré des favoris');
  }
  saveFavorites();
  renderFavorites();
  updateStarButton();
}

export function updateStarButton() {
  const btn = document.getElementById('btn-favorite');
  if (!btn) return;
  const { from, to } = currentPair();
  const active = isFavorite(from, to);
  btn.classList.toggle('is-favorite', active);
  btn.setAttribute('aria-label', active ? 'Retirer des favoris' : 'Ajouter aux favoris');
}

export function renderFavorites() {
  const section = document.getElementById('favorites-section');
  const listEl  = document.getElementById('favorites-list');

  if (state.favorites.length === 0) {
    section.hidden = true;
    return;
  }

  section.hidden   = false;
  listEl.innerHTML = '';

  state.favorites.forEach(({ from, to }) => {
    const flagFrom = CURRENCY_FLAGS[from] || '';
    const flagTo   = CURRENCY_FLAGS[to]   || '';

    const pill = document.createElement('div');
    pill.className = 'fav-pill';
    pill.setAttribute('role', 'listitem');
    pill.innerHTML =
      `<span>${flagFrom} ${from}</span>` +
      `<span class="fav-arrow">→</span>` +
      `<span>${flagTo} ${to}</span>` +
      `<button class="fav-remove" aria-label="Supprimer ${from}→${to}" title="Supprimer">✕</button>`;

    pill.addEventListener('click', e => {
      if (e.target.closest('.fav-remove')) return;
      document.getElementById('from-currency').value = from;
      document.getElementById('to-currency').value   = to;
      calculate();
      updateStarButton();
    });

    pill.querySelector('.fav-remove').addEventListener('click', e => {
      e.stopPropagation();
      const idx = state.favorites.findIndex(f => f.from === from && f.to === to);
      if (idx !== -1) state.favorites.splice(idx, 1);
      saveFavorites();
      renderFavorites();
      updateStarButton();
    });

    listEl.appendChild(pill);
  });
}

/* ============================================================
   Statut réseau et barre de mise à jour
   ============================================================ */
export function updateStatusUI(isOnline) {
  const dot   = document.getElementById('status-dot');
  const label = document.getElementById('status-label');

  dot.className = 'status-dot';
  if (!isOnline) {
    dot.classList.add(state.rates ? 'warning' : 'offline');
    label.textContent = 'Hors ligne';
  } else if (isCacheStale()) {
    dot.classList.add('warning');
    label.textContent = 'En ligne';
  } else {
    dot.classList.add('online');
    label.textContent = 'En ligne';
  }
}

export function updateUpdateBar() {
  const el = document.getElementById('update-text');
  if (!state.lastUpdate) {
    el.textContent = 'Aucune donnée en cache';
    return;
  }
  const diff  = Date.now() - state.lastUpdate.getTime();
  const hours = Math.floor(diff / 3600000);
  const mins  = Math.floor((diff % 3600000) / 60000);

  let label;
  if (diff < 60000)        label = 'à l\'instant';
  else if (diff < 3600000) label = `il y a ${mins} min`;
  else if (hours < 24)     label = `il y a ${hours} h`;
  else {
    label = state.lastUpdate.toLocaleDateString('fr-FR', {
      day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
    });
  }
  el.textContent = `Taux mis à jour ${label}`;
}

export function setRefreshLoading(loading) {
  const btn = document.getElementById('btn-refresh');
  btn.classList.toggle('spinning', loading);
  btn.disabled = loading;
}

/* ============================================================
   Toast
   ============================================================ */
let toastTimer;
export function showToast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('visible'), 2800);
}

/* Toast persistant avec bouton d'action (ex. mise à jour SW).
   Pas de fermeture automatique — l'utilisateur doit cliquer. */
export function showUpdateToast(onConfirm) {
  const el = document.getElementById('toast');
  clearTimeout(toastTimer);
  el.innerHTML =
    'Mise à jour disponible\u00a0' +
    '<button class="toast-action">Actualiser</button>';
  el.classList.add('visible');
  el.querySelector('.toast-action').addEventListener('click', () => {
    el.classList.remove('visible');
    el.innerHTML = '';
    onConfirm();
  });
}
