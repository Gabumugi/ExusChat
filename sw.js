// Nexus Service Worker
// Cache-first for the app shell, network-only for everything else.
// Bumping CACHE_VERSION invalidates old caches on next visit.

const CACHE_VERSION = 'nexus-v1';
const APP_SHELL = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon.svg',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
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

self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Only handle GET
  if (request.method !== 'GET') return;

  // Don't touch cross-origin (esm.sh, trackers, etc.)
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Only handle same-origin shell assets
  const isShell = APP_SHELL.some((path) => url.pathname === path || url.pathname === path + '/');
  if (!isShell) {
    // Network-only for everything else, but fall back to cache on failure
    event.respondWith(
      fetch(request).catch(() => caches.match(request))
    );
    return;
  }

  // Cache-first for app shell
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) {
        // Refresh in background
        fetch(request)
          .then((res) => {
            if (res && res.status === 200) {
              caches.open(CACHE_VERSION).then((cache) => cache.put(request, res.clone()));
            }
          })
          .catch(() => {});
        return cached;
      }
      return fetch(request).then((res) => {
        if (res && res.status === 200) {
          const copy = res.clone();
          caches.open(CACHE_VERSION).then((cache) => cache.put(request, copy));
        }
        return res;
      });
    })
  );
});