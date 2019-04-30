const CACHE_NAME = "beat-maker-cache-v1";

const urlsToCache = [
    "/beat",
    "/beat/index.css",
    "/beat/index.js",
    "/beat/icon.svg",
    "/beat/icon-128.png",
    "/beat/icon-512.png"
];

self.addEventListener("install", function(event) {
    console.log('Installing v1');

    // Perform install steps
    event.waitUntil(
        caches.open(CACHE_NAME).then(function(cache) {
            return cache.addAll(urlsToCache);
        })
    );
});

self.addEventListener("fetch", function(event) {
    event.respondWith(
        caches.match(event.request).then(function(response) {
            // Cache hit - return response
            if (response) { return response; }
            return fetch(event.request);
        })
    );
});
