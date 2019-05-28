/**
 * This sets up a two-level version cache names.
 * Edit the GLOBAL_VERSION to purge all caches.
 * Edit the individual cache version to purge specific cache.
 */
// const GLOBAL_VERSION = 1;
// const CACHES = {
//   PRECACHE: `old-navy-pwa-precache-v${GLOBAL_VERSION + 0}`,
//   NUXT: `old-navy-pwa-assets-nuxt-v${GLOBAL_VERSION + 1}`,
//   GAP: `old-navy-pwa-assets-gap-v${GLOBAL_VERSION + 0}`,
//   PROLIFIC: `old-navy-pwa-assets-prolific-v${GLOBAL_VERSION + 0}`
// };

const PWA_WORKSHOP = 'pwa-workshop';
const IMAGE_REGEX = /\.(?:png|gif|jpg|jpeg|svg|webp)$/;

/**
 * This sets up a two-level version cache system.
 * Edit the `GLOBAL_VERSION` to delete all caches.
 * Edit the individual cache version to delete a specific cache.
 */
const GLOBAL_VERSION = 1;
const STATIC_ASSETS_CACHE = `${PWA_WORKSHOP}-static-assets-v${GLOBAL_VERSION + 0}`;
const RUNTIME_CACHE = `${PWA_WORKSHOP}-runtime-v${GLOBAL_VERSION + 0}`;

// Store the most current cache names. Helps to delete out-of-date caches.
const EXPECTED_CACHES = [
  STATIC_ASSETS_CACHE,
  RUNTIME_CACHE
];

const MUST_HAVE_STATIC_ASSETS = [
  '/css/styles.css',
  '/images/sky-friendly-robot.svg',
  '/fonts/source-sans-pro-v9-latin_latin-ext-regular.woff2',
  '/fonts/source-code-pro-v6-latin-regular.woff2',
  '/scripts/main.js'
];
const NICE_TO_HAVE_STATIC_ASSETS = [
  'images/portland.svg'
];

/**
 * The service worker `install` event is an ideal time to 
 * cache CSS, JS, image and font static assets.
 */
self.addEventListener('install', event => {
  console.group('Service Worker `install` Event');

  event.waitUntil(async function() {
    // Open the cache.
    const cache = await caches.open(STATIC_ASSETS_CACHE);

    // Install will not stop if one of these assets fails to cache.
    cache.addAll(NICE_TO_HAVE_STATIC_ASSETS)
      .then(() => console.log('Secondary assets successfully cached!'))
      .catch(error => console.error('Secondary assets failed to cache:', error));

    // Install stops if one of these assets fails to cache.
    await cache.addAll(MUST_HAVE_STATIC_ASSETS)
      .then(() => console.log('Primary assets successfully cached!'))
      .catch(error => console.error('Primary assets failed to cache:', error));

    console.groupEnd();
  }());
});

/**
 * The service worker `activate` event is an ideal moment to 
 * delete out-of-date caches.
 */
self.addEventListener('activate', event => {
  console.group('Service Worker `activate` Event');

  event.waitUntil(async function() {
    // Get the names of all the existing caches.
    const cacheNames = await caches.keys();
    await Promise.all(
      /**
       * Filter for the caches we want to delete:
       * 1. The name should start with `pwa-workshop`
       * 2. It should not be found in the `EXPECTED_CACHES` list
       */
      cacheNames.filter(cacheName => {
        return /^pwa-workshop/.test(cacheName) 
          && !EXPECTED_CACHES.includes(cacheName);
      }).map(cacheName => {
        console.log(`Deleting cache "${cacheName}"`);
        return caches.delete(cacheName);
      })
    );

    console.groupEnd();
  }());
});

/**
 * Helper to know if the request is an image request
 * @param {Object} request The event request object
 * @returns {boolean} Is the request an image request?
 */
const isImageRequest = request => IMAGE_REGEX.test(request.url);

/**
 * Handle the `fetch` service worker event.
 */
self.addEventListener('fetch', event => {
  const request = event.request;

  /**
   * Images
   */
  if (isImageRequest(request)) {
    console.log('Image!!!', request.url);
  }

  /**
   * For everything else, use a Cache-First strategy:
   * 1. Look for the asset in all of the caches.
   * 2. If a cached version is found, return the cached response.
   * 3. If a cached version is not found, fetch from the network.
   */
  event.respondWith(async function() {
    const cachedResponse = await caches.match(request);
    return cachedResponse || fetch(request);
  }());
});

/**
 * Runtime Caching
 * 
 * Any assets that are not cached will be cached at runtime.
 */
// self.addEventListener('fetch', event => {
//   event.respondWith(async function() {
//     const cache = await caches.open(RUNTIME_CACHE);
//     const cachedResponse = await cache.match(event.request);
    
//     if (cachedResponse) {
//       console.log('From Cache!:', event.request.url);
//       return cachedResponse;
//     }

//     const networkResponse = await fetch(event.request);
//     event.waitUntil(
//       cache.put(event.request, networkResponse.clone())
//     )
//     console.log('From Network!:', event.request.url);
//     return networkResponse;
//   }());
// });
