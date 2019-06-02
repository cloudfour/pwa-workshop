/**
 * Register the service worker
 */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        // Service worker registration was successful! :)
        console.log('Service worker registered to scope:', registration.scope);
      })
      .catch(error => {
        // Service worker registration failed. :(
        console.error('Service worker registration failed:', error);
      });
    
    // If the page has an active service worker, then send 
    // a message to trim the caches using the `postMessage()` API
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        'action': 'trimCache'
      });
    }
  });
} else {
  // Service workers are not supported by the browser
  console.error('This browser does not support service workers. :(');
}
