// ponytail: runtime cache-as-you-go instead of a hand-maintained precache list —
// Vite's build output has hashed filenames, so caching whatever gets fetched is
// simpler and doesn't need updating every build.
const CACHE = 'wod-clock-v2';

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;

  // Navigations (index.html) always go to the network first so a new deploy
  // is picked up immediately instead of being served from cache forever —
  // hashed asset URLs referenced by an old cached index.html would otherwise
  // never be re-fetched. Falls back to cache only when offline.
  if (e.request.mode === 'navigate') {
    e.respondWith(
      fetch(e.request)
        .then((res) => {
          caches.open(CACHE).then((cache) => cache.put(e.request, res.clone()));
          return res;
        })
        .catch(() => caches.match(e.request))
    );
    return;
  }

  // Hashed build assets never change content under the same URL, so
  // cache-first keeps the workout usable with no signal in the gym.
  e.respondWith(
    caches.open(CACHE).then(async (cache) => {
      const cached = await cache.match(e.request);
      if (cached) return cached;
      try {
        const res = await fetch(e.request);
        if (res.ok) cache.put(e.request, res.clone());
        return res;
      } catch (err) {
        return cached || Response.error();
      }
    })
  );
});
