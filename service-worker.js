const CACHE_VERSION = 'ad-diamantina-pwa-v34';
const FIRESTORE_IMAGES_URL = 'https://firestore.googleapis.com/v1/projects/ad-diamantina/databases/(default)/documents/site/imagens';
const DYNAMIC_ICON_ROUTES = {
  '/pwa-icon-192.png': { field: 'favicon192', dataField: 'faviconData192', fallbackField: 'favicon', fallback: '/icons/icon-192.png' },
  '/pwa-icon-512.png': { field: 'favicon512', dataField: 'faviconData512', fallbackField: 'favicon', fallback: '/icons/icon-512.png' }
};
const APP_SHELL = [
  '/',
  '/index.html',
  '/congregacoes.html',
  '/congregacao.html',
  '/igreja.html',
  '/ministerio.html',
  '/noticia.html',
  '/favicon.svg',
  '/manifest.webmanifest',
  '/pwa-icon-192.png',
  '/pwa-icon-512.png',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/css/style.css',
  '/css/corpo-obreiros.css?v=1',
  '/css/floating-actions.css?v=1',
  '/css/igreja.css',
  '/css/radio-player.css',
  '/css/banner-carousel.css?v=1',
  '/css/noticia.css?v=1',
  '/js/favicon.js',
  '/js/firebase-client.js',
  '/js/corpo-obreiros.js',
  '/js/main.js',
  '/js/pwa.js',
  '/js/radio-player.js',
  '/js/banner-carousel.js',
  '/js/noticia.js',
  '/js/floating-actions.js',
  '/components/corpo-obreiros.html'
];

function responseFromDataUrl(dataUrl) {
  const separator = dataUrl.indexOf(',');
  if (separator < 0) return null;
  const header = dataUrl.slice(0, separator);
  const encoded = dataUrl.slice(separator + 1);
  const mime = header.match(/^data:([^;]+)/)?.[1] || 'image/png';
  const binary = atob(encoded);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
  return new Response(bytes, { headers: { 'Content-Type': mime, 'Cache-Control': 'no-cache' } });
}

async function withWhiteIconBackground(response) {
  if (!self.OffscreenCanvas || !self.createImageBitmap) return response;
  const fallback = response.clone();
  try {
    const blob = await response.blob();
    const bitmap = await self.createImageBitmap(blob);
    const size = Math.max(bitmap.width, bitmap.height);
    const canvas = new self.OffscreenCanvas(size, size);
    const context = canvas.getContext('2d');
    if (!context) {
      bitmap.close?.();
      return fallback;
    }
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, size, size);
    const scale = Math.min(size / bitmap.width, size / bitmap.height);
    const width = Math.round(bitmap.width * scale);
    const height = Math.round(bitmap.height * scale);
    context.drawImage(bitmap, Math.round((size - width) / 2), Math.round((size - height) / 2), width, height);
    bitmap.close?.();
    const output = await canvas.convertToBlob({ type: 'image/png' });
    return new Response(output, { headers: { 'Content-Type': 'image/png', 'Cache-Control': 'no-cache' } });
  } catch (error) {
    return fallback;
  }
}

async function getDynamicIconResponse(request, config) {
  const cache = await caches.open(CACHE_VERSION);
  try {
    const firestoreResponse = await fetch(FIRESTORE_IMAGES_URL, { cache: 'no-store' });
    if (firestoreResponse.ok) {
      const payload = await firestoreResponse.json();
      const dataUrl = payload.fields?.[config.dataField]?.stringValue;
      if (dataUrl?.startsWith('data:image/png;base64,')) {
          const iconResponse = responseFromDataUrl(dataUrl);
          if (iconResponse) {
            const whiteIconResponse = await withWhiteIconBackground(iconResponse);
            await cache.put(request, whiteIconResponse.clone());
            return whiteIconResponse;
          }
      }
      const dynamicUrl = payload.fields?.[config.field]?.stringValue || payload.fields?.[config.fallbackField]?.stringValue;
      if (dynamicUrl) {
        try {
          const iconResponse = await fetch(dynamicUrl, { mode: 'cors', cache: 'no-store' });
          if (iconResponse.ok && iconResponse.type !== 'opaque') {
            const whiteIconResponse = await withWhiteIconBackground(iconResponse);
            await cache.put(request, whiteIconResponse.clone());
            return whiteIconResponse;
          }
        } catch (error) {
          // O Storage sem CORS cai para o PNG same-origin abaixo.
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
    const publicPages = new Set(['/', '/index.html', '/congregacoes.html', '/congregacao.html', '/igreja.html', '/ministerio.html', '/noticia.html']);
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
  const isCachedComponent = url.pathname === '/components/corpo-obreiros.html';
  if (!isStaticAsset && !isCachedComponent) return;

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
