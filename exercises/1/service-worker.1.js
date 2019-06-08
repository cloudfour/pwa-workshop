/**
 * Listen for the `fetch` event
 */
self.addEventListener('fetch', fetchEvent => {
  console.log('Fetch occured for:', fetchEvent.request.url);
});
