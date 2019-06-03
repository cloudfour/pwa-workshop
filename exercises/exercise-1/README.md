# Progressive Web App Workshop, Exercise 1

## Goals

1. Set up your Glitch development environment

1. Register a service worker

1. Create a basic service worker that has a `console.log` for each of the `install`, `activate` and `fetch` events.

## Instructions

### Set up your Glitch development environment

1. Create a new Glitch account or login: https://glitch.com

1. Create a copy of the `cloud-four-pwa-workshop` Glitch project to your own Glitch profile: 

    [![Remix on Glitch](https://cdn.glitch.com/2703baf2-b643-4da7-ab91-7ee2a2d00b5b%2Fremix-button.svg)](https://glitch.com/edit/#!/remix/cloud-four-pwa-workshop)

    You can also use the following link as an alternative: https://glitch.com/edit/#!/remix/cloud-four-pwa-workshop

1. Rename the project to personalize it, if you prefer

    ![glitch-01-rename-project](https://user-images.githubusercontent.com/459757/58775958-10c0fc80-857d-11e9-84fd-868d6fbcce4f.gif)

1. Launch your new project, it's now live!

    ![glitch-01-launch-app](https://user-images.githubusercontent.com/459757/58777494-6698a300-8583-11e9-9ce7-7fd2b4de5b06.gif)


### Register a service worker

1. Open the `scripts/register-service-worker.js` JavaScript file

2. Register the `/service-worker.js` JavaScript file as a service worker:

    ```js
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
      });
    } else {
      // Service workers are not supported by the browser
      console.error('This browser does not support service workers. :(');
    }
    ```

    - https://developers.google.com/web/fundamentals/primers/service-workers/#register_a_service_worker

### Create a basic service worker

1. Open the `/service-worker.js` JavaScript file

2. Add `install`, `activate` and `fetch` event listeners

    - See [`exercises/exercise-1/service-worker.exercise-1.js`](/exercises/exercise-1/service-worker.exercise-1.js) for the completed JavaScript code

## Resources

- https://developers.google.com/web/fundamentals/primers/service-workers/
- https://glitch.com/about/features/
