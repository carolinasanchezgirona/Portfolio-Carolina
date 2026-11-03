/* Shared browser-side mobile approval client.
   The signing key is non-exportable and stored in IndexedDB on the paired phone. */
(() => {
  "use strict";
  const clinic = !location.hostname.includes("mineuri.com");
  const url = clinic
    ? "https://grgyvdxkjdstdyumdfyg.supabase.co"
    : "https://qtuzwzanifviukqcfzwa.supabase.co";
  const key = clinic
    ? "sb_publishable_b2MRfP0bPti87V2FXCzHGw_Y9vvcbii"
    : "sb_publishable_G1q_gbdK6tF1JUb9N4mcdg_G0xEEif-";
  const apiUrl = url + "/functions/v1/admin-mobile-approval";
  const encoder = new TextEncoder();
  function encode(data) {
    return btoa(String.fromCharCode(...new Uint8Array(data)))
      .replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/g,"");
  }
  async function api(action, body = {}, token = null) {
    const res = await fetch(apiUrl, {
      method:"POST", mode:"cors", cache:"no-store",
      headers:{"Content-Type":"application/json",apikey:key,...(token?{Authorization:"Bearer "+token}:{})},
      body:JSON.stringify({action,...body}),
    });
    const result=await res.json().catch(()=>({}));
    if(!res.ok) throw Error(result.error || "No se ha podido verificar el acceso.");
    return result;
  }
  async function passwordLogin(email,password) {
    const r=await fetch(url+"/auth/v1/token?grant_type=password",{
      method:"POST",cache:"no-store",
      headers:{apikey:key,"Content-Type":"application/json"},
      body:JSON.stringify({email,password}),
    });
    const result=await r.json().catch(()=>({}));
    if(!r.ok) throw Error(result.error_description||result.msg||"Credenciales incorrectas.");
    const user=await api("status",{},result.access_token);
    return {session:result,verification:user};
  }
  async function store() {
    return await new Promise((resolve,reject)=>{
      const req=indexedDB.open("admin-mobile-approval-v1",1);
      req.onupgradeneeded=()=>{if(!req.result.objectStoreNames.contains("trusted"))req.result.createObjectStore("trusted");};
      req.onerror=()=>reject(req.error);
      req.onsuccess=()=>resolve(req.result);
    });
  }
  async function getDevice() {
    const db=await store();
    try {
      return await new Promise((resolve,reject)=>{
        const t=db.transaction("trusted","readonly");
        const q=t.objectStore("trusted").get("phone");
        q.onsuccess=()=>resolve(q.result||null);q.onerror=()=>reject(q.error);
      });
    } finally {db.close();}
  }
  async function saveDevice(value) {
    const db=await store();
    try {
      return await new Promise((resolve,reject)=>{
        const t=db.transaction("trusted","readwrite");
        t.objectStore("trusted").put(value,"phone");
        t.oncomplete=()=>resolve(true);t.onerror=()=>reject(t.error);
      });
    } finally {db.close();}
  }
  async function unregisterLocalDevice() {
    const db=await store();
    try {
      return await new Promise((resolve,reject)=>{
        const t=db.transaction("trusted","readwrite");
        t.objectStore("trusted").delete("phone");
        t.oncomplete=()=>resolve(true);t.onerror=()=>reject(t.error);
      });
    } finally {db.close();}
  }
  async function serviceWorker() {
    if (!("serviceWorker" in navigator)) return null;
    return navigator.serviceWorker.register(clinic?"/sw.js":"/admin/sw.js",{scope:clinic?"/":"/admin/"});
  }
  function fromBase64url(v) {
    return Uint8Array.from(atob(v.replace(/-/g,"+").replace(/_/g,"/")+"=".repeat((4-v.length%4)%4)),c=>c.charCodeAt(0));
  }
  async function pushSubscription(token) {
    if (!window.isSecureContext || !("Notification" in window) || !("PushManager" in window)) return null;
    if(Notification.permission==="default") await Notification.requestPermission();
    if(Notification.permission!=="granted") return null;
    const config=await api("config",{},token);
    if(!config.public_key) return null;
    const reg=await serviceWorker();
    if(!reg) return null;
    const existing=await reg.pushManager.getSubscription();
    return (existing || await reg.pushManager.subscribe({
      userVisibleOnly:true, applicationServerKey:fromBase64url(config.public_key),
    })).toJSON();
  }
  async function enroll(token) {
    let phone=await getDevice();
    if (!phone) {
      const pair=await crypto.subtle.generateKey({name:"ECDSA",namedCurve:"P-256"},false,["sign","verify"]);
      phone={
        id:crypto.randomUUID(),
        privateKey:pair.privateKey,
        publicKey:await crypto.subtle.exportKey("jwk",pair.publicKey),
        enrolled:false,
      };
      // Save before sending the public key: a lost network response must
      // never leave an enrolled device without a recoverable signing key.
      await saveDevice(phone);
    }
    let subscription=null;
    try {subscription=await pushSubscription(token);}catch(e){console.warn("Push permission unavailable",e);}
    const result=await api("enroll",{
      device_id:phone.id,public_key:phone.publicKey,
      label:"Móvil de confianza",push_subscription:subscription,
    },token);
    phone.enrolled=true;phone.notifications=!!subscription;
    await saveDevice(phone);
    return {...result,notifications:!!subscription};
  }
  async function signed(action, message, extra={}) {
    const phone=await getDevice();
    if(!phone?.privateKey || !phone.id) throw Error("Primero vincula este teléfono.");
    const timestamp=Date.now();
    const bytes=await crypto.subtle.sign({name:"ECDSA",hash:"SHA-256"},
      phone.privateKey,encoder.encode(message+"|"+timestamp));
    return api(action,{
      device_id:phone.id,timestamp,signature:encode(bytes),...extra,
    });
  }
  const pending=()=>signed("pending","pending");
  const decide=(id,approval)=>signed(approval?"approve":"deny",
    "decide|"+id+"|"+(approval?"approved":"denied"),{request_id:id});
  const revoke=async()=>{const value=await signed("revoke","revoke");await unregisterLocalDevice();return value;};
  window.AdminMobile={
    api,passwordLogin,getDevice,enroll,pending,decide,revoke,unregisterLocalDevice,
    provider:clinic?"Mi clínica":"Mineuri",
  };
})();
