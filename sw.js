/* Briefing Diario — service worker para notificaciones push */
self.addEventListener('install', function(){ self.skipWaiting(); });
self.addEventListener('activate', function(e){ e.waitUntil(self.clients.claim()); });

self.addEventListener('push', function(e){
  var d = {};
  try { d = e.data ? e.data.json() : {}; }
  catch (_) { d = { body: (e.data && e.data.text()) || '' }; }
  var title = d.title || 'Briefing Diario';
  var opts = {
    body: d.body || '',
    icon: 'apple-touch-icon.png',
    badge: 'apple-touch-icon.png',
    data: { url: d.url || './' },
    tag: d.tag || 'briefing'
  };
  e.waitUntil(self.registration.showNotification(title, opts));
});

self.addEventListener('notificationclick', function(e){
  e.notification.close();
  var url = (e.notification.data && e.notification.data.url) || './';
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(cl){
    for (var i = 0; i < cl.length; i++){ if ('focus' in cl[i]) return cl[i].focus(); }
    if (self.clients.openWindow) return self.clients.openWindow(url);
  }));
});
