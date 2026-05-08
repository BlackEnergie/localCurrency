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
  { id: 'rose',    label: 'Bordeaux',  primary: '#9B2335', dark: '#6E1624', mid: '#C4566A', light: '#F5E0E3', bg: '#FBF0F1', border: '#E8C4C9', resultBg: '#FDF5F6', text: '#3B0D15', shadow: '155,35,53'   },
  { id: 'emerald', label: 'Forêt',    primary: '#2D6A4F', dark: '#1B4332', mid: '#52B788', light: '#D8F3DC', bg: '#EEF7F0', border: '#B7E4C7', resultBg: '#F2FAF4', text: '#081C15', shadow: '45,106,79'   },
  { id: 'sky',     label: 'Océan',    primary: '#1A6B8A', dark: '#0E4D66', mid: '#3A9AB5', light: '#D6EEF5', bg: '#EBF6FA', border: '#A8D8E8', resultBg: '#F0F9FC', text: '#072D3F', shadow: '26,107,138'  },
  { id: 'amber',   label: 'Terre',     primary: '#A85C2C', dark: '#7A3F1A', mid: '#C98048', light: '#F5E6D8', bg: '#FAF1E9', border: '#E8CEAD', resultBg: '#FDF6EF', text: '#3B1A08', shadow: '168,92,44'   },
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
