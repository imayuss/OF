const CACHE_NAME = 'gsoc-finder-v6';
const CRITICAL_ASSETS = [
  './',
  'manifest.json',
  'icon-512.png'
];

const OPTIONAL_ASSETS = [
  'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Space+Grotesk:wght@400;500;600;700&family=Fira+Code:wght@400;500&display=swap',
  'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap'
];

globalThis.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      // Install critical assets first
      await cache.addAll(CRITICAL_ASSETS);

      // Try to cache optional assets individually, catching errors so they don't break install
      await Promise.all(
        OPTIONAL_ASSETS.map(async (url) => {
          try {
            const response = await fetch(url);
            if (response.status === 200 || response.ok) {
              await cache.put(url, response);
            }
          } catch (err) {
            console.warn('[ServiceWorker] Failed to precache optional asset:', url, err);
          }
        })
      );
    }).then(() => globalThis.skipWaiting())
  );
});

globalThis.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => globalThis.clients.claim())
  );
});

globalThis.addEventListener('fetch', (event) => {
  let url;
  try {
    url = new URL(event.request.url);
  } catch {
    return; // Ignore unparseable URLs
  }
  if (event.request.method && event.request.method !== 'GET') return;
  if (url.protocol && url.protocol !== 'http:' && url.protocol !== 'https:') return;

  // Network-First for API calls and data fetches.
  // /api/github keys stay query-sensitive (each repo slug differs).
  // /data/*.json is fetched with ?v=<timestamp> busters by the React hooks;
  // normalise to the canonical path so every bust hits the same cache entry
  // and the offline fallback actually works.
  const isDataJson = url.pathname.includes('/data/issues.json') || url.pathname.includes('/data/mentors.json');
  if (url.pathname.includes('/api/github') || isDataJson) {
    const cacheKey = isDataJson
      ? new Request(url.origin + url.pathname)  // strip query string
      : event.request;                           // keep query for GitHub API

    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response.status === 200) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(cacheKey, copy));
          }
          return response;
        })
        .catch(() => caches.match(cacheKey).then((res) => res || new Response('{"error":"offline"}', {
          headers: { 'Content-Type': 'application/json' }
        })))
    );
  } else {
    // Stale-While-Revalidate for static assets
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        const fetchPromise = fetch(event.request).then((networkResponse) => {
          if (networkResponse.status === 200) {
            const copy = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          }
          return networkResponse;
        }).catch(() => {
          if (event.request.mode === 'navigate') {
            // SPA: every route is served by the same shell, so fall back to the cached root.
            return caches.match(event.request).then((res) => res || caches.match('./'));
          }
          return caches.match(event.request);
        });

        return cachedResponse || fetchPromise;
      })
    );
  }
});
