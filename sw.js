/* ==========================================================
   Service Worker — LocalCurrency
   Stratégie : Cache-first pour les assets, Network-first
   pour l'API (fallback sur cache).
   ========================================================== */

const CACHE_NAME = 'localcurrency-v1';

const ASSETS = [
  './',
  './index.html',
  './css/style.css',
  './js/app.js',
  './manifest.json',
  './icons/icon.svg'
];

/* ------ Installation : mise en cache des assets statiques ------ */
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

/* ------ Activation : nettoyage des anciens caches ------ */
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

/* ------ Interception des requêtes ------ */
self.addEventListener('fetch', event => {
  const url = event.request.url;

  /* Requêtes API : Network-first, fallback cache */
  if (url.includes('open.er-api.com')) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          /* Mettre en cache la réponse API fraîche */
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  /* Assets statiques : Cache-first, fallback réseau */
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        /* Mettre en cache dynamiquement les nouveaux assets */
        if (response.ok && event.request.method === 'GET') {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      });
    })
  );
});
