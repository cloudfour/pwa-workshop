# Progressive Web App Workshop, Exercise 1

## What you'll learn

- How to set up your local development environment

- How to register a service worker

- How to create a basic service worker that has a `console.log` for each of the `install`, `activate` and `fetch` events.

## What you'll need

- Google Chrome browser

## Instructions

### Set up local web server

@TODO Write install steps for **Web Server for Chrome**

As an alternative, you can set up the project using Glitch, see: [`exercises/1/set-up-glitch.md`](/exercises/1/set-up-glitch.md)


### Register a service worker

1. Open the `scripts/register-service-worker.js` JavaScript file

2. Register the service worker

    - See [`exercises/1/register-service-worker.1.js`](register-service-worker.1.js) for the completed JavaScript code

    Learn more:

    - https://developers.google.com/web/fundamentals/primers/service-workers/#register_a_service_worker

### Create a basic service worker

1. Open the `/service-worker.js` JavaScript file

2. Add `install`, `activate` and `fetch` event listeners

    - See [`exercises/1/service-worker.1.js`](service-worker.1.js) for the completed JavaScript code

## Resources

- https://developers.google.com/web/fundamentals/primers/service-workers/
- https://glitch.com/about/features/