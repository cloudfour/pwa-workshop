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

const CACHE_REGEX = /^pwa-workshop/;
const PWA_WORKSHOP = 'pwa-workshop';

/**
 * This sets up a two-level version cache system.
 * Edit the `GLOBAL_VERSION` to delete all caches.
 * Edit the individual cache version to delete a specific cache.
 */
const GLOBAL_VERSION = 1;
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
      // Filter for the caches we want to delete.
      cacheNames.filter(cacheName => {
        // We want to make sure it's a cache we added.
        return CACHE_REGEX.test(cacheName) 
          // Then compare against the current version.
          && cacheName !== STATIC_ASSETS_CACHE;
      })
      // We now have an array of caches to delete, so delete them.
      .map(cacheName => {
        console.log(`Deleting cache "${cacheName}"`);
        return caches.delete(cacheName);
      })
    );

    console.groupEnd();
  }());
});

self.addEventListener('fetch', event => {
  console.log('Fetch occurred for:', event.request.url);
});
