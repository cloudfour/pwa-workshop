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

/**
 * This sets up a two-level version cache system.
 * Edit the `GLOBAL_VERSION` to delete all caches.
 * Edit the individual cache version to delete a specific cache.
 */
const GLOBAL_VERSION = 2;
const STATIC_ASSETS_CACHE = `${PWA_WORKSHOP}-static-assets-v${GLOBAL_VERSION + 0}`;
const RUNTIME_CACHE = `${PWA_WORKSHOP}-runtime-v${GLOBAL_VERSION + 0}`;

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
  console.group('Service Worker `install` Event')

  event.waitUntil(async function() {
    console.log(`Attempting to add assets to the "${STATIC_ASSETS_CACHE}" cache...`);

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
       * Filter for the caches we want to delete.
       * We want to make sure it's a cache we added first.
       * Then check against the current cache version.
       */
      cacheNames.filter(cacheName => {
        return /^pwa-workshop/.test(cacheName) 
          && cacheName !== STATIC_ASSETS_CACHE;
      }).map(cacheName => {
        console.log(`Deleting cache "${cacheName}"`);
        return caches.delete(cacheName);
      })
    );

    console.groupEnd();
  }());
});

/**
 * Runtime Caching
 * 
 * Any assets that are not cached will be cached at runtime.
 */
self.addEventListener('fetch', event => {
  event.respondWith(async function() {
    const cache = await caches.open(RUNTIME_CACHE);
    const cachedResponse = await cache.match(event.request);
    
    if (cachedResponse) {
      console.log('From Cache:', event.request.url);
      return cachedResponse;
    }

    const networkResponse = await fetch(event.request);
    event.waitUntil(
      cache.put(event.request, networkResponse.clone())
    )
    console.log('From Network:', event.request.url);
    return networkResponse;
  }());
});

/**
 * Cache-First Strategy
 * 
 * Check the cache first, if nothing found, 
 * then use the network as a fallback.
 */
self.addEventListener('fetch', event => {
  event.respondWith(async function() {
    const response = await caches.match(event.request);

    response && console.log('From Cache:', event.request.url);
    !response && console.log('From Network:', event.request.url);

    return response || fetch(event.request);
  }());
});
