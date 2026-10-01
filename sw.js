/* Mochi service worker — offline app shell (cache-first). */
const CACHE = "mochi-v1";
const SHELL = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./css/style.css",
  "./js/config.js",
  "./js/icons.js",
  "./js/stickers.js",
  "./js/upi.js",
  "./js/editor.js",
  "./js/app.js",
  "./vendor/qrcode.min.js",
  "./fonts/inter-var.woff2",
  "./fonts/unbounded-var.woff2",
  "./assets/logo.png",
  "./assets/icon-192.png",
  "./assets/icon-512.png",
];
self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});
self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    caches.match(e.request, { ignoreSearch: false }).then(
      (hit) => hit || fetch(e.request).then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(e.request, copy)).catch(() => {});
        return res;
      }).catch(() => caches.match("./index.html"))
    )
  );
});
