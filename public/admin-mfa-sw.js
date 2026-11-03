/* Dedicated security notifications. Separate PushManager from clinical appointment alerts. */
self.addEventListener("install",()=>self.skipWaiting());
self.addEventListener("activate",event=>event.waitUntil(self.clients.claim()));
self.addEventListener("push",event=>{
  event.waitUntil(self.registration.showNotification("Mi clínica · Confirma un acceso",{
    body:"¿Estás intentando entrar en la administración? Revisa la solicitud desde tu móvil.",
    tag:"clinical-admin-login",renotify:true,
    data:{url:"/admin-mobile.html"},
    icon:"/clinic-pwa-icon-192.png",
  }));
});
self.addEventListener("notificationclick",event=>{
  event.notification.close();
  event.waitUntil((async()=>{
    const url=new URL("/admin-mobile.html",self.location.origin).href;
    const clients=await self.clients.matchAll({type:"window",includeUncontrolled:true});
    const existing=clients.find(c=>c.url.startsWith(url));
    if(existing){await existing.focus();return;}
    await self.clients.openWindow(url);
  })());
});
