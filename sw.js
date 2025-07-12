const CACHE_NAME = 'fluir-cache-v2'; // Versión actualizada del caché

// Lista de archivos locales esenciales para el shell de la aplicación.
// Usamos rutas relativas para que funcione en GitHub Pages.
const urlsToCache = [
  '.', // Representa el directorio raíz (index.html)
  'index.html',
  'manifest.json',
  'icons/icon-192x192.png',
  'icons/icon-512x512.png'
];

// Evento 'install': Guarda el shell de la aplicación en el caché.
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Abriendo y cacheando el App Shell.');
        return cache.addAll(urlsToCache);
      })
  );
});

// Evento 'activate': Limpia los cachés antiguos.
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Borrando caché antiguo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Evento 'fetch': Sirve los archivos desde el caché o la red.
// Estrategia: Cache-First, luego Network y guardar en caché.
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        // Si el recurso está en el caché, lo devolvemos.
        if (cachedResponse) {
          return cachedResponse;
        }

        // Si no, lo buscamos en la red.
        return fetch(event.request).then(
          networkResponse => {
            // Verificamos que la respuesta sea válida.
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
              return networkResponse;
            }
            
            // Clonamos la respuesta. Una se guarda en el caché y la otra se envía al navegador.
            const responseToCache = networkResponse.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                // Guardamos la nueva respuesta en el caché para uso futuro.
                cache.put(event.request, responseToCache);
              });

            return networkResponse;
          }
        );
      })
  );
});
