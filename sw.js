const CACHE_NAME = 'watermelon-final';

// 只缓存最核心的框架，确保 App 能秒开
const ESSENTIALS = [
  './',
  './index.html',
  './manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // 这里的关键是：就算音效没下完，也不准卡住 App 启动
      return cache.addAll(ESSENTIALS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

// 动态缓存策略：玩的时候才偷偷存，不影响开机速度
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;

      return fetch(event.request).then((response) => {
        // 只有当网络请求成功时，才把音效存入本地
        if (response && response.status === 200 && event.request.url.includes('/assets/')) {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return response;
      });
    })
  );
});
