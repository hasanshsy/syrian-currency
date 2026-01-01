self.addEventListener("install", e => {
  e.waitUntil(
    caches.open("currency-app").then(cache => {
      return cache.addAll([
        "/syrian-currency/",
        "/syrian-currency/index.html",
        "/syrian-currency/manifest.json",
        "/syrian-currency/icon.png"
      ]);
    })
  );
});

self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(response => response || fetch(e.request))
  );
});
