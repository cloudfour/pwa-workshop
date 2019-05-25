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
const STATIC_ASSETS_CACHE_NAME = `pwa-workshop-static-assets-v${GLOBAL_VERSION + 0}`;
const RUNTIME_CACHE_NAME = `pwa-workshop-runtime-v${GLOBAL_VERSION + 0}`;

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
 * Ideal time to cache CSS, JS, images, fonts static assets
 */
self.addEventListener('install', event => {
  console.log('Installing...');
  event.waitUntil(
    caches.open(STATIC_ASSETS_CACHE_NAME)
      .then(cache => {
        /**
         * If these assets fail to cache, it's okay
         */
        cache.addAll(NICE_TO_HAVE_STATIC_ASSETS);
        /**
         * These assets are required 
         */
        return cache.addAll(MUST_HAVE_STATIC_ASSETS);
      })
      .catch(error => {
        console.log('Install failed:', error);
      })
  );
});

self.addEventListener('activate', event => {
  console.log('Activated');
});

self.addEventListener('fetch', event => {
  console.log('Fetch occurred for:', event.request.url);
});
