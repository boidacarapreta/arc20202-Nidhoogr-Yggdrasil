const version = "0.1.0";
const cacheName = "nidhoogr-game";
const precacheResources = [
  "./src/assets/images/logo/logo128.png",
  "./src/assets/images/logo/logo192.png",
  "./src/assets/images/logo/logo256.png",
  "./src/assets/images/logo/logo384.png",
  "./src/assets/images/logo/logo512.png",

  "./src/assets/images/player/jump.png",
  "./src/assets/images/player/run.png",

  "./src/assets/images/audio/music/introMusic.wav",
  "./src/assets/images/audio/music/runGameMusic.wav",

  "./src/assets/images/audio/jump/jump_01.mp3",
  "./src/assets/images/audio/jump/jump_02.mp3",
  "./src/assets/images/audio/jump/jump_03.mp3",

  "./src/index.js",
];

self.addEventListener("install", (event) => {
  console.log("Service worker install event!");
  event.waitUntil(
    caches.open(cacheName).then((cache) => {
      return cache.addAll(precacheResources).then(() => self.skipWaiting());
    })
  );
});

self.addEventListener("activate", (event) => {
  console.log("Service worker activate event!");
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  console.log("Fetch intercepted for: ", event.request.url);
  event.respondWith(
    caches
      .open(cacheName)
      .then((cache) => cache.match(event.request, { ignoreSearch: true }))
      .then((response) => {
        return response || fetch(event.request);
      })
  );
});
