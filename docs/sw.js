const CACHE_NAME="2023-12-25 00:20",urlsToCache=["/pronounce-talk/","/pronounce-talk/index.js","/pronounce-talk/data/0.csv","/pronounce-talk/data/1.csv","/pronounce-talk/data/2.csv","/pronounce-talk/data/3.csv","/pronounce-talk/data/4.csv","/pronounce-talk/data/5.csv","/pronounce-talk/mp3/end.mp3","/pronounce-talk/mp3/incorrect1.mp3","/pronounce-talk/mp3/correct3.mp3","/pronounce-talk/favicon/favicon.svg","https://marmooo.github.io/fonts/textar-light.woff2","https://cdn.jsdelivr.net/npm/animate.css@4.1.1/animate.min.css"];self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE_NAME).then(e=>e.addAll(urlsToCache)))}),self.addEventListener("fetch",e=>{e.respondWith(caches.match(e.request).then(t=>t||fetch(e.request)))}),self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(e=>Promise.all(e.filter(e=>e!==CACHE_NAME).map(e=>caches.delete(e)))))})