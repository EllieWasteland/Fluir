// Define un nombre y una versión para tu caché
const CACHE_NAME = 'foco-cache-v1.0';

// Lista de archivos y recursos esenciales para que la app funcione sin conexión
const urlsToCache = [
  '/', // La raíz de la app
  'index.html', // El archivo HTML principal
  // Recursos externos (¡importante para el modo offline!)
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Kdam+Thmor+Pro&family=Inter:wght@400;600;700&display=swap',
  'https://raw.githubusercontent.com/lucasromerodb/liquid-glass-effect-macos/refs/heads/main/assets/flowers.jpg',
  // Sonidos del modo Zen
  'https://www.soundjay.com/nature/rain-light-2.mp3',
  'https://www.soundjay.com/nature/forest-reverb-1.mp3',
  'https://www.soundjay.com/nature/white-noise-1.mp3',
  // Iconos de la app
  'icons/icon-192x192.png',
  'icons/icon-512x512.png'
];

// Evento 'install': Se dispara cuando el Service Worker se instala por primera vez.
self.addEventListener('install', event => {
  // Espera hasta que la promesa dentro de waitUntil se resuelva
  event.waitUntil(
    // Abre la caché con el nombre que definimos
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache abierta exitosamente');
        // Añade todos los recursos de nuestra lista a la caché
        return cache.addAll(urlsToCache);
      })
  );
});

// Evento 'fetch': Se dispara cada vez que la app realiza una petición de red (pide un archivo, una imagen, etc.)
self.addEventListener('fetch', event => {
  event.respondWith(
    // Intenta encontrar una respuesta para esta petición en nuestra caché
    caches.match(event.request)
      .then(response => {
        // Si encontramos una respuesta en la caché, la devolvemos
        if (response) {
          return response;
        }
        // Si no, realizamos la petición a la red como se haría normalmente
        return fetch(event.request);
      })
  );
});

// Evento 'activate': Se dispara cuando el Service Worker se activa.
// Es un buen lugar para limpiar cachés antiguas.
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME]; // Lista de cachés que queremos mantener

  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // Si una caché no está en nuestra lista blanca, la eliminamos
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});