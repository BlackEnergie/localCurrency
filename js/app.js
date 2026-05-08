/* ============================================================
   LocalCurrency — Logique principale
   API : https://open.er-api.com/v6/latest/USD
   (gratuite, sans clé, ~160 devises, mise à jour quotidienne)
   ============================================================ */

'use strict';

/* ---- Constantes ---- */
const API_URL       = 'https://open.er-api.com/v6/latest/USD';
const STORAGE_KEY   = 'localcurrency_cache';
const CACHE_MAX_AGE = 24 * 60 * 60 * 1000; // 24 heures en ms

/* Devises affichées en tête de liste */
const POPULAR = [
  'EUR','USD','GBP','CHF','JPY','CAD','AUD','CNY',
  'MAD','TND','DZD','XOF','XAF','SAR','AED','TRY',
  'INR','BRL','MXN','KRW','SGD','HKD','ZAR','RUB'
];

/* Noms des devises en français */
const CURRENCY_NAMES = {
  AED:'Dirham des Émirats',       AFN:'Afghani afghan',
  ALL:'Lek albanais',              AMD:'Dram arménien',
  ANG:'Florin antillais',          AOA:'Kwanza angolais',
  ARS:'Peso argentin',             AUD:'Dollar australien',
  AWG:'Florin arubais',            AZN:'Manat azerbaïdjanais',
  BAM:'Mark convertible',          BBD:'Dollar de la Barbade',
  BDT:'Taka bangladais',           BGN:'Lev bulgare',
  BHD:'Dinar bahreïni',            BIF:'Franc burundais',
  BMD:'Dollar des Bermudes',       BND:'Dollar de Brunei',
  BOB:'Boliviano',                 BRL:'Real brésilien',
  BSD:'Dollar des Bahamas',        BTN:'Ngultrum bhoutanais',
  BWP:'Pula botswanais',           BYN:'Rouble biélorusse',
  BZD:'Dollar de Belize',          CAD:'Dollar canadien',
  CDF:'Franc congolais',           CHF:'Franc suisse',
  CLP:'Peso chilien',              CNY:'Yuan renminbi',
  COP:'Peso colombien',            CRC:'Colón costaricain',
  CUP:'Peso cubain',               CVE:'Escudo cap-verdien',
  CZK:'Couronne tchèque',          DJF:'Franc djiboutien',
  DKK:'Couronne danoise',          DOP:'Peso dominicain',
  DZD:'Dinar algérien',            EGP:'Livre égyptienne',
  ERN:'Nakfa érythréen',           ETB:'Birr éthiopien',
  EUR:'Euro',                      FJD:'Dollar fidjien',
  FKP:'Livre des Malouines',       GBP:'Livre sterling',
  GEL:'Lari géorgien',             GHS:'Cedi ghanéen',
  GIP:'Livre de Gibraltar',        GMD:'Dalasi gambien',
  GNF:'Franc guinéen',             GTQ:'Quetzal guatémaltèque',
  GYD:'Dollar guyanais',           HKD:'Dollar de Hong Kong',
  HNL:'Lempira hondurien',         HTG:'Gourde haïtienne',
  HUF:'Forint hongrois',           IDR:'Roupie indonésienne',
  ILS:'Shekel israélien',          INR:'Roupie indienne',
  IQD:'Dinar irakien',             IRR:'Rial iranien',
  ISK:'Couronne islandaise',       JMD:'Dollar jamaïcain',
  JOD:'Dinar jordanien',           JPY:'Yen japonais',
  KES:'Shilling kényan',           KGS:'Som kirghiz',
  KHR:'Riel cambodgien',           KMF:'Franc comorien',
  KRW:'Won sud-coréen',            KWD:'Dinar koweïtien',
  KYD:'Dollar des Caïmans',        KZT:'Tenge kazakh',
  LAK:'Kip laotien',               LBP:'Livre libanaise',
  LKR:'Roupie sri-lankaise',       LRD:'Dollar libérien',
  LSL:'Loti du Lesotho',           LYD:'Dinar libyen',
  MAD:'Dirham marocain',           MDL:'Leu moldave',
  MGA:'Ariary malgache',           MKD:'Denar macédonien',
  MMK:'Kyat birman',               MNT:'Tögrög mongol',
  MOP:'Pataca macanais',           MRU:'Ouguiya mauritanien',
  MUR:'Roupie mauricienne',        MVR:'Rufiyaa maldivien',
  MWK:'Kwacha malawien',           MXN:'Peso mexicain',
  MYR:'Ringgit malaisien',         MZN:'Metical mozambicain',
  NAD:'Dollar namibien',           NGN:'Naira nigérian',
  NIO:'Córdoba nicaraguayen',      NOK:'Couronne norvégienne',
  NPR:'Roupie népalaise',          NZD:'Dollar néo-zélandais',
  OMR:'Rial omanais',              PAB:'Balboa panaméen',
  PEN:'Sol péruvien',              PGK:'Kina papou-néo-guinéen',
  PHP:'Peso philippin',            PKR:'Roupie pakistanaise',
  PLN:'Zloty polonais',            PYG:'Guaraní paraguayen',
  QAR:'Riyal qatarien',            RON:'Leu roumain',
  RSD:'Dinar serbe',               RUB:'Rouble russe',
  RWF:'Franc rwandais',            SAR:'Riyal saoudien',
  SBD:'Dollar des Salomon',        SCR:'Roupie seychelloise',
  SDG:'Livre soudanaise',          SEK:'Couronne suédoise',
  SGD:'Dollar de Singapour',       SHP:'Livre de Sainte-Hélène',
  SLE:'Leone sierra-léonais',      SOS:'Shilling somalien',
  SRD:'Dollar surinamais',         STN:'Dobra santoméen',
  SVC:'Colón salvadorien',         SYP:'Livre syrienne',
  SZL:'Lilangeni swazi',           THB:'Baht thaïlandais',
  TJS:'Somoni tadjik',             TMT:'Manat turkmène',
  TND:'Dinar tunisien',            TOP:"Pa'anga tongien",
  TRY:'Livre turque',              TTD:'Dollar de Trinité-et-Tobago',
  TWD:'Nouveau dollar taïwanais',  TZS:'Shilling tanzanien',
  UAH:'Hryvnia ukrainien',         UGX:'Shilling ougandais',
  USD:'Dollar américain',          UYU:'Peso uruguayen',
  UZS:'Sum ouzbek',                VES:'Bolivar vénézuélien',
  VND:'Dong vietnamien',           VUV:'Vatu vanuatuan',
  WST:'Tala samoan',               XAF:'Franc CFA (BEAC)',
  XCD:'Dollar des Caraïbes',       XOF:'Franc CFA (BCEAO)',
  XPF:'Franc CFP',                 YER:'Rial yéménite',
  ZAR:'Rand sud-africain',         ZMW:'Kwacha zambien',
  ZWL:'Dollar zimbabwéen',
};

