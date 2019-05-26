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

## Caching Strategies

Cache Only and Network Only aren't typical use cases. Cache First covers both.

- [Cache Only](https://jakearchibald.com/2014/offline-cookbook/#cache-only)
- [Network Only](https://jakearchibald.com/2014/offline-cookbook/#network-only)
- [Cache First (Cache Falling Back to Network)](https://jakearchibald.com/2014/offline-cookbook/#cache-falling-back-to-network)
- [Network First (Network Falling Back to Cache)](https://jakearchibald.com/2014/offline-cookbook/#network-falling-back-to-cache)
- [Stale-While-Revalidate](https://developers.google.com/web/fundamentals/instant-and-offline/offline-cookbook/#stale-while-revalidate)
