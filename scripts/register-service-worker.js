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

/**
 * Install PWA/Add to Home Screen mini-app
 *
 * Handles "Install" UI logic and updates for the PWA, groups the code
 * together that is needed to handle "Add to Home Screen"/"Install" logic.
 *
 * We created an IIFE to not pollute the global namespace
 * @see https://developer.mozilla.org/en-US/docs/Glossary/IIFE
 */
const installAppUIManager = (() => {
  // Keeps track of the install prompt event
  let installPromptEvent = null;
  // Keep track if the app is installed
  let isAppInstalled = false;
  // The "Install" button in the UI
  let installBtn = document.querySelector('.js-install-button');

  /**
   * Updates the UI for "Install" button
   */
  const updateUI = () => {
    // Update the state of the "Install" UI button depending on
    // the state of the `isAppInstalled` value
    installBtn.classList.toggle('u-hidden', isAppInstalled);
    installBtn.disabled = isAppInstalled;
  };

  /**
   * The "Install" button click handler function
   */
  const onInstallBtnClick = () => {
    // Return if the install prompt event doesn't exist
    if (!installPromptEvent) {
      return;
    }

    // Disable the button when prompting the "install" dialog
    installBtn.disabled = true;

    // Show the "install" dialog
    installPromptEvent.prompt();

    // Wait for the user to respond to the prompt
    installPromptEvent.userChoice.then(choice => {
      if (choice.outcome === 'accepted') {
        console.log('User accepted the "install" prompt');
        isAppInstalled = true;
      } else {
        console.log('User dismissed the "install" prompt');
        isAppInstalled = false;
      }

      // Update the UI now that the user made a choice
      updateUI();

      // Clear the saved prompt since it can't be used again
      installPromptEvent = null;
    });
  };

  /**
   * Initialization of the "install" button UI
   */
  const initUI = () => {
    // No need to run the code if the button isn't found
    if (!installBtn) {
      return;
    }

    // Will handle showing/hiding the "install" button as needed
    updateUI();

    // Set up the installBtn click handler
    installBtn.addEventListener('click', onInstallBtnClick);
  };

  /**
   * Initializes our "Add to Home Screen" code
   *
   * @param {Object} obj An initialization data object
   * @param {BeforeInstallPromptEvent} obj.beforeinstallpromptEvent The BeforeInstallPromptEvent
   */
  const init = ({ beforeinstallpromptEvent  }) => {
    // Store the install prompt event to use it later
    installPromptEvent = beforeinstallpromptEvent;
    // Initialize the "Install" UI
    initUI();
  };

  // Provide a public API for our "Add to Home Screen" mini-app
  return {
    init
  };
})();

/**
 * Add a listener for the `BeforeInstallPromptEvent` to handle it
 */
window.addEventListener('beforeinstallprompt', beforeinstallpromptEvent => {
  console.groupEnd(); // Don't get grouped into any log group.
  console.log('The `beforeinstallprompt` event fired!');

  // Prevent Chrome <= 67 from automatically showing the prompt
  beforeinstallpromptEvent.preventDefault();

  // Initialize the "Add to Home Screen" UI management mini-app
  installAppUIManager.init({
    beforeinstallpromptEvent
  });
});
