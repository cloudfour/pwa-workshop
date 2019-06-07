/**
 * A mini UI application to control Push Notifiation UX
 * 
 * I've created an IIFE to not pollute the global namespace
 * @see https://developer.mozilla.org/en-US/docs/Glossary/IIFE
 * 
 * Push Notifications code from "Adding Push Notifications to a Web App"
 * @see https://developers.google.com/web/fundamentals/codelabs/push-notifications/#register_a_service_worker
 */
const pushUIStateManager = (() => {
  const applicationServerPublicKey = 'BEfHt11szUkhzi0xr55nMilJ74vE66d7GWdYPmMfp2OHNNrgi0kSapF3dNvm7MoqucJtP5aW5n4FtJ0GK3qikJY';

  let swRegistration = true;
  let isSubscribed = false;
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

  const updateUI = () => {
    const buttonStateText = isSubscribed ? 'Disable' : 'Enable'

    pushBtn.
  };

  const initUI = () => {
    swRegistration.pushManager.getSubscription()
      .then(subscription => {
        // Store whether or not a user is subscribed
        isSubscribed = !(subscription === null);

        if (isSubscribed) {
          console.log('Subscribed');
        } else {
          console.log('NOT subscribed');
        }

        updateUI();

        // updateButton({
        //   isSubscribed: isSubscribed
        // });
      });
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

  function update() {
    console.log('registration', swRegistration);
    console.log('pushEnBtn', pushBtn);
    
  }
  
  return {
    init,
    update
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

const askForNotficationsPermission = async () => {
  const permission = await Notification.requestPermission();
  console.log('Persmission:::', permission);
  if (permission === 'granted') {
    isSubscribed = true;
    updateButton({
      isSubscribed: true
    });
  }
};

// const initializeUI = () => {
//   pushButton.addEventListener('click', () => {
//     pushButton.disabled = true;
//     // askForNotficationsPermission();
//     if (isSubscribed) {
//       // TODO: Unsubscribe user
//     } else {
//       // subscribeUser();
//     }
//   });

//   swRegistration.pushManager.getSubscription()
//     .then(subscription => {
//       const isSubscribed = !(subscription === null);

//       if (isSubscribed) {
//         console.log('Subscribed');
//       } else {
//         console.log('NOT subscribed');
//       }

//       updateButton({
//         isSubscribed: isSubscribed
//       });
//     });
// }

const updateButton = ({ isSubscribed }) => {
  if (isSubscribed) {
    pushButton.textContent = 'Disable Push Messaging';
  } else {
    pushButton.textContent = 'Enable Push Messaging';
  }

  pushButton.disabled = false;
}

// const subscribeUser = () => {
//   const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
//   swRegistration.pushManager.subscribe({
//     userVisibleOnly: true, // Chrome requires this
//     applicationServerKey: applicationServerKey
//   })
//     .then(subscription => {
//       console.log('User is subscribed!!!');
      
//       // In a real app, you'd send then to your backend server
//       updateSubscriptionOnServer(subscription);

//       isSubscribed = true;

//       updateButton();
//     })
//     .catch(error => {
//       console.log('Failed to subscribe the user:', error);
//       updateButton();
//     });
// }

// const updateSubscriptionOnServer = subscription => {
//   // TODO: Send subscription to application server

//   // const subscriptionJson = document.querySelector('.js-subscription-json');
//   // const subscriptionDetails =
//   //   document.querySelector('.js-subscription-details');

//   if (subscription) {
//     console.log(subscription);
    
//     // subscriptionJson.textContent = JSON.stringify(subscription);
//     // subscriptionDetails.classList.remove('is-invisible');
//   } else {
//     // subscriptionDetails.classList.add('is-invisible');
//   }
// }
