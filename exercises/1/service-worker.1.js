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
  console.log('Fetch');
});
