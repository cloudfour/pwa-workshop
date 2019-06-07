/**
 * ------------------------
 * Configuration constants
 * ------------------------
 */

/**
 * The name of the cache to store assets
 */
const VERSION = '1';
const PWA_WORKSHOP_PREFIX = 'pwa-workshop-v';
const PWA_WORKSHOP_CACHE = `${PWA_WORKSHOP_PREFIX}${VERSION}`;

/**
 * Regular expression to help detect images
 */
const IMAGE_REGEX = /\.(?:png|gif|jpg|jpeg|svg|webp)$/;

/**
 * The maximum amount of cached responses to store
 */
const MAX_CACHED_ITEMS = 30;

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
    '/scripts/main.js',
    '/offline.html',
    '/images/fallback.svg'
  ],
  NICE_TO_HAVE: [
    '/images/portland.svg',
    '/images/sky-friendly-robot.svg'
  ]
};

/**
 * ------------------
 * Utility functions
 * ------------------
 */

/**
 * Helper to know if the request is an image request
 * @param {Object} request The event request object
 * @returns {boolean} Is the request an image request?
 */
const isImageRequest = request => IMAGE_REGEX.test(request.url);

/**
 * Helper to check if a pathname is found in the "must have" precache list
 * @param {string} pathname An asset pathname (e.g. `/images/foo.png`)
 * @returns {boolean}
 */
const isMustHaveAsset = pathname => PRECACHE_ASSETS.MUST_HAVE.includes(pathname);

/**
 * Helper function to trim the cache
 * 
 * The trim logic is restricted by the following rules:
 * - the cached `Request` must be for an image
 * - the cached `Request` must not be listed in the 
 *   `PRECACHE_ASSETS.MUST_HAVE` list
 * - the `MAX_CACHED_ITEMS` constant sets the maximum amount 
 *   of cached `Request` objects to store
 * - least recently cached `Request` objects are deleted first,
 *   this is the default order when calling `cache.keys()`
 */
const trimCache = async () => {
  console.group('Service Worker trimming caches');
  const cache = await caches.open(PWA_WORKSHOP_CACHE);
  // Get all cached Requests
  const cachedRequests = await cache.keys();
  // Store the cached requests that should be deleted
  const cachedRequestsToDelete = cachedRequests
    // First filter out cached responses that should not be deleted
    .filter(cachedRequest => 
      // Don't delete "must have" assets from the precache list
      !isMustHaveAsset(new URL(cachedRequest.url).pathname)
      // Only delete images
      && isImageRequest(cachedRequest)
    )
    // Then enforce the `MAX_CACHED_ITEMS` limit on the 
    // cached responses array returned from the first filter
    .filter((cachedRequest, index, filteredCachedRequests) => 
      index < filteredCachedRequests.length - MAX_CACHED_ITEMS
    );
  // We await an array of `cache.delete()` promises until they are all resolved
  await Promise.all(
    cachedRequestsToDelete.map(cachedRequest => {
      console.log('Deleting:', cachedRequest.url);
      return cache.delete(cachedRequest);
    })
  );
  if (!cachedRequestsToDelete.length) {
    console.log('No caches were trimmed');
  }
  console.groupEnd();
}

/**
 * ---------------------------
 * Caching strategy functions
 * ---------------------------
 */

/**
 * "Cache First" caching strategy
 * 
 * 1. Fetch from the cache
 *    - Return cached response if found
 * 2. Fallback to fetch from the network
 *    - Store a copy of the network response in the cache
 *    - Return network response
 * 
 * @see https://jakearchibald.com/2014/offline-cookbook/#on-network-response
 * @param {FetchEvent} fetchEvent A fetch event object
 * @returns {Promise} Resolves to a fetch Response object
 */
