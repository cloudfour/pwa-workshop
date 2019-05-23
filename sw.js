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
  '/styles/main.css',
  '/script/main.js'
];
const NICE_TO_HAVE_URLS = [
  'icon.svg'
];


self.addEventListener('install', event => {
  console.log('Installing');
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache', cache.toString());
        // Nice to have
        cache.addAll(NICE_TO_HAVE_URLS);
        // Must have
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
  // Test, what happens if I edit files from Glitch?
  // Now, can I push back to Glitch???
  console.log('Fetch occurred');
});
