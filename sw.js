// TosCheZy Service Worker
// Cache-first for the app shell, network-first for everything else.
// Bumping CACHE_VERSION invalidates old caches on next visit.

const CACHE_VERSION = 'toschezy-v2';
const APP_SHELL = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon.svg',
  '/icon-192.png',
  '/icon-512.png',
  '/icon-192-maskable.png',
  '/icon-512-maskable.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => {
      // addAll fails hard if any file 404s; add each independently instead
      return Promise.all(
        APP_SHELL.map((url) =>
          cache.add(url).catch((err) => console.warn('SW: failed to cache', url, err))
        )
      );
    })
  );
  // Do NOT skipWaiting automatically — let the page decide when to update
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_VERSION)
          .map((key) => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

// Listen for page telling us to activate immediately
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Only handle GET
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Cross-origin (esm.sh, trackers, etc.) — bypass SW entirely
  if (url.origin !== self.location.origin) return;

  // Service worker itself should never be cached
  if (url.pathname === '/sw.js') return;

  const isShell = APP_SHELL.some(
    (path) => url.pathname === path || url.pathname === path + '/'
  );

  if (!isShell) {
    // Network-first for non-shell same-origin, fall back to cache
    event.respondWith(
      fetch(request)
        .then((res) => {
          if (res && res.status === 200) {
            const copy = res.clone();
            caches.open(CACHE_VERSION).then((cache) => cache.put(request, copy));
          }
          return res;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // Cache-first for the app shell with background revalidation
  event.respondWith(
    caches.match(request).then((cached) => {
      const network = fetch(request)
        .then((res) => {
          if (res && res.status === 200) {
            const copy = res.clone();
            caches.open(CACHE_VERSION).then((cache) => cache.put(request, copy));
          }
          return res;
        })
        .catch(() => cached);

      return cached || network;
    })
  );
});