/* Drapeaux emoji par code devise */
const CURRENCY_FLAGS = {
  AED:'🇦🇪', AFN:'🇦🇫', ALL:'🇦🇱', AMD:'🇦🇲', ANG:'🇳🇱', AOA:'🇦🇴',
  ARS:'🇦🇷', AUD:'🇦🇺', AWG:'🇦🇼', AZN:'🇦🇿', BAM:'🇧🇦', BBD:'🇧🇧',
  BDT:'🇧🇩', BGN:'🇧🇬', BHD:'🇧🇭', BIF:'🇧🇮', BMD:'🇧🇲', BND:'🇧🇳',
  BOB:'🇧🇴', BRL:'🇧🇷', BSD:'🇧🇸', BTN:'🇧🇹', BWP:'🇧🇼', BYN:'🇧🇾',
  BZD:'🇧🇿', CAD:'🇨🇦', CDF:'🇨🇩', CHF:'🇨🇭', CLP:'🇨🇱', CNY:'🇨🇳',
  COP:'🇨🇴', CRC:'🇨🇷', CUP:'🇨🇺', CVE:'🇨🇻', CZK:'🇨🇿', DJF:'🇩🇯',
  DKK:'🇩🇰', DOP:'🇩🇴', DZD:'🇩🇿', EGP:'🇪🇬', ERN:'🇪🇷', ETB:'🇪🇹',
  EUR:'🇪🇺', FJD:'🇫🇯', FKP:'🇫🇰', GBP:'🇬🇧', GEL:'🇬🇪', GHS:'🇬🇭',
  GIP:'🇬🇮', GMD:'🇬🇲', GNF:'🇬🇳', GTQ:'🇬🇹', GYD:'🇬🇾', HKD:'🇭🇰',
  HNL:'🇭🇳', HTG:'🇭🇹', HUF:'🇭🇺', IDR:'🇮🇩', ILS:'🇮🇱', INR:'🇮🇳',
  IQD:'🇮🇶', IRR:'🇮🇷', ISK:'🇮🇸', JMD:'🇯🇲', JOD:'🇯🇴', JPY:'🇯🇵',
  KES:'🇰🇪', KGS:'🇰🇬', KHR:'🇰🇭', KMF:'🇰🇲', KRW:'🇰🇷', KWD:'🇰🇼',
  KYD:'🇰🇾', KZT:'🇰🇿', LAK:'🇱🇦', LBP:'🇱🇧', LKR:'🇱🇰', LRD:'🇱🇷',
  LSL:'🇱🇸', LYD:'🇱🇾', MAD:'🇲🇦', MDL:'🇲🇩', MGA:'🇲🇬', MKD:'🇲🇰',
  MMK:'🇲🇲', MNT:'🇲🇳', MOP:'🇲🇴', MRU:'🇲🇷', MUR:'🇲🇺', MVR:'🇲🇻',
  MWK:'🇲🇼', MXN:'🇲🇽', MYR:'🇲🇾', MZN:'🇲🇿', NAD:'🇳🇦', NGN:'🇳🇬',
  NIO:'🇳🇮', NOK:'🇳🇴', NPR:'🇳🇵', NZD:'🇳🇿', OMR:'🇴🇲', PAB:'🇵🇦',
  PEN:'🇵🇪', PGK:'🇵🇬', PHP:'🇵🇭', PKR:'🇵🇰', PLN:'🇵🇱', PYG:'🇵🇾',
  QAR:'🇶🇦', RON:'🇷🇴', RSD:'🇷🇸', RUB:'🇷🇺', RWF:'🇷🇼', SAR:'🇸🇦',
  SBD:'🇸🇧', SCR:'🇸🇨', SDG:'🇸🇩', SEK:'🇸🇪', SGD:'🇸🇬', SHP:'🇸🇭',
  SLE:'🇸🇱', SOS:'🇸🇴', SRD:'🇸🇷', STN:'🇸🇹', SVC:'🇸🇻', SYP:'🇸🇾',
  SZL:'🇸🇿', THB:'🇹🇭', TJS:'🇹🇯', TMT:'🇹🇲', TND:'🇹🇳', TOP:'🇹🇴',
  TRY:'🇹🇷', TTD:'🇹🇹', TWD:'🇹🇼', TZS:'🇹🇿', UAH:'🇺🇦', UGX:'🇺🇬',
  USD:'🇺🇸', UYU:'🇺🇾', UZS:'🇺🇿', VES:'🇻🇪', VND:'🇻🇳', VUV:'🇻🇺',
  WST:'🇼🇸', XAF:'🌍', XCD:'🌎', XOF:'🌍', XPF:'🌊', YER:'🇾🇪',
  ZAR:'🇿🇦', ZMW:'🇿🇲', ZWL:'🇿🇼',
};

