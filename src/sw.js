const cacheName = "2025-11-27 00:00";
const urlsToCache = [
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

async function preCache() {
  const cache = await caches.open(cacheName);
  await Promise.all(
    urlsToCache.map((url) =>
      cache.add(url).catch((e) => console.warn("Failed to cache", url, e))
    ),
  );
  self.skipWaiting();
}

async function handleFetch(event) {
  const cached = await caches.match(event.request);
  return cached || fetch(event.request);
}

async function cleanOldCaches() {
  const cacheNames = await caches.keys();
  await Promise.all(
    cacheNames.map((name) => name !== cacheName ? caches.delete(name) : null),
  );
  self.clients.claim();
}

self.addEventListener("install", (event) => {
  event.waitUntil(preCache());
});
self.addEventListener("fetch", (event) => {
  event.respondWith(handleFetch(event));
});
self.addEventListener("activate", (event) => {
  event.waitUntil(cleanOldCaches());
});
