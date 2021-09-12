var CACHE_NAME = '2021-09-12 11:35';
var urlsToCache = [
  '/pronounce-talk/',
  '/pronounce-talk/0.csv',
  '/pronounce-talk/1.csv',
  '/pronounce-talk/2.csv',
  '/pronounce-talk/3.csv',
  '/pronounce-talk/4.csv',
  '/pronounce-talk/5.csv',
  '/pronounce-talk/index.js',
  '/pronounce-talk/mp3/end.mp3',
  '/pronounce-talk/mp3/incorrect1.mp3',
  '/pronounce-talk/mp3/correct3.mp3',
  '/pronounce-talk/favicon/original.svg',
  'https://marmooo.github.io/fonts/textar-light.woff2',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css',
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches
    .open(CACHE_NAME)
    .then(function(cache) {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

self.addEventListener('activate', function(event) {
  var cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
