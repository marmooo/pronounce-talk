const CACHE_NAME = "2025-07-21 00:00";
const urlsToCache = [
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
  "https://cdn.jsdelivr.net/npm/animate.css@4.1.1/animate.min.css",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    }),
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    }),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter((cacheName) => cacheName !== CACHE_NAME)
          .map((cacheName) => caches.delete(cacheName)),
      );
    }),
  );
});
