// sw.js
const CACHE_NAME = 'birthday-cache-v1';
const URLsToCache = [
    '/',
    '/index.html',
    '/css/styles.css',
    '/js/app.js',
    '/js/loader.js',
    '/js/countdown.js',
    '/js/blow.js',
    '/js/gallery.js',
    '/js/guestbook.js',
    '/img/photo1.jpg',
    '/img/photo2.jpg',
    '/img/photo3.jpg',
    '/img/photo4.jpg',
    '/img/photo5.jpg',
    '/img/photo6.jpg',
    '/audio/blow-sound.mp3',
    '/audio/voice-message.mp3',
    '/audio/birthday_song.mp3',  // <-- ADD THIS!
    '/libs/dompurify.min.js'
  ];

// Install event: cache essential assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(URLsToCache))
      .then(self.skipWaiting())
  );
});

// Activate event: clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => 
      Promise.all(
        cacheNames.map(name => {
          if (name !== CACHE_NAME) {
            return caches.delete(name);
          }
        })
      )
    ).then(() => self.clients.claim())
  );
});

// Fetch event: respond with cache, fallback to network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
