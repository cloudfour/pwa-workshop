/**
 * Register the service worker
 */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        // Service worker registration was successful! :)
        console.log('Service worker registered to scope:', registration.scope);
        // Only initialize the pushUIStateManager app code if Push is supported
        if ('PushManager' in window) {
          console.log('Push is supported in this browser!');
          // Pass the service worker registration to the pushUIStateManager app
          pushUIStateManager.init({
            registration
          });
        }
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
 * ----------------
 * Event listeners
 * ----------------
 */

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

/**
 * -------------------------
 * UI State Manager Helpers
 * -------------------------
 */

/**
 * Install PWA Workshop App/Add to Home Screen UI manager
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
  const installBtn = document.querySelector('.js-install-button');

  /**
   * Updates the UI for "Install" button
   * 
   * Updates the state of the "Install" UI button depending 
   * on the state of the `isAppInstalled` value
   */
  const updateUI = () => {
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
 * A UI state manager for Push Notifiation UX
 * 
 * We've created an IIFE to not pollute the global namespace
 * @see https://developer.mozilla.org/en-US/docs/Glossary/IIFE
 * 
 * Some of this code borrowed from "Adding Push Notifications to a Web App"
 * @see https://developers.google.com/web/fundamentals/codelabs/push-notifications
 */
const pushUIStateManager = (() => {
  /**
   * This key is generated
   * @see https://developers.google.com/web/fundamentals/codelabs/push-notifications/#get_application_server_keys
   */
  const applicationServerPublicKey = 'BEfHt11szUkhzi0xr55nMilJ74vE66d7GWdYPmMfp2OHNNrgi0kSapF3dNvm7MoqucJtP5aW5n4FtJ0GK3qikJY';

  // Will keep track of the service worker registration
  let swRegistration = null;
  // Will keep track of whether or not a user has subscribed to notifications
  let isSubscribed = false;
  // The UI "Push" button
  const pushBtn = document.querySelector('.js-push-button');

  /**
   * Helper function to convert a base64 string to a Uint8Array
   * 
   * Borrowed from Google Wep Push Code Lab
   * @see https://github.com/GoogleChromeLabs/web-push-codelab/blob/25cf164ec0908538eece8dc07c98831ba098f8ca/app/scripts/main.js#L31-L44
   * 
   * @param {string} base64String A base64 encoded string
   * @returns {Uint8Array} 
   */
  const urlB64ToUint8Array = base64String => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };

  /**
   * In a production application, we'd pass along the subscription to the
   * backend server. For our workshop purposes, we will log the subscription.
   * 
   * @see https://developers.google.com/web/fundamentals/push-notifications/subscribing-a-user#send_a_subscription_to_your_server
   * 
   * @param {Object} obj A data object
   * @param {Object} obj.subscription The Push subscription object
   */
  const updateSubscriptionOnServer = ({ subscription }) => {
    if (subscription) {
      // Backend server would store subscription for future use
      console.log('Push: Server store new subscription:', subscription);
    } else {
      // Backend would delete subscription from database
      console.log('Push: Server delete subscription');
    }
  }

  /**
   * Updates the UI state for the "Push" button
   */
  const updateUI = () => {
    // Let's allow the button to be visible now
    if (pushBtn.classList.contains('u-hidden')) {
      pushBtn.classList.remove('u-hidden');
    }

    // Handle when notification persmission is denied
    if (Notification.permission === 'denied') {
      pushBtn.textContent = 'Push Messaging Blocked';
      pushBtn.disabled = true;
      updateSubscriptionOnServer({
        subscription: null
      });
      return;
    }

    // Keep the button state text up to date depending on the `isSubscribed` value
    const buttonStateText = isSubscribed ? 'Disable' : 'Enable'
    pushBtn.textContent = `${buttonStateText} Push Messaging`;
    pushBtn.disabled = false;
  };

  /**
   * Handles usubscribing to Push notifications
   */
  const unsubscribeUser = () => {
    swRegistration.pushManager.getSubscription()
      .then(subscription => {
        if (subscription) {
          return subscription.unsubscribe();
        }
      })
      .catch(error => {
        console.log('Error unsubscribing:', error);
      })
      .then(() => {
        // For a real app, we'd want the server to remove the subscription from its database
        updateSubscriptionOnServer({
          subscription: null
        });

        console.log('Push: User is unsubscribed');
        isSubscribed = false;

        updateUI();
      });
  };

  /**
   * Handles subscribing to Push Notifications
   */
  const subscribeUser = () => {
    const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);

    swRegistration.pushManager.subscribe({
      // @see: https://developers.google.com/web/fundamentals/push-notifications/subscribing-a-user#uservisibleonly_options
      userVisibleOnly: true,
      // @see https://developers.google.com/web/fundamentals/push-notifications/subscribing-a-user#applicationserverkey_option
      applicationServerKey
    })
      .then(subscription => {
        console.log('Push: User is subscribed!!!');

        // In a production app, send the subscription to your backend server
        updateSubscriptionOnServer({
          subscription
        });

        isSubscribed = true;

        updateUI();
      })
      .catch(error => {
        console.log('Push: Failed to subscribe the user:', error);
        updateUI();
      });
  };

  /**
   * The "Push" button click handler
   * 
   * Subscribes or unsubscribed from Push notifications
   */
  const onPushBtnClick = () => {
    pushBtn.disabled = true;
    if (isSubscribed) {
      unsubscribeUser();
    } else {
      subscribeUser();
    }
  };

  /**
   * Initialize the Push UI
   */
  const initUI = () => {
    // No need to run the code if the button isn't found
    if (!pushBtn) {
      return;
    }

    // Check on initialization if there is already a subscription
    swRegistration.pushManager.getSubscription()
      .then(subscription => {
        // Store whether or not a user is subscribed
        isSubscribed = !(subscription === null);

        if (isSubscribed) {
          console.log('Push: Subscribed');
        } else {
          console.log('Push: NOT subscribed');
        }

        updateUI();
      });

    pushBtn.addEventListener('click', onPushBtnClick);
  };

  /**
   * Initializes our Push UI app code
   * @param {Object} obj Initialization object
   * @param {Object} obj.registration A service worker registration object
   */
  function init({ registration }) {
    // Store the service worker registration
    swRegistration = registration;

    initUI();
  }

  return {
    init
  }
})();
