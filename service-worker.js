/**
 * If you need to force pages to create a fresh cache, increment 
 * the `CACHE_VERSION` number. Doing so will kick of the service
 * worker update flow allowing old cache(s) to be deleted during the
 * `activate` event handler.
 */
const CACHE_VERSION = 1;
const CACHE_NAME = `my-site-cache-v${CACHE_VERSION}`;

const MUST_HAVE_URLS = [
  '/',
  '/css/styles.css',
  '/js/register-service-worker.js',
  'images/sky-friendly-robot.svg'
];
const NICE_TO_HAVE_URLS = [
  'images/portland.svg'
];

/**
 * Ideal time to cache CSS, JS, images, fonts static assets
 */
self.addEventListener('install', event => {
  console.log('Installing');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        /**
         * If these assets fail to cache, it's okay
         */
        cache.addAll(NICE_TO_HAVE_URLS);
        /**
         * These assets are required 
         */
        return cache.addAll(MUST_HAVE_URLS);
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
