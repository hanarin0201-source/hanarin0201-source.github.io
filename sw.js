const CACHE='kokmatch-v40';
const ASSETS=['/manifest.webmanifest','/app-v35.css?v=35','/app-v35.js?v=35','/app-v36.css?v=36','/app-v36.js?v=36','/app-v37.css?v=37','/app-v37.js?v=37','/app-v38.js?v=38','/app-v39.css?v=39','/app-v39.js?v=39','/app-v40.js?v=40'];
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)))});
self.addEventListener('activate',e=>{e.waitUntil((async()=>{const keys=await caches.keys();await Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)));await self.clients.claim()})())});
self.addEventListener('fetch',e=>{
 if(e.request.method!=='GET')return;
 if(e.request.mode==='navigate'){
  e.respondWith(fetch(e.request,{cache:'no-store'}).catch(()=>caches.match('/launch/v40.html').then(r=>r||Response.error())));
  return;
 }
 e.respondWith(fetch(e.request,{cache:'no-store'}).then(r=>{const c=r.clone();caches.open(CACHE).then(x=>x.put(e.request,c));return r}).catch(()=>caches.match(e.request)));
});
