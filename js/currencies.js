/* ============================================================
   LocalCurrency — Données statiques des devises
   ============================================================ */

export const API_URL       = 'https://open.er-api.com/v6/latest/USD';
export const STORAGE_KEY   = 'localcurrency_cache';
export const FAVORITES_KEY = 'localcurrency_favorites';
export const HISTORY_KEY   = 'localcurrency_history';
export const THEME_KEY     = 'localcurrency_theme';
export const CACHE_MAX_AGE = 24 * 60 * 60 * 1000; // 24 h en ms

/* Palettes de couleurs disponibles
   shadow : valeurs R,G,B pour rgba() */
export const THEMES = [
  { id: 'violet',  label: 'Violet',    primary: '#6C63FF', dark: '#4B44CC', mid: '#9B8BFF', light: '#EDE9FF', bg: '#F0EEFF', border: '#E0DBFF', resultBg: '#F5F3FF', text: '#1E1B4B', shadow: '108,99,255'  },
  { id: 'rose',    label: 'Rose',      primary: '#E11D48', dark: '#9F1239', mid: '#FB7185', light: '#FFE4E6', bg: '#FFF1F2', border: '#FECDD3', resultBg: '#FFF5F5', text: '#4C0519', shadow: '225,29,72'   },
  { id: 'emerald', label: 'Émeraude', primary: '#10B981', dark: '#059669', mid: '#34D399', light: '#D1FAE5', bg: '#ECFDF5', border: '#A7F3D0', resultBg: '#F0FDF4', text: '#064E3B', shadow: '16,185,129'  },
  { id: 'sky',     label: 'Ciel',      primary: '#0EA5E9', dark: '#0284C7', mid: '#38BDF8', light: '#E0F2FE', bg: '#F0F9FF', border: '#BAE6FD', resultBg: '#F0F9FF', text: '#0C4A6E', shadow: '14,165,233'  },
  { id: 'amber',   label: 'Ambre',     primary: '#D97706', dark: '#B45309', mid: '#FBBF24', light: '#FEF3C7', bg: '#FFFBEB', border: '#FDE68A', resultBg: '#FEFCE8', text: '#451A03', shadow: '217,119,6'   },
  { id: 'slate',   label: 'Ardoise',   primary: '#64748B', dark: '#475569', mid: '#94A3B8', light: '#F1F5F9', bg: '#F8FAFC', border: '#E2E8F0', resultBg: '#F8FAFC', text: '#0F172A', shadow: '100,116,139' },
];

/* Devises affichées en tête de liste */
export const POPULAR = [
  'EUR','USD','GBP','CHF','JPY','CAD','AUD','CNY',
  'MAD','TND','DZD','XOF','XAF','SAR','AED','TRY',
  'INR','BRL','MXN','KRW','SGD','HKD','ZAR','RUB',
];

/* Noms des devises en français */
export const CURRENCY_NAMES = {
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
export const CURRENCY_FLAGS = {
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
