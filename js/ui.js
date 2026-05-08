/* ============================================================
   LocalCurrency — Manipulation du DOM
   N'importe pas api.js → pas de dépendance circulaire.
   app.js est responsable de brancher fetchRates sur les events.
   ============================================================ */

import { state }                                         from './state.js';
import { POPULAR, CURRENCY_NAMES, CURRENCY_FLAGS,
         THEMES, THEME_KEY }                             from './currencies.js';
import { formatAmount, formatRate, escapeAttr }           from './format.js';
import { saveFavorites, isCacheStale, saveHistory } from './storage.js';

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

  /* ---- Drag & drop via Pointer Events (souris + touch + DevTools) ---- */
  let drag = null; // { srcIdx, srcPill, ghost, offsetX, offsetY, targetIdx }

  const onMove = e => {
    if (!drag) return;
    e.preventDefault();
    drag.ghost.style.left = (e.clientX - drag.offsetX) + 'px';
    drag.ghost.style.top  = (e.clientY - drag.offsetY) + 'px';

    /* Déterminer la pilule cible sous le pointeur */
    drag.ghost.style.display = 'none';
    const el = document.elementFromPoint(e.clientX, e.clientY);
    drag.ghost.style.display = '';
    const target = el && el.closest('.fav-pill');
    listEl.querySelectorAll('.fav-pill').forEach(p => p.classList.remove('drag-over'));
    if (target && target !== drag.srcPill) {
      target.classList.add('drag-over');
      drag.targetIdx = parseInt(target.dataset.index);
    } else {
      drag.targetIdx = null;
    }
  };

  const onUp = () => {
    if (!drag) return;
    document.removeEventListener('pointermove', onMove);
    document.removeEventListener('pointerup',   onUp);
    drag.ghost.remove();
    listEl.querySelectorAll('.fav-pill').forEach(p =>
      p.classList.remove('dragging', 'drag-over'));

    if (drag.targetIdx !== null && drag.targetIdx !== drag.srcIdx) {
      const moved = state.favorites.splice(drag.srcIdx, 1)[0];
      state.favorites.splice(drag.targetIdx, 0, moved);
      saveFavorites();
    }
    drag = null;
    renderFavorites();
  };

  state.favorites.forEach(({ from, to }, index) => {
    const flagFrom = CURRENCY_FLAGS[from] || '';
    const flagTo   = CURRENCY_FLAGS[to]   || '';

    const pill = document.createElement('div');
    pill.className = 'fav-pill';
    pill.setAttribute('role', 'listitem');
    pill.dataset.index = index;
    pill.innerHTML =
      `<span class="fav-drag" aria-hidden="true">&#9776;</span>` +
      `<span>${flagFrom} ${from}</span>` +
      `<span class="fav-arrow">→</span>` +
      `<span>${flagTo} ${to}</span>` +
      `<button class="fav-remove" aria-label="Supprimer ${from}→${to}" title="Supprimer">✕</button>`;

    /* Clic : appliquer la paire */
    pill.addEventListener('click', e => {
      if (e.target.closest('.fav-remove') || e.target.closest('.fav-drag')) return;
      document.getElementById('from-currency').value = from;
      document.getElementById('to-currency').value   = to;
      calculate();
      updateStarButton();
    });

    /* Supprimer */
    pill.querySelector('.fav-remove').addEventListener('click', e => {
      e.stopPropagation();
      const idx = state.favorites.findIndex(f => f.from === from && f.to === to);
      if (idx !== -1) state.favorites.splice(idx, 1);
      saveFavorites();
      renderFavorites();
      updateStarButton();
    });

    /* Démarrer le drag depuis la poignée */
    pill.querySelector('.fav-drag').addEventListener('pointerdown', e => {
      e.preventDefault();
      const rect = pill.getBoundingClientRect();

      const ghost = pill.cloneNode(true);
      ghost.classList.add('fav-ghost');
      ghost.style.cssText =
        `position:fixed;left:${rect.left}px;top:${rect.top}px;` +
        `width:${rect.width}px;pointer-events:none;z-index:1000;`;
      document.body.appendChild(ghost);

      pill.classList.add('dragging');
      drag = {
        srcIdx:   index,
        srcPill:  pill,
        targetIdx: null,
        ghost,
        offsetX: e.clientX - rect.left,
        offsetY: e.clientY - rect.top,
      };

      document.addEventListener('pointermove', onMove, { passive: false });
      document.addEventListener('pointerup',   onUp);
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


/* ============================================================
   Toast
   ============================================================ */
let toastTimer;
let updateToastActive = false;

export function showToast(msg) {
  if (updateToastActive) return; // ne pas écraser le toast de mise à jour SW
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('visible'), 2800);
}

/* Toast persistant avec bouton d'action (ex. mise à jour SW).
   Pas de fermeture automatique — l'utilisateur doit cliquer. */
export function showUpdateToast(onConfirm) {
  updateToastActive = true;
  const el = document.getElementById('toast');
  clearTimeout(toastTimer);
  el.innerHTML =
    'Mise à jour disponible\u00a0' +
    '<button class="toast-action">Actualiser</button>';
  el.classList.add('visible');
  el.querySelector('.toast-action').addEventListener('click', () => {
    updateToastActive = false;
    el.classList.remove('visible');
    el.innerHTML = '';
    onConfirm();
  });
}

/* ============================================================
   Thèmes de couleur
   ============================================================ */
export function applyTheme(id) {
  const theme = THEMES.find(t => t.id === id) || THEMES[0];
  const root  = document.documentElement;
  root.style.setProperty('--clr-primary',       theme.primary);
  root.style.setProperty('--clr-primary-dark',  theme.dark);
  root.style.setProperty('--clr-primary-mid',   theme.mid);
  root.style.setProperty('--clr-primary-light', theme.light);
  root.style.setProperty('--clr-bg',            theme.bg);
  root.style.setProperty('--clr-border',        theme.border);
  root.style.setProperty('--clr-result-bg',     theme.resultBg);
  root.style.setProperty('--clr-text',          theme.text);
  root.style.setProperty('--clr-shadow-rgb',    theme.shadow);

  try { localStorage.setItem(THEME_KEY, id); } catch {}

  /* Mettre à jour l'état actif des swatches si le picker est déjà rendu */
  document.querySelectorAll('.theme-swatch').forEach(el => {
    const active = el.dataset.theme === theme.id;
    el.classList.toggle('active', active);
    el.setAttribute('aria-pressed', String(active));
  });
}

export function initThemePicker() {
  const btn    = document.getElementById('btn-theme');
  const picker = document.getElementById('theme-picker');
  if (!btn || !picker) return;

  /* Construire les swatches */
  picker.innerHTML =
    '<span class="theme-picker-label">Thème</span>' +
    '<div class="theme-swatches">' +
    THEMES.map(t =>
      `<button class="theme-swatch" data-theme="${t.id}"
        style="background:${t.primary}"
        title="${t.label}" aria-label="${t.label}" aria-pressed="false">
        <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3"
          stroke-linecap="round" stroke-linejoin="round" width="14" height="14">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      </button>`
    ).join('') +
    '</div>';

  picker.querySelectorAll('.theme-swatch').forEach(el => {
    el.addEventListener('click', () => {
      applyTheme(el.dataset.theme);
      closePicker();
    });
  });

  btn.addEventListener('click', e => {
    e.stopPropagation();
    picker.classList.toggle('open');
  });

  document.addEventListener('click', closePicker);
  picker.addEventListener('click', e => e.stopPropagation());

  function closePicker() { picker.classList.remove('open'); }
}

/* ============================================================
   Historique des saisies
   ============================================================ */
const HISTORY_MAX = 10;

export function addToHistory() {
  const from      = document.getElementById('from-currency').value;
  const to        = document.getElementById('to-currency').value;
  const amountRaw = document.getElementById('amount').value;
  const amount    = parseInputLocal(amountRaw);

  if (!state.rates || !from || !to || isNaN(amount) || amount <= 0) return;

  const result = convert(amount, from, to);
  if (result === null) return;

  /* Dédupliquer : même paire + même montant → on remplace et on remonte */
  state.history = state.history.filter(
    h => !(h.from === from && h.to === to && h.amount === amount)
  );
  state.history.unshift({ from, to, amount, result, ts: Date.now() });
  if (state.history.length > HISTORY_MAX) state.history.length = HISTORY_MAX;

  saveHistory();
  renderHistory();
}

export function renderHistory() {
  const section = document.getElementById('history-section');
  const listEl  = document.getElementById('history-list');
  if (!section || !listEl) return;

  if (state.history.length === 0) {
    section.hidden = true;
    return;
  }

  section.hidden   = false;
  listEl.innerHTML = '';

  state.history.forEach(({ from, to, amount, result, ts }) => {
    const flagFrom = CURRENCY_FLAGS[from] || '';
    const flagTo   = CURRENCY_FLAGS[to]   || '';

    /* Date relative */
    const diff  = Date.now() - ts;
    let   when;
    if      (diff < 60000)   when = 'à l\'instant';
    else if (diff < 3600000) when = `il y a ${Math.floor(diff / 60000)} min`;
    else if (diff < 86400000)when = `il y a ${Math.floor(diff / 3600000)} h`;
    else                     when = new Date(ts).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });

    const row = document.createElement('div');
    row.className = 'hist-row';
    row.setAttribute('role', 'listitem');
    row.innerHTML =
      `<span class="hist-pair">${flagFrom} ${from} → ${flagTo} ${to}</span>` +
      `<span class="hist-amounts">${formatAmount(amount)} <span class="hist-arrow">→</span> ${formatAmount(result)}</span>` +
      `<span class="hist-when">${when}</span>` +
      `<button class="hist-remove" aria-label="Supprimer cette entrée" title="Supprimer">✕</button>`;

    const restore = () => {
      document.getElementById('from-currency').value = from;
      document.getElementById('to-currency').value   = to;
      document.getElementById('amount').value = String(amount).replace('.', ',');
      calculate();
      updateStarButton();
      const intPart = Math.trunc(amount);
      const dec = String(amount).split('.')[1];
      const intFmt = intPart.toLocaleString('fr-FR', { useGrouping: true });
      document.getElementById('amount').value = dec ? intFmt + ',' + dec : intFmt;
    };

    row.addEventListener('click', e => {
      if (e.target.closest('.hist-remove')) return;
      restore();
    });
    row.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') restore(); });

    row.querySelector('.hist-remove').addEventListener('click', e => {
      e.stopPropagation();
      const idx = state.history.findIndex(h => h.ts === ts);
      if (idx !== -1) state.history.splice(idx, 1);
      saveHistory();
      renderHistory();
    });

    listEl.appendChild(row);
  });
}
