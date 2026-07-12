const CACHE_NAME = 'fini-cache-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/logo-pwa.svg',
  '/src/main.jsx',
  '/src/index.css'
];

// Install Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Pre-caching core offline shell');
      return cache.addAll(ASSETS).catch(err => {
        console.warn('[Service Worker] Cache addAll warning (some files might be generated dynamically):', err);
      });
    })
  );
  self.skipWaiting();
});

// Activate Service Worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[Service Worker] Removing old cache:', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch Strategy: Network-first falling back to cache for asset files, bypass for API requests
self.addEventListener('fetch', (event) => {
  const requestUrl = new URL(event.request.url);

  // Bypass service worker caching for API calls to ensure fresh real-time data
  if (requestUrl.pathname.startsWith('/api/')) {
    return;
  }

  // Handle asset caching (Stale While Revalidate or Network First)
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // If valid response, clone and update the cache
        if (response && response.status === 200 && response.type === 'basic') {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return response;
      })
      .catch(() => {
        // Fallback to cache if network fails (e.g. offline)
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // If offline and request is document, return root index
          if (event.request.headers.get('accept') && event.request.headers.get('accept').includes('text/html')) {
            return caches.match('/');
          }
        });
      })
  );
});
