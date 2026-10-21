self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));
// Static application shell only. Clinical responses and credentials NEVER enter Cache Storage.
const RESIDENCE_CACHE = 'residence-shell-v1';
function shellUrl(url) {
 return url.origin === self.location.origin && (url.pathname.startsWith('/_next/static/') ||
  ['/admin/residencia/', '/admin/residencia/index.html'].includes(url.pathname) ||
  /^\/(?:admin-shell\.js|clinic-pwa-icon-\d+\.png|clinic-manifest\.webmanifest)$/.test(url.pathname));
}
self.addEventListener('message', event => {
 if (event.data?.type !== 'PREPARE_RESIDENCE_OFFLINE') return;
 event.waitUntil((async () => {
  try {
   const cache = await caches.open(RESIDENCE_CACHE);
   const urls = [...new Set(['/admin/residencia/', '/clinic-manifest.webmanifest', '/clinic-pwa-icon-192.png',
    ...(event.data.assets || []).filter(value => shellUrl(new URL(value, self.location.origin)))])];
   // Fetch all first; a failed download never reports the device as prepared.
   const responses = await Promise.all(urls.map(async value => {
    const response = await fetch(value, {cache: 'reload'});
    if (!response.ok || response.redirected) throw Error('Incomplete shell');
    return [value, response];
   }));
   // A deployment may change between opening the page and preparing it. Cache the
   // chunks referenced by the downloaded document as well as the currently loaded ones.
   const shell = responses.find(([url]) => url === '/admin/residencia/')[1];
   const html = await shell.clone().text();
   const linked = [...new Set([...html.matchAll(/(?:src|href)="(\/_next\/static\/[^"<>]+)"/g)].map(match => match[1]))];
   const extra = await Promise.all(linked.filter(url => !urls.some(value => new URL(value, self.location.origin).pathname === url)).map(async url => {
    const response = await fetch(url, {cache: 'reload'});
    if (!response.ok || response.redirected) throw Error('Incomplete shell chunks');
    return [url, response];
   }));
   for (const [url, response] of [...responses, ...extra]) await cache.put(url, response);
   event.ports[0]?.postMessage({ok: true});
  } catch { event.ports[0]?.postMessage({ok: false}); }
 })());
});
self.addEventListener('fetch', event => {
 const url = new URL(event.request.url);
 const adminEntry = url.origin === self.location.origin && url.pathname === '/admin/' && event.request.mode === 'navigate';
 if(event.request.method !== 'GET' || (!adminEntry && !shellUrl(url))) return;
 // React Flight responses share pathnames with HTML: never cache them as the document.
 if(event.request.headers.get('RSC') || new URL(event.request.url).searchParams.has('_rsc')) return;
 event.respondWith((async () => {
  try { return await fetch(event.request); }
  catch { const cache = await caches.open(RESIDENCE_CACHE);
   if(adminEntry && await cache.match('/admin/residencia/')) return Response.redirect(new URL('/admin/residencia/', self.location.origin).href);
   const response = await cache.match(event.request, {ignoreSearch: event.request.mode === 'navigate'});
   if(response) return response;
   return new Response('Abre Residencia con conexión y actualiza la descarga antes de trabajar sin cobertura.', {status:503,headers:{'Content-Type':'text/plain; charset=utf-8'}});
  }
 })());
});

/* Solo metadatos genéricos. El proveedor push nunca recibe nombres ni detalles clínicos. */
self.addEventListener("push", (event) => {
  event.waitUntil(self.registration.showNotification("Dememoria · Nuevo aviso", {
    body: "Tienes novedades pendientes en tu área profesional.",
    icon: "/pwa-icon.svg",
    badge: "/pwa-icon.svg",
    tag: "dememoria-professional-notice",
    renotify: false,
    data: { url: "/admin/notificaciones/" },
  }));
});
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil((async () => {
    const url = new URL("/admin/notificaciones/", self.location.origin).href;
    const windows = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
    const app = windows.find(client => client.url.startsWith(self.location.origin + "/admin/"));
    if (app) { await app.navigate(url); await app.focus(); return; }
    await self.clients.openWindow(url);
  })());
});
