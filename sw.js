// Bump this on every deploy so old caches get purged and clients pick up new code.
const CACHE_NAME='cardtrack-v202609121725';
const APP_SHELL=['./','./index.html'];

self.addEventListener('install',function(e){
  e.waitUntil((async function(){
    var c=await caches.open(CACHE_NAME);
    await Promise.all(APP_SHELL.map(function(u){return c.add(u).catch(function(){})}));
  })());
  // Do NOT call self.skipWaiting() here — keep the new SW "waiting" so the user
  // can dismiss/tap the update toast before the page auto-reloads.
});

self.addEventListener('activate',function(e){
  e.waitUntil(caches.keys().then(function(ks){
    return Promise.all(ks.filter(function(k){return k!==CACHE_NAME}).map(function(k){return caches.delete(k)}));
  }));
  self.clients.claim();
});

self.addEventListener('message',function(e){
  if(e.data&&e.data.type==='SKIP_WAITING')self.skipWaiting();
});

self.addEventListener('fetch',function(e){
  if(e.request.method!=='GET')return;
  var url=new URL(e.request.url);
  if(url.origin!==self.location.origin)return;

  // HTML navigations: ALWAYS try network first with no HTTP cache — never serve stale HTML.
  // Only fall back to cache if the network truly fails (offline).
  var isHTML = e.request.mode==='navigate' ||
               (e.request.headers.get('accept')||'').indexOf('text/html')!==-1 ||
               url.pathname.endsWith('/') || url.pathname.endsWith('.html');
  if(isHTML){
    e.respondWith(
      fetch(e.request,{cache:'no-store'}).then(function(res){
        if(res&&res.status===200){var copy=res.clone();caches.open(CACHE_NAME).then(function(c){c.put(e.request,copy)})}
        return res;
      }).catch(function(){
        return caches.match(e.request).then(function(c){return c||caches.match('./index.html')});
      })
    );
    return;
  }

  // Other assets: network-first with cache fallback (unchanged).
  e.respondWith(fetch(e.request).then(function(res){
    if(res&&res.status===200){var copy=res.clone();caches.open(CACHE_NAME).then(function(c){c.put(e.request,copy)})}
    return res;
  }).catch(function(){return caches.match(e.request)}));
});
