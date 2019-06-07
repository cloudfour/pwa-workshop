/**
 * A UI state manager for Push Notifiation UX
 * 
 * We've created an IIFE to not pollute the global namespace
 * @see https://developer.mozilla.org/en-US/docs/Glossary/IIFE
 * 
 * Push Notifications code from "Adding Push Notifications to a Web App"
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
   * backend server. For workshop purposes, we will log the subscription.
   * @param {Object} obj A data object
   * @param {Object} obj.subscription The Push subscription object
   */
  const updateSubscriptionOnServer = ({ subscription }) => {
    console.log('Push: Subscription:', subscription);
  }

  /**
   * Updates the UI state for the "Push" button
   */
  const updateUI = () => {
    const buttonStateText = isSubscribed ? 'Disable' : 'Enable'
    pushBtn.textContent = `${buttonStateText} Push Messaging`;
    pushBtn.disabled = false;
  };

  /**
   * Handles subscribing to Push Notifications
   */
  const subscribeUser = () => {
    const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);

    swRegistration.pushManager.subscribe({
      userVisibleOnly: true,
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

  const onPushBtnClick = () => {
    pushBtn.disabled = true;
    if (isSubscribed) {
      // TODO: Unsubscribe
    } else {
      subscribeUser();
    }
  };

  const initUI = () => {
    // No need to run the code if the button isn't found
    if (!pushBtn) {
      return;
    }

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

    pushBtn.addEventListener('click', onPushBtnClick)
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
