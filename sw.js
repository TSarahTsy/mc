// 星星電子世界冒險 service worker：更新遊戲檔案後，請把版本號加一
var CACHE='star-adventure-v3';
var CORE=['star-adventure.html','manifest.webmanifest','icon-192.png','icon-512.png','icon-180.png',
  'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js'];
self.addEventListener('install',function(e){
  e.waitUntil(caches.open(CACHE).then(function(c){
    return Promise.all(CORE.map(function(u){
      return fetch(new Request(u,{mode:u.indexOf('http')===0?'no-cors':'same-origin'})).then(function(r){return c.put(u,r);}).catch(function(){});
    }));
  }).then(function(){return self.skipWaiting();}));
});
self.addEventListener('activate',function(e){
  e.waitUntil(caches.keys().then(function(ks){
    return Promise.all(ks.filter(function(k){return k!==CACHE;}).map(function(k){return caches.delete(k);}));
  }).then(function(){return self.clients.claim();}));
});
// 先取網絡上的最新版本，離線時才使用快取
self.addEventListener('fetch',function(e){
  if(e.request.method!=='GET')return;
  e.respondWith(fetch(e.request).then(function(r){
    var copy=r.clone();caches.open(CACHE).then(function(c){c.put(e.request,copy);}).catch(function(){});
    return r;
  }).catch(function(){return caches.match(e.request,{ignoreSearch:true});}));
});
