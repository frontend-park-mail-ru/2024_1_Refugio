const CACHE_NAME = 'cache-mailhub'

/**
 * Статика в кэш
 */
self.addEventListener('install', (e) => {
    e.waitUntil(() => {
        caches.open(CACHE_NAME)
            .then((cache) => {
                return cache.addAll(["./index.html"]);
            })
    })
});

self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(keys.map((key) => {
                if (key !== CacheKey) {
                    return caches.delete(key);
                }
            }))
        })
    )
})

/**
 * Обработка fetch запросов
 */
self.addEventListener('fetch', (e) => {
    e.respondWith(
        new Promise((resolve, reject) => {
            fetch(e.request)
                .then((res) => {
                    const resForCache = res.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(e.request, resForCache)
                    })
                    resolve(res);
                },
                (error) => {
                    if (navigator.onLine) {
                        reject(error);
                    } else {
                        reject(new Error("User is offline"))
                    }
                })
                .catch()
        })
            .catch(() => caches.open(CACHE_NAME)
                .then((cache) => cache.match(e.request)
                    .then((result) => result)))
    )
})