self.addEventListener('install',e=>{self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil((async()=>{try{const keys=await caches.keys();await Promise.all(keys.map(k=>caches.delete(k)))}catch{}try{await self.registration.unregister()}catch{}await self.clients.claim()})())});
/* v1.8: no fetch handler. Browser always uses the network. */
