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

/**
 * This sets up a two-level version cache system.
 * Edit the `GLOBAL_VERSION` to delete all caches.
 * Edit the individual cache version to delete a specific cache.
 */
const GLOBAL_VERSION = 1;
const STATIC_ASSETS_CACHE = `pwa-workshop-static-assets-v${GLOBAL_VERSION + 0}`;
const RUNTIME_CACHE = `pwa-workshop-runtime-v${GLOBAL_VERSION + 0}`;

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
    console.log('Attempting to add assets to the "%s" cache...', STATIC_ASSETS_CACHE );

    // Open the cache
    const cache = await caches.open(STATIC_ASSETS_CACHE);

    // Install won't fail if one of these assets fails to cache
    cache.addAll(NICE_TO_HAVE_STATIC_ASSETS)
      .then(() => console.log('Secondary assets successfully cached!'))
      .catch(error => console.error('Secondary assets failed to cache:', error));

    // Install stops if one of these assets fails to cache
    await cache.addAll(MUST_HAVE_STATIC_ASSETS)
      .then(() => console.log('Primary assets successfully cached!'))
      .catch(error => console.error('Primary assets failed to cache:', error));

    console.groupEnd();
  }());
});

self.addEventListener('activate', event => {
  console.group('Service Worker `activate` Event')
});

self.addEventListener('fetch', event => {
  console.log('Fetch occurred for:', event.request.url);
});
