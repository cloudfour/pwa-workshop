/**
 * Progressive Web App Workshop presented by Cloud Four
 */

/**
 * This sets up a two-level version cache system.
 * Edit the `GLOBAL_VERSION` to delete all caches.
 * Edit the individual cache version to delete a specific cache.
 */
const GLOBAL_VERSION = 1;
const PWA_WORKSHOP = 'pwa-workshop';
const CACHES = {
  PRECACHED_ASSETS: `${PWA_WORKSHOP}-precached-assets-v${GLOBAL_VERSION + 0}`,
  IMAGES: `${PWA_WORKSHOP}-images-v${GLOBAL_VERSION + 0}`,
  RUNTIME: `${PWA_WORKSHOP}-runtime-v${GLOBAL_VERSION + 0}`
};

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

const IMAGE_REGEX = /\.(?:png|gif|jpg|jpeg|svg|webp)$/;

/**
 * The service worker `install` event is an ideal time to 
 * cache CSS, JS, image and font static assets.
 */
self.addEventListener('install', event => {
  console.group('Service Worker `install` Event');

  event.waitUntil(async function() {
    // Open the cache.
    const cache = await caches.open(CACHES.PRECACHED_ASSETS);

    // Install will not stop if one of these assets fails to cache.
    cache.addAll(PRECACHE_ASSETS.NICE_TO_HAVE)
      .then(() => console.log('Optional assets successfully cached!'))
      .catch(error => console.warn('Optional assets failed to cache:', error));

    // Install stops if one of these assets fails to cache.
    await cache.addAll(PRECACHE_ASSETS.MUST_HAVE)
      .then(() => console.log('Required assets successfully cached!'))
      .catch(error => console.warn('Required assets failed to cache:', error));

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
       * 2. It should not be found in the `CACHES` list
       */
      cacheNames.filter(cacheName => {
        return /^pwa-workshop/.test(cacheName) 
          && !Object.values(CACHES).includes(cacheName);
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
  const requestURL = new URL(request.url);

  // Local URLs
  if (requestURL.origin === location.origin) {
    /**
     * Images
     * Stale-While-Revalidate
     */
    if (isImageRequest(request)) {
      event.respondWith(async function() {
        const cachedImage = await caches.match(request);
        if (cachedImage) {
          console.info('Cache Fetch:', request.url);
          return cachedImage;
        }
        
        const networkImage = await fetch(request);
        const imagesCache = await caches.open(CACHES.IMAGES);
        event.waitUntil(
          imagesCache.put(request, networkImage.clone())
        );

        console.info('Network Fetch:', request.url);
        return networkImage;
      }());
      // Exit 
      return;
    }
  }

  /**
   * For everything else, use a Cache-First strategy:
   * 1. Look for the asset in all of the caches.
   * 2. If a cached version is found, return the cached response.
   * 3. If a cached version is not found, fetch from the network.
   */
  event.respondWith(async function() {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      console.info('Cache Fetch:', request.url);
      return cachedResponse;
    }
    console.info('Network Fetch:', request.url);
    return fetch(request);
}());
});

/**
 * Runtime Caching
 * 
 * Any assets that are not cached will be cached at runtime.
 */
// self.addEventListener('fetch', event => {
//   event.respondWith(async function() {
//     const cache = await caches.open(RUNTIME);
//     const cachedResponse = await cache.match(event.request);
    
//     if (cachedResponse) {
//       console.log('Cache Fetch!:', event.request.url);
//       return cachedResponse;
//     }

//     const networkResponse = await fetch(event.request);
//     event.waitUntil(
//       cache.put(event.request, networkResponse.clone())
//     )
//     console.log('Network Fetch!:', event.request.url);
//     return networkResponse;
//   }());
// });