/* ---- État de l'application ---- */
let state = {
  rates:      null,   // { USD: 1, EUR: 0.92, ... }
  base:       'USD',  // devise de base retournée par l'API
  lastUpdate: null,   // Date object
  isLoading:  false,
};

/* ============================================================
   Initialisation
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  registerServiceWorker();
  setupNetworkListeners();
  setupUIListeners();

  /* Charger le cache local d'abord (affichage instantané) */
  loadFromStorage();

  /* Formater la valeur initiale du champ montant */
  const amountEl = document.getElementById('amount');
  const initVal  = parseInput(amountEl.value);
  if (isFinite(initVal) && !isNaN(initVal)) amountEl.value = formatInputValue(initVal);

  if (state.rates) {
    populateSelects();
    calculate();
  }

  /* Rafraîchir si le cache est périmé ou absent */
  if (!state.rates || isCacheStale()) {
    fetchRates();
  } else {
    updateStatusUI(true);
    updateUpdateBar();
  }
});

/* ============================================================
   Service Worker
   ============================================================ */
function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register('./sw.js')
      .catch(err => console.warn('Service Worker non enregistré :', err));
  }
}

/* ============================================================
   Réseau — événements online/offline
   ============================================================ */
function setupNetworkListeners() {
  window.addEventListener('online',  () => {
    updateStatusUI(true);
    if (isCacheStale()) fetchRates();
  });
  window.addEventListener('offline', () => updateStatusUI(false));
}

/* ============================================================
   Gestion du localStorage
   ============================================================ */
function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const data = JSON.parse(raw);
    if (data && data.rates && data.lastUpdate) {
      state.rates      = data.rates;
      state.base       = data.base  || 'USD';
      state.lastUpdate = new Date(data.lastUpdate);
    }
  } catch {
    /* Cache corrompu — on l'ignore */
    localStorage.removeItem(STORAGE_KEY);
  }
}

