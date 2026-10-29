const CACHE='bunny-pocket-shell-v2-exact';
const FILES=['./','./index.html','./style.css','./app.js','./core.js','./manifest.webmanifest','./icons/bunny.svg','./icons/apple-touch-icon.png','./icons/icon-192.png','./icons/icon-512.png','./icons/icon-maskable.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('bunny-pocket-shell-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET'||new URL(e.request.url).origin!==self.location.origin)return;
  e.respondWith((async()=>{const cache=await caches.open(CACHE);try{const res=await fetch(e.request);if(res.ok&&FILES.some(f=>new URL(f,self.registration.scope).href===e.request.url))await cache.put(e.request,res.clone());return res;}catch{const hit=await cache.match(e.request);if(hit)return hit;if(e.request.mode==='navigate')return cache.match('./index.html');return Response.error();}})());
});
