const CACHE_NAME = 'intragram-v2';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Instagram_logo_2016.svg/192px-Instagram_logo_2016.svg.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter((name) => name !== CACHE_NAME).map((name) => caches.delete(name))
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Skip non-GET requests and browser extensions
  if (event.request.method !== 'GET' || !url.protocol.startsWith('http')) return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Return cached response if found
      const fetchPromise = fetch(event.request).then((response) => {
        // Cache images and videos dynamically if they are successful
        if (response && response.status === 200 || response.type === 'opaque') {
          const contentType = response.headers.get('content-type');
          const isMedia = contentType && (contentType.startsWith('image/') || contentType.startsWith('video/'));
          const isAsset = url.origin === self.location.origin;
          const isExternalMedia = [
            'picsum.photos',
            'unsplash.com',
            'cloudinary',
            'catbox.moe',
            'imgur.com',
            'redd.it',
            'discordapp',
            'tenor.com',
            'giphy.com',
            'googleusercontent'
          ].some(domain => url.href.includes(domain));

          if (isMedia || isAsset || isExternalMedia) {
            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
        }
        return response;
      }).catch((err) => {
        // If fetch fails (offline) and we have it in cache, we're good (handled by cachedResponse above)
        // If not in cache, fallback
        if (event.request.destination === 'image') {
          return caches.match('https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Instagram_logo_2016.svg/192px-Instagram_logo_2016.svg.png');
        }
        return caches.match('/');
      });

      return cachedResponse || fetchPromise;
    })
  );
});
