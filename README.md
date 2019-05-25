# Progressive Web App Workshop

The starter files for the Progressive Web App workshop presented by Cloud Four.

@todo: Explain this...

Add an asset to a new cache via DevTools:
```js
(async function() {
  const cache = await caches.open('my-cache');
  await cache.addAll(['/images/portland.svg']);
}())
.then(() => console.log('Success!'))
.catch(() => console.log('Sorry, it failed.'));
```
