/* eslint-disable no-restricted-globals */

// set the debug state
const DEBUG = true;

const cacheVersion = 1;

const currentCache = {
  offline: `offline-${cacheVersion}`,
};

const offlinePage = '/offline.html';
// const offlinePage = 'offline.hbs';

// const cacheAssets = [
//   '/pages/offline.js',
// ];

/**
 * When Service Worker is installed
 */
self.addEventListener('install', (e) => {
  if (DEBUG) console.log('[Serviceworker] installed.');
  e.waitUntil(
    caches.open(currentCache.offline)
      .then((cache) => {
        console.log('[Serviceworker] caching files.');
        // console.log(global.serviceWorkerOption);
        // console.log(cache.);
        cache.add(offlinePage);
      })
      .then(() => {
        self.skipWaiting();
      }),
  );
});

/**
 * When Service Worker is active
 * After the install event
 */
self.addEventListener('activate', () => {
  if (DEBUG) console.log('[Serviceworker] active.');
});

/**
 * When the Fetch event is triggered
 */
self.addEventListener('fetch', (e) => {
  // if (DEBUG) console.log('[ServiceWorker] Fetching', e.request.url);
  // if (DEBUG) console.log(caches.keys());
  e.respondWith(
    fetch(e.request)
      .catch(() => {
        console.log('no connection');
        // console.log(global.root);
        caches.has(currentCache.offline).then((bool) => {
          console.log('has offline');
          console.log(bool);
        });
        return caches.open(currentCache.offline)
        // @TODO: ERROR!
          .then((cache) => cache.match(offlinePage));
        // cache.match(offlinePage);
      }),
  );
});
