/* ============================================================
   幽灵歌单 — Service Worker
   构建产物文件名带 hash，无法静态列出预缓存清单，因此采用
   运行时缓存：首次访问在线时把页面与资源写入缓存，之后离线可用。
   - 页面导航：网络优先，失败回退缓存里的 index.html
   - 其余同源 GET：缓存优先 + 后台更新
   发版需更新资源时递增 CACHE_VERSION。
   ============================================================ */

const CACHE_VERSION = 'v3.0.0';
const CACHE_NAME = `ghost-songlist-${CACHE_VERSION}`;
const CORE_ASSETS = ['./', './index.html', './manifest.webmanifest', './favicon.jpg'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(CORE_ASSETS))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key.startsWith('ghost-songlist-') && key !== CACHE_NAME)
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;

  // 只接管同源 GET；跨域（平台 favicon 等）交给浏览器
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) {
    return;
  }

  // 页面导航：网络优先，离线时回退到缓存的入口页
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put('./index.html', clone));
          return response;
        })
        .catch(() =>
          caches.match('./index.html').then((cached) => cached || caches.match('./')),
        ),
    );
    return;
  }

  // 静态资源：缓存优先 + 后台静默更新
  event.respondWith(
    caches.match(request).then((cached) => {
      const networkFetch = fetch(request)
        .then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(() => cached);
      return cached || networkFetch;
    }),
  );
});
