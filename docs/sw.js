var CACHE_NAME="2022-10-06 11:45",urlsToCache=["/pronounce-talk/","/pronounce-talk/index.js","/pronounce-talk/data/0.csv","/pronounce-talk/data/1.csv","/pronounce-talk/data/2.csv","/pronounce-talk/data/3.csv","/pronounce-talk/data/4.csv","/pronounce-talk/data/5.csv","/pronounce-talk/mp3/end.mp3","/pronounce-talk/mp3/incorrect1.mp3","/pronounce-talk/mp3/correct3.mp3","/pronounce-talk/favicon/favicon.svg","https://marmooo.github.io/fonts/textar-light.woff2","https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/css/bootstrap.min.css","https://cdn.jsdelivr.net/npm/animate.css@4.1.1/animate.min.css"];self.addEventListener("install",function(a){a.waitUntil(caches.open(CACHE_NAME).then(function(a){return a.addAll(urlsToCache)}))}),self.addEventListener("fetch",function(a){a.respondWith(caches.match(a.request).then(function(b){return b||fetch(a.request)}))}),self.addEventListener("activate",function(a){var b=[CACHE_NAME];a.waitUntil(caches.keys().then(function(a){return Promise.all(a.map(function(a){if(b.indexOf(a)===-1)return caches.delete(a)}))}))})