/* PWA Service Worker - Calculadora */

const CACHE_VERSION = 'v1';
const CACHE_NAME = `calculadora-pwa-${CACHE_VERSION}`;

const STATIC_ASSETS = [
  './',
  './index.html',
  './src/css/style.css',
  './src/js/tema.js',
  './src/js/calcular.js',
  './src/js/teclado.js',
  './src/img/logo.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      await cache.addAll(STATIC_ASSETS);
      self.skipWaiting();
    })()
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      );
      self.clients.claim();
    })()
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Só cacheia requests do mesmo origin
  if (url.origin !== self.location.origin) return;

  // HTML: tenta no cache, senão vai pra rede; se falhar, retorna index
  if (request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        const cached = await caches.match('./index.html');
        try {
          const response = await fetch(request);
          // Atualiza cache se vier HTML novo
          const cache = await caches.open(CACHE_NAME);
          cache.put('./index.html', response.clone());
          return response;
        } catch (e) {
          return cached || new Response('Offline', { status: 200, headers: { 'Content-Type': 'text/plain' } });
        }
      })()
    );
    return;
  }

  // Assets estáticos: cache-first
  if (
    STATIC_ASSETS.includes(url.pathname.replace(self.location.origin, '')) ||
    STATIC_ASSETS.includes(`.${url.pathname}`)
  ) {
    event.respondWith(
      (async () => {
        const cached = await caches.match(request);
        if (cached) return cached;
        const response = await fetch(request);
        const cache = await caches.open(CACHE_NAME);
        cache.put(request, response.clone());
        return response;
      })()
    );
    return;
  }
});

