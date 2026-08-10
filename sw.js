const CACHE_NAME='cardtrack-v2';
const APP_SHELL=['./','./index.html'];
self.addEventListener('install',function(e){e.waitUntil((async function(){var c=await caches.open(CACHE_NAME);await Promise.all(APP_SHELL.map(function(u){return c.add(u).catch(function(){});}));})());self.skipWaiting();});
self.addEventListener('activate',function(e){e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.filter(function(k){return k!==CACHE_NAME;}).map(function(k){return caches.delete(k);}));}));self.clients.claim();});
self.addEventListener('fetch',function(e){
  if(e.request.method!=='GET')return;
  var url=new URL(e.request.url);
  if(url.origin!==self.location.origin)return;
  e.respondWith(fetch(e.request).then(function(res){
    if(res&&res.status===200){var copy=res.clone();caches.open(CACHE_NAME).then(function(c){c.put(e.request,copy);});}
    return res;
  }).catch(function(){return caches.match(e.request).then(function(c){return c||caches.match('./index.html');});}));
});
