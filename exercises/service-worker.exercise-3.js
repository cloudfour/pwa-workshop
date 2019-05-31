/**
 * The name of the cache to store assets
 */
const PWA_WORKSHOP_CACHE = `pwa-workshop-v1`;

/**
 * The list of assets to precache
 * 
 * `MUST_HAVE`: The service worker will not complete install if 
 * these assets are not precached successfully.
 * `NICE_TO_HAVE`: The service worker will continue even if these
 * assets are not successfully precached.
 */
const PRECACHE_ASSETS = {
  MUST_HAVE: [
    '/css/styles.css',
    '/fonts/source-code-pro-v6-latin-regular.woff2',
    '/fonts/source-sans-pro-v9-latin-700.woff2',
    '/fonts/source-sans-pro-v9-latin_latin-ext-italic.woff2',
    '/fonts/source-sans-pro-v9-latin_latin-ext-regular.woff2',
    '/fonts/source-sans-pro-v9-subset-600.woff',
    '/scripts/main.js'
  ],
  NICE_TO_HAVE: [
    '/images/sky-friendly-robot.svg'
  ]
};

/**
 * The service worker `install` event is an ideal time to 
 * cache CSS, JS, image and font static assets.
 */
self.addEventListener('install', installEvent => {
  console.group('Service Worker `install` Event');

  installEvent.waitUntil(async function() {
    const cache = await caches.open(PWA_WORKSHOP_CACHE);

    // Nice to have assets: Install will succeed if one of these assets fails to cache
    cache.addAll(PRECACHE_ASSETS.NICE_TO_HAVE)
      .then(() => console.log('Optional assets successfully cached!'))
      .catch(error => console.warn('Optional assets failed to cache:', error));

    // Required assets: Install will fail if one of these assets fails to cache
    await cache.addAll(PRECACHE_ASSETS.MUST_HAVE)
      .then(() => console.log('Required assets successfully cached!'))
      .catch(error => console.warn('Required assets failed to cache:', error));

    console.groupEnd();
  }());
});

/**
 * Listen for the `fetch` event
 */
self.addEventListener('fetch', fetchEvent => {
  fetchEvent.respondWith(
    cacheFallingBackToNetwork(fetchEvent)
  );
});

/**
 * The "Cache, falling back to network" caching strategy
 * @see https://jakearchibald.com/2014/offline-cookbook/#cache-falling-back-to-network
 * @param {FetchEvent} fetchEvent A fetch event object
 * @returns {Promise} Resolves to a fetch Response object
 */
const cacheFallingBackToNetwork = async fetchEvent => {
  const request = fetchEvent.request;

  // Look for the request in the caches
  const cachedResponse = await caches.match(request);

  // If found, return the cached response
  if (cachedResponse) {
    console.log(`Fetch from cache: ${request.url}`);
    return cachedResponse;
  }

  // Otherwise, fetch from the network
  console.log(`Fetch from network: ${request.url}`);
  return fetch(request);
};