const cacheFirst = async fetchEvent => {
  const request = fetchEvent.request;
  // Open our cache and look for a cached response
  const cache = await caches.open(PWA_WORKSHOP_CACHE);
  const cachedResponse = await cache.match(request);
  if (cachedResponse) {
    console.log(`Fetch from cache: ${request.url}`);
    return cachedResponse;
  }
  // Otherwise, fetch from the network and store a copy in cache
  const networkResponse = await fetch(request);
  fetchEvent.waitUntil(
    cache.put(request, networkResponse.clone())
  );
  // Finally return the network response
  console.log(`Fetch from network: ${request.url}`);
  return networkResponse;
};

/**
 * "Cache, falling back to network" caching strategy
 * 
 * 1. Fetch from the cache
 *    - Return cached response if found
 * 2. Fallback to fetch from the network
 *    - Return network response
 * 
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

/**
 * ------------------------------------------
 * Service worker event listeners & handlers
 * ------------------------------------------
 */

/**
 * Listen for the `message` event
 *
 * The Document and service worker can communicate with
 * each other through the `postMessage()` API
 */
self.addEventListener('message', messageEvent => {
  // Check the received `action` value from the Document
  if (messageEvent.data.action === 'trimCache') {
    trimCache();
  }
});

/**
 * Listen for the `install` event
 * 
 * The `install` event is an ideal time to cache 
 * CSS, JS, image and font static assets.
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
 * Listen for the `activate` event
 */
self.addEventListener('activate', activateEvent => {
  console.group('Service Worker `activate` Event');
  activateEvent.waitUntil(async function() {
    // Get the names of all the existing caches
    const cacheNames = await caches.keys();
    // Each cache `delete()` will return a promise, 
    // so we need to await them all using `Promise.all`
    await Promise.all(
      cacheNames
        // Filter for the caches we want to delete
        .filter(cacheName => cacheName.startsWith(PWA_WORKSHOP_PREFIX)
          && cacheName !== PWA_WORKSHOP_CACHE)
        // Then delete them
        .map(cacheName => {
          console.log(`Deleting cache "${cacheName}"`);
          return caches.delete(cacheName);
        })
    );
    console.groupEnd();
  }());
});

/**
 * Listen for the `fetch` event
 * 
 * @see https://medium.com/dev-channel/service-worker-caching-strategies-based-on-request-types-57411dd7652c
 * @see https://jakearchibald.com/2014/offline-cookbook/#putting-it-together
 */
self.addEventListener('fetch', fetchEvent => {
  const destination = fetchEvent.request.destination;
  const requestURL = new URL(fetchEvent.request.url);
  // Special handling for same-origin URLs only
  if (requestURL.origin === location.origin) {
    switch (destination) {
      case 'document': {
        fetchEvent.respondWith(
          cacheFirst(fetchEvent)
            .catch(error => caches.match('/offline.html'))
        )
        return;
      }
      case 'image': {
        fetchEvent.respondWith(
          cacheFirst(fetchEvent)
            .catch(error => caches.match('/images/fallback.svg'))
        );
        return;
      }
      case 'style':
      case 'script': {
        fetchEvent.respondWith(
          cacheFirst(fetchEvent)
        )
        return;
      }
      // If an `XMLHttpRequest` or `fetch()` from the document, the
      // `Request.destination` is an empty string, use default strategy
      default: {
        fetchEvent.respondWith(
          cacheFallingBackToNetwork(fetchEvent)
        );
        return;
      }
    }
  }
  // A good overall default
  fetchEvent.respondWith(
    cacheFallingBackToNetwork(fetchEvent)
  );
});

self.addEventListener('push', pushEvent => {
  console.log('[Service Worker] Push Received:', pushEvent.data.text());

  const title = 'PWA Workshop';
  const options = {
    body: pushEvent.data.text(),
    icon: 'images/icon.png',// todo: use a real image
    badge: 'images/badge.png',// todo: use real image
    data: {
      // We can send data along if we want to
      openURL: 'https://cloudfour.com'
    }
  };

  pushEvent.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', notificationclickEvent => {
  console.log('[Service Worker] Notification click Received.');

  notificationclickEvent.notification.close();

  notificationclickEvent.waitUntil(
    clients.openWindow(
      // We can access any data passed via a notification
      notificationclickEvent.notification.data.openURL
    )
  );
});
