// Define un nombre y versión para el caché de la aplicación
const CACHE_NAME = 'fluir-cache-v1';

// Lista de archivos y recursos que se guardarán en el caché para uso offline
// Se incluyen los recursos externos como las fuentes de Google y Tailwind CSS
const urlsToCache = [
  '/',
  'index.html',
  'manifest.json',
  'icons/icon-192x192.png',
  'icons/icon-512x512.png',
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Kdam+Thmor+Pro&family=Inter:wght@400;600;700&display=swap',
  'https://fonts.gstatic.com/s/kdamthmorpro/v1/EJRPQgAzVsy-o4_22d1_T-Qj5g.woff2', // Recurso específico de la fuente
  'https://fonts.gstatic.com/s/inter/v13/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa1ZL7.woff2' // Recurso específico de la fuente
];

// Evento 'install': Se dispara cuando el Service Worker se instala por primera vez.
self.addEventListener('install', event => {
  // Espera hasta que la promesa se resuelva
  event.waitUntil(
    // Abre el caché con el nombre que definimos
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Caché abierto');
        // Agrega todos los archivos de nuestra lista al caché
        return cache.addAll(urlsToCache);
      })
  );
});

// Evento 'fetch': Se dispara cada vez que la aplicación solicita un recurso (una imagen, un script, etc.)
self.addEventListener('fetch', event => {
  event.respondWith(
    // Busca si el recurso solicitado ya está en el caché
    caches.match(event.request)
      .then(response => {
        // Si el recurso está en el caché, lo devuelve desde ahí (más rápido y funciona offline)
        if (response) {
          return response;
        }
        // Si no está en el caché, lo busca en la red
        return fetch(event.request);
      }
    )
  );
});

// Evento 'activate': Se dispara cuando el Service Worker se activa.
// Sirve para limpiar cachés antiguos si hemos actualizado la versión.
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            // Borra los cachés que no coincidan con el nombre del caché actual
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});