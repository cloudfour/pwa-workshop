const SW_PREFIX = 'SW::';

self.addEventListener('install', event => {
  console.log(`${SW_PREFIX}Installing`);
});

self.addEventListener('activate', event => {
  console.log(`${SW_PREFIX}Activated`);
});

self.addEventListener('fetch', event => {
  console.log(`${SW_PREFIX}Fetch occurred`);
});
