const CACHE_NAME = 'watermelon-v3';

// 初始安装时强制缓存核心文件
const PRE_CACHE = [
  './index.html',
  './manifest.json',
  './assets/bgm.mp3'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRE_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

// 核心逻辑：动态缓存音效文件
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;

      return fetch(event.request).then((response) => {
        // 如果是 assets 里的音效文件，边听边存
        if (event.request.url.includes('/assets/')) {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, response.clone());
            return response;
          });
        }
        return response;
      });
    })
  );
});