function saveToStorage() {
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

function isCacheStale() {
  if (!state.lastUpdate) return true;
  return (Date.now() - state.lastUpdate.getTime()) > CACHE_MAX_AGE;
}

/* ============================================================
   Appel API
   ============================================================ */
async function fetchRates() {
  if (state.isLoading) return;
  state.isLoading = true;
  setRefreshLoading(true);
  hideAlert();

  try {
    const controller = new AbortController();
    const timeout    = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(API_URL, { signal: controller.signal });
    clearTimeout(timeout);

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = await response.json();

    if (data.result !== 'success') throw new Error('Réponse API invalide');

    state.rates      = data.rates;
    state.base       = data.base_code;
    state.lastUpdate = new Date();
    saveToStorage();

    populateSelects();
    calculate();
    updateUpdateBar();
    updateStatusUI(true);
    showToast('Taux mis à jour ✓');

  } catch (err) {
    if (err.name === 'AbortError') {
      showAlert('La requête a expiré. Vérifiez votre connexion.', 'warning');
    } else if (!navigator.onLine) {
      if (state.rates) {
        showAlert('Mode hors ligne — utilisation du cache local.', 'warning');
      } else {
        showAlert('Pas de connexion et aucun cache disponible. Connectez-vous pour charger les taux.', 'error');
      }
    } else {
      showAlert('Impossible de charger les taux. Réessayez dans un instant.', 'warning');
    }
    updateStatusUI(navigator.onLine);
  } finally {
    state.isLoading = false;
    setRefreshLoading(false);
  }
}

/* ============================================================
   Conversion
   ============================================================ */
function convert(amount, from, to) {
  if (!state.rates) return null;
  const rateFrom = state.rates[from];
  const rateTo   = state.rates[to];
  if (!rateFrom || !rateTo) return null;
  /* Les taux sont tous relatifs à state.base (USD) */
  return (amount / rateFrom) * rateTo;
}

/* Convertit la valeur saisie (peut contenir séparateurs de milliers et virgule décimale) en nombre */
function parseInput(str) {
  /* Supprimer les séparateurs de milliers : espace, espace fine insécable (\u202f), espace insécable (\u00a0) */
  const cleaned = str.replace(/[\u202f\u00a0\s]/g, '').replace(',', '.');
  return parseFloat(cleaned);
}

/* Formate un nombre pour l'affichage dans le champ de saisie */
function formatInputValue(n) {
  if (!isFinite(n) || isNaN(n)) return '';
  /* Conserver les décimales telles que saisies (pas d'arrondi) */
  const str = String(n);
  const [intPart, decPart] = str.split('.');
  const intFormatted = parseInt(intPart, 10).toLocaleString('fr-FR', { useGrouping: true });
  return decPart !== undefined ? intFormatted + ',' + decPart : intFormatted;
}

function calculate() {
  const amountRaw = document.getElementById('amount').value;
  const from      = document.getElementById('from-currency').value;
  const to        = document.getElementById('to-currency').value;
  const amount    = parseInput(amountRaw);

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

/* ============================================================
   Formatage des nombres
   ============================================================ */
function formatAmount(n) {
  if (!isFinite(n)) return '—';
  const opts = n >= 100
    ? { useGrouping: true, maximumFractionDigits: 2 }
    : n >= 1
      ? { useGrouping: true, minimumFractionDigits: 2, maximumFractionDigits: 4 }
      : { useGrouping: true, minimumFractionDigits: 2, maximumFractionDigits: 6 };
  return n.toLocaleString('fr-FR', opts);
}

function formatRate(r) {
  if (!isFinite(r)) return '—';
  if (r >= 100) return r.toLocaleString('fr-FR', { useGrouping: true, maximumFractionDigits: 2 });
  if (r >= 1)   return r.toLocaleString('fr-FR', { useGrouping: true, minimumFractionDigits: 4, maximumFractionDigits: 4 });
  return r.toLocaleString('fr-FR', { useGrouping: true, minimumFractionDigits: 6, maximumFractionDigits: 6 });
}

/* ============================================================
   Remplissage des listes déroulantes
   ============================================================ */
function populateSelects() {
  if (!state.rates) return;

  const fromEl = document.getElementById('from-currency');
  const toEl   = document.getElementById('to-currency');

  /* Sauvegarder les sélections actuelles (ou valeurs par défaut) */
  const savedFrom = fromEl.value || 'USD';
  const savedTo   = toEl.value   || 'EUR';

  const codes = Object.keys(state.rates).sort();

  /* Trier : populaires en premier, puis alphabétique */
  codes.sort((a, b) => {
    const pa = POPULAR.indexOf(a);
    const pb = POPULAR.indexOf(b);
    if (pa !== -1 && pb !== -1) return pa - pb;
    if (pa !== -1) return -1;
    if (pb !== -1) return 1;
    return a.localeCompare(b);
  });

  const buildOptions = (selectedCode) => {
    let html        = '';
    let addedSep    = false;

    for (const code of codes) {
      if (!addedSep && !POPULAR.includes(code)) {
        html += '<option value="" disabled>────────────────</option>';
        addedSep = true;
      }
      const name  = CURRENCY_NAMES[code] || code;
      const flag  = CURRENCY_FLAGS[code] ? CURRENCY_FLAGS[code] + ' ' : '';
      const sel   = code === selectedCode ? ' selected' : '';
      html += `<option value="${escapeAttr(code)}"${sel}>${flag}${code} — ${name}</option>`;
    }
    return html;
  };

  fromEl.innerHTML = buildOptions(savedFrom);
  toEl.innerHTML   = buildOptions(savedTo);
}

function escapeAttr(s) {
  return s.replace(/[&"<>]/g, c => ({'&':'&amp;','"':'&quot;','<':'&lt;','>':'&gt;'}[c]));
}

/* ============================================================
   Écouteurs d'événements UI
   ============================================================ */
function setupUIListeners() {
  const amountEl = document.getElementById('amount');

  /* Calcul en temps réel pendant la saisie */
  amountEl.addEventListener('input', calculate);

  /* À la prise de focus : afficher la valeur brute pour faciliter l'édition */
  amountEl.addEventListener('focus', () => {
    const n = parseInput(amountEl.value);
    if (isFinite(n) && !isNaN(n)) {
      /* Remplacer la virgule décimale fr par un point pour l'édition */
      amountEl.value = String(n).replace('.', ',');
    }
    amountEl.select();
  });

  /* À la perte de focus : reformater avec séparateurs de milliers */
  amountEl.addEventListener('blur', () => {
    const n = parseInput(amountEl.value);
    if (isFinite(n) && !isNaN(n)) {
      amountEl.value = formatInputValue(n);
    }
  });
  document.getElementById('from-currency').addEventListener('change', calculate);
  document.getElementById('to-currency').addEventListener('change', calculate);

  document.getElementById('btn-refresh').addEventListener('click', () => fetchRates());

  document.getElementById('btn-swap').addEventListener('click', () => {
    const fromEl = document.getElementById('from-currency');
    const toEl   = document.getElementById('to-currency');
    const tmp    = fromEl.value;
    fromEl.value = toEl.value;
    toEl.value   = tmp;

    /* Animation */
    const btn = document.getElementById('btn-swap');
    btn.classList.add('swapping');
    btn.addEventListener('animationend', () => btn.classList.remove('swapping'), { once: true });

    calculate();
  });
}

/* ============================================================
   Mise à jour de l'interface
   ============================================================ */
function updateStatusUI(isOnline) {
  const dot   = document.getElementById('status-dot');
  const label = document.getElementById('status-label');

  dot.className   = 'status-dot';
  if (!isOnline) {
    if (state.rates) {
      dot.classList.add('warning');
      label.textContent = 'Hors ligne';
    } else {
      dot.classList.add('offline');
      label.textContent = 'Hors ligne';
    }
  } else if (isCacheStale()) {
    dot.classList.add('warning');
    label.textContent = 'En ligne';
  } else {
    dot.classList.add('online');
    label.textContent = 'En ligne';
  }
}

function updateUpdateBar() {
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
      day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
    });
  }
  el.textContent = `Taux mis à jour ${label}`;
}

function setRefreshLoading(loading) {
  const btn = document.getElementById('btn-refresh');
  loading
    ? btn.classList.add('spinning')
    : btn.classList.remove('spinning');
  btn.disabled = loading;
}

/* ============================================================
   Messages alertes et toasts
   ============================================================ */
function showAlert(msg, type = 'warning') {
  const el = document.getElementById('alert');
  el.textContent = msg;
  el.className   = `alert ${type}`;
  el.hidden      = false;
}

function hideAlert() {
  const el = document.getElementById('alert');
  el.hidden = true;
}

let toastTimer;
function showToast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('visible'), 2800);
}
