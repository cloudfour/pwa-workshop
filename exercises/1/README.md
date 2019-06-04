# Progressive Web App Workshop, Exercise 1

## What you'll learn

- [How to set up your local web server](#set-up-your-local-web-server)

- [How to register a service worker](#register-a-service-worker)

- [How to create a basic service worker that has a `console.log` for each of the `install`, `activate` and `fetch` events](#create-a-basic-service-worker)

## What you'll need

- Google Chrome browser: https://www.google.com/chrome/

## Set up your local web server

### Web Server for Chrome (preferred option)

1. Download the source code
    
    - ZIP: https://github.com/cloudfour/pwa-workshop/archive/master.zip

    OR

    - Fork the repository: https://github.com/cloudfour/pwa-workshop

1. Install [**Web Server for Chrome**](https://chrome.google.com/webstore/detail/web-server-for-chrome/ofhbbkphhbklhfoeikjpcbhemlocgigb)

1. In your Chrome browser, type the following as the URL to open the Chrome apps view: 

    ```
    chrome://apps
    ```

1. Launch the **Web Server** app

    <img width="183" alt="Web Server for Chrome icon" src="https://user-images.githubusercontent.com/459757/58833026-09ddcc80-8605-11e9-8b8e-e36d7babd1b9.png">


1. Configure your local web server

    - click **Choose Folder** and select the `/pwa-workshop-starter-kit` directory

    <img width="629" alt="Screen Shot 2019-06-03 at 1 42 50 PM" src="https://user-images.githubusercontent.com/459757/58833301-91c3d680-8605-11e9-819d-b82be400d775.png">

    - the workshop site will be accessible at the URL in the **Web Server URL(s)** section

1. Make sure the **Automatically show index.html** option is selected

    <img width="527" alt="Screen Shot 2019-06-04 at 10 01 27 AM" src="https://user-images.githubusercontent.com/459757/58898628-d2782a00-86af-11e9-8f05-19195cf50e7b.png">

1. Then stop and restart the server using the **Web Server: STARTED** toggle

    <img width="527" alt="Screen Shot 2019-06-04 at 10 05 14 AM" src="https://user-images.githubusercontent.com/459757/58898870-65b15f80-86b0-11e9-8f94-1a0c468ab60b.png">
    <img width="527" alt="Screen Shot 2019-06-04 at 10 05 11 AM" src="https://user-images.githubusercontent.com/459757/58898869-65b15f80-86b0-11e9-924d-b4d8c89c5f42.png">

1. You can now visit your website by clicking the link under **Web Server URL(s)**

    <img width="527" alt="Screen Shot 2019-06-04 at 10 09 01 AM" src="https://user-images.githubusercontent.com/459757/58899063-dce6f380-86b0-11e9-9bdd-71d45309df86.png">
    <img width="880" alt="Screen Shot 2019-06-04 at 10 13 10 AM" src="https://user-images.githubusercontent.com/459757/58899279-61d20d00-86b1-11e9-8470-43fed46da356.png">



### Glitch (alternative option)

As an alternative, you can set up the project using Glitch, see: [`exercises/1/set-up-glitch.md`](/exercises/1/set-up-glitch.md)


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
