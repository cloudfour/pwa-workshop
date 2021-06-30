# Progressive Web App Workshop, Exercise 1

## What you'll learn

- [How to set up your local web server](#set-up-your-local-web-server)
- [How to register a service worker](#register-a-service-worker)
- [How to create a basic service worker that has a `console.log` for `fetch` events](#create-a-basic-service-worker)

## What you'll need

- Google Chrome browser: <https://www.google.com/chrome/>

## Set up your local web server

### Web Server for Chrome (preferred option)

Set up the project using **Web Server for Chrome**, see: [`exercises/1/set-up-web-server-for-chrome.md`](set-up-web-server-for-chrome.md)

### Glitch (alternative option)

As an alternative, you can set up the project using Glitch, see: [`exercises/1/set-up-glitch.md`](set-up-glitch.md)


## Register a service worker

1. Open the `scripts/register-service-worker.js` JavaScript file
1. Register the service worker
    - See [`exercises/1/register-service-worker.1.js`](register-service-worker.1.js) for the completed JavaScript code

Learn more:
- https://developers.google.com/web/fundamentals/primers/service-workers/#register_a_service_worker

## Create a basic service worker

1. Open the `/service-worker.js` JavaScript file
1. Add `install`, `activate` and `fetch` event listeners
    - See [`exercises/1/service-worker.1.js`](service-worker.1.js) for the completed JavaScript code

## Learning Resources

- https://developers.google.com/web/fundamentals/primers/service-workers/
