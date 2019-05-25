/**
 * Register the service worker
 */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        // Service worker registration was successful! :)
        console.log('Service worker is registered to the following scope:', registration.scope);
      })
      .catch(error => {
        // Service worker registratio failed. :(
        console.error('Service worker registration failed:', error);
      });
  });
} else {
  // Service workers are not supported by the browser
  console.error('This browser does not support service workers. :(');
}
