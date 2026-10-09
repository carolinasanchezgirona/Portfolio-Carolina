self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));
self.addEventListener("fetch", (event) => {
  if (event.request.method === "GET") {
    event.respondWith(fetch(event.request));
  }
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
