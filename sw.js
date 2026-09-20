// Bump this on every deploy so old caches get purged and clients pick up new code.
const CACHE_NAME='cardtrack-v202609201301';
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

  // Stale-while-revalidate: trả bản CACHE NGAY (không chờ mạng → mượt cả khi wifi yếu / chập chờn),
  // đồng thời tải bản mới ở NỀN để cập nhật cache cho lần mở sau. Không lo kẹt bản cũ vì app đã có
  // cơ chế báo "🔄 Có bản mới / Tải lại" (ctVer so window.CT_BUILD với sw.js trên server).
  // Trước đây HTML dùng network-first + no-store → mỗi lần mở/‌foreground phải chờ tải nguyên file
  // HTML (~0.5MB) xong mới hiện, wifi kém là đơ.
  e.respondWith((async function(){
    var cache=await caches.open(CACHE_NAME);
    var cached=await cache.match(e.request);
    var netP=fetch(e.request).then(function(res){
      if(res&&res.status===200){cache.put(e.request,res.clone())}
      return res;
    }).catch(function(){return null});
    if(cached) return cached;                 // có cache → trả ngay, cập nhật nền
    var net=await netP;                       // chưa có cache (lần đầu) → chờ mạng
    return net || cache.match('./index.html');
  })());
});
