const CACHE='kokmatch-v18';
const ASSETS=['/','/index.html','/manifest.webmanifest','/drag-compose-v18.js','/drag-compose-v17.js?v=18'];
const APP_SCRIPT='<script src="/drag-compose-v18.js?v=18"></script>';
async function injectLatest(r){
  if(!r)return r;
  const html=await r.text();
  const body=html.includes('drag-compose-v18.js')?html:html.replace('</body>',APP_SCRIPT+'</body>');
  const headers=new Headers(r.headers);
  headers.set('content-type','text/html; charset=utf-8');
  headers.set('cache-control','no-store');
  return new Response(body,{status:r.status,statusText:r.statusText,headers});
}
self.addEventListener('install',e=>{
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));
});
self.addEventListener('activate',e=>{
  e.waitUntil((async()=>{
    const keys=await caches.keys();
    await Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)));
    await self.clients.claim();
    const clients=await self.clients.matchAll({type:'window',includeUncontrolled:true});
    for(const client of clients){
      try{await client.navigate(client.url)}catch{}
    }
  })());
});
self.addEventListener('message',e=>{if(e.data==='SKIP_WAITING')self.skipWaiting()});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  if(e.request.mode==='navigate'){
    e.respondWith(fetch(e.request,{cache:'no-store'}).then(async r=>{
      const clone=r.clone();
      caches.open(CACHE).then(c=>c.put('/index.html',clone));
      return injectLatest(r);
    }).catch(async()=>injectLatest(await caches.match('/index.html'))));
    return;
  }
  e.respondWith(fetch(e.request,{cache:'no-store'}).then(r=>{
    const clone=r.clone();
    caches.open(CACHE).then(c=>c.put(e.request,clone));
    return r;
  }).catch(()=>caches.match(e.request)));
});
