var CACHE_NAME = "2022-10-08 11:03";
var urlsToCache = [
  "/pronounce-talk/",
  "/pronounce-talk/index.js",
  "/pronounce-talk/data/0.csv",
  "/pronounce-talk/data/1.csv",
  "/pronounce-talk/data/2.csv",
  "/pronounce-talk/data/3.csv",
  "/pronounce-talk/data/4.csv",
  "/pronounce-talk/data/5.csv",
  "/pronounce-talk/mp3/end.mp3",
  "/pronounce-talk/mp3/incorrect1.mp3",
  "/pronounce-talk/mp3/correct3.mp3",
  "/pronounce-talk/favicon/favicon.svg",
  "https://marmooo.github.io/fonts/textar-light.woff2",
  "https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/css/bootstrap.min.css",
  "https://cdn.jsdelivr.net/npm/animate.css@4.1.1/animate.min.css",
];

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then(function (cache) {
        return cache.addAll(urlsToCache);
      }),
  );
});

self.addEventListener("fetch", function (event) {
  event.respondWith(
    caches.match(event.request)
      .then(function (response) {
        if (response) {
          return response;
        }
        return fetch(event.request);
      }),
  );
});

self.addEventListener("activate", function (event) {
  var cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames.map(function (cacheName) {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        }),
      );
    }),
  );
});
