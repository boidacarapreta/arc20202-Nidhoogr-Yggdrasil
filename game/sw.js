import {
  highClouds,
  lowClouds,
  montainTips,
  skyBackground,
  //----
  DudeJump,
  DudeRun,
  //----
  OwletJump,
  OwletRun,
  //----
  PinkJump,
  PinkRun,
  //----
  plataform,
  //----
  jumpSoundVariantOne,
  jumpSoundVariantTwo,
  jumpSoundVariantThree,
  //----
  introMusic,
  runGameMusic,
} from "./src/assets";

const version = "0.1.0";
const cacheName = "nidhoogr-game";
const precacheResources = [
  highClouds,
  lowClouds,
  montainTips,
  skyBackground,
  //----
  DudeJump,
  DudeRun,
  //----
  OwletJump,
  OwletRun,
  //----
  PinkJump,
  PinkRun,
  //----
  plataform,
  //----
  jumpSoundVariantOne,
  jumpSoundVariantTwo,
  jumpSoundVariantThree,
  //----
  introMusic,
  runGameMusic,
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
