self.addEventListener('install', (event) => {
    event.waitUntil((async () => {
        const cache = await caches.open('offline');
        await cache.add(new Request('offline', {cache: 'reload'}));//url
    })());
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil((async () => {
        if ('navigationPreload' in self.registration) {
            await self.registration.navigationPreload.enable();
        }
    })());
    self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    if (event.request.mode === 'navigate') {
        event.respondWith((async () => {
            try {
                const preloadResponse = await event.preloadResponse;
                if (preloadResponse) {
                    return preloadResponse;
                }
                const networkResponse = await fetch(event.request);
                return networkResponse;
            } catch (error) {
                const cache = await caches.open('offline');
                const cachedResponse = await cache.match('offline');//url
                return cachedResponse;
            }
        })());
    }
});