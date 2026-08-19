const CACHE_VERSION = 'ad-diamantina-pwa-v4';
const FIRESTORE_IMAGES_URL = 'https://firestore.googleapis.com/v1/projects/ad-diamantina/databases/(default)/documents/site/imagens';
const DYNAMIC_ICON_ROUTES = {
  '/pwa-icon-192.png': { field: 'favicon192', fallbackField: 'favicon', fallback: '/icons/icon-192.png' },
  '/pwa-icon-512.png': { field: 'favicon512', fallbackField: 'favicon', fallback: '/icons/icon-512.png' }
};
const APP_SHELL = [
  '/',
  '/index.html',
  '/congregacoes.html',
  '/congregacao.html',
  '/favicon.svg',
  '/manifest.webmanifest',
  '/pwa-icon-192.png',
  '/pwa-icon-512.png',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/css/style.css',
  '/css/radio-player.css',
  '/js/favicon.js',
  '/js/main.js',
  '/js/pwa.js',
  '/js/radio-player.js'
];

async function getDynamicIconResponse(request, config) {
  const cache = await caches.open(CACHE_VERSION);
  try {
    const firestoreResponse = await fetch(FIRESTORE_IMAGES_URL, { cache: 'no-store' });
    if (firestoreResponse.ok) {
      const payload = await firestoreResponse.json();
      const dynamicUrl = payload.fields?.[config.field]?.stringValue || payload.fields?.[config.fallbackField]?.stringValue;
      if (dynamicUrl) {
        const iconResponse = await fetch(dynamicUrl, { mode: 'no-cors', cache: 'no-store' });
        if (iconResponse.ok || iconResponse.type === 'opaque') {
          await cache.put(request, iconResponse.clone());
          return iconResponse;
        }
      }
    }
  } catch (error) {
    // A falha no Storage/Firestore não deve impedir a instalação do app.
  }

  return (await cache.match(request)) || (await cache.match(config.fallback)) || fetch(config.fallback);
}

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_VERSION)
      .then(cache => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys
          .filter(key => key.startsWith('ad-diamantina-pwa-') && key !== CACHE_VERSION)
          .map(key => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  const dynamicIcon = DYNAMIC_ICON_ROUTES[url.pathname];
  if (dynamicIcon) {
    event.respondWith(getDynamicIconResponse(request, dynamicIcon));
    return;
  }

  if (request.mode === 'navigate') {
    const publicPages = new Set(['/', '/index.html', '/congregacoes.html', '/congregacao.html']);
    if (!publicPages.has(url.pathname)) return;

    event.respondWith(
      fetch(request)
        .then(response => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE_VERSION).then(cache => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => caches.match(request).then(cached => cached || caches.match(url.pathname).then(pathCached => pathCached || caches.match('/index.html'))))
    );
    return;
  }

  const isStaticAsset = /\.(?:css|js|svg|png|webmanifest)$/i.test(url.pathname);
  if (!isStaticAsset) return;

  event.respondWith(
    caches.match(request).then(cached => {
      const network = fetch(request).then(response => {
        if (response.ok) {
          const copy = response.clone();
          caches.open(CACHE_VERSION).then(cache => cache.put(request, copy));
        }
        return response;
      });
      return cached || network;
    })
  );
});
