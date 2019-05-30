/**
 * Listen for the `install` event
 */
self.addEventListener('install', installEvent => {
  console.log('Installed');
});

/**
 * Listen for the `activate` event
 */
self.addEventListener('activate', activateEvent => {
  console.log('Activated');
});

/**
 * Listen for the `fetch` event
 */
self.addEventListener('fetch', fetchEvent => {
  const request = fetchEvent.request;
  console.log('Fetching:', request);

  fetchEvent.respondWith(async function() {
    try {
      const response = await fetch(request);
      return response;
    } catch (error) {
      console.log('Error!!!', error);
      return new Response('Something went wrong! :(');
    }
  }());
});
