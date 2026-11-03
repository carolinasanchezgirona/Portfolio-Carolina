(() => {
  "use strict";
  const AUTH_URL = "https://grgyvdxkjdstdyumdfyg.supabase.co/auth/v1";
  const KEY = "sb_publishable_b2MRfP0bPti87V2FXCzHGw_Y9vvcbii";
  const SESSION_KEY = "dememoria_admin_session";
  const OWNER = "9d2cfdb1-fed6-4f76-b47a-d58507eb14f2";
  const form = document.getElementById("clinical-access-form");
  const email = document.getElementById("clinical-access-email");
  const password = document.getElementById("clinical-access-password");
  const message = document.getElementById("clinical-access-message");
  const submit = document.getElementById("clinical-access-submit");
  const panel = document.getElementById("clinical-mobile-wait");
  const mobileMessage = document.getElementById("clinical-mobile-message");
  const resend = document.getElementById("clinical-mobile-resend");
  const cancel = document.getElementById("clinical-mobile-cancel");
  let pendingSession = null;
  let checkTimer = null;
  let checking = false;

  async function mobileApi(action, body, token) {
    for(let attempts=0;attempts<50;attempts++) {
      if(window.AdminMobile?.api) return window.AdminMobile.api(action,body||{},token);
      await new Promise(resolve=>setTimeout(resolve,100));
    }
    throw Error("No se ha podido cargar la verificación móvil.");
  }
  async function approved(token) {
    const result = await mobileApi("status",{},token);
    return !result.paired || result.approved;
  }
  async function currentUser() {
    let session;
    try { session = JSON.parse(sessionStorage.getItem(SESSION_KEY) || "null"); } catch{return null;}
    if(!session?.access_token) return null;
    const response=await fetch(AUTH_URL+"/user",{
      headers:{apikey:KEY,Authorization:"Bearer "+session.access_token},
      cache:"no-store",
    });
    if(!response.ok)return null;
    const user=await response.json().catch(()=>null);
    if(user?.id!==OWNER)return null;
    return await approved(session.access_token) ? user : null;
  }
  async function passwordLogin() {
    const response=await fetch(AUTH_URL+"/token?grant_type=password",{
      method:"POST",headers:{apikey:KEY,"Content-Type":"application/json"},
      body:JSON.stringify({email:email.value.trim(),password:password.value}),
    });
    const body=await response.json().catch(()=>({}));
    if(!response.ok)throw Error(body.error_description||body.msg||"No se ha podido iniciar sesión.");
    if(body.user?.id!==OWNER)throw Error("Esta cuenta no tiene acceso al área clínica.");
    return body;
  }
  function enter(session) {
    sessionStorage.setItem(SESSION_KEY,JSON.stringify(session));
    pendingSession=null;
    password.value="";
    window.location.assign("/admin/");
  }
  function stopWaiting() {
    if(checkTimer){clearInterval(checkTimer);checkTimer=null;}
    checking=false;
  }
  async function check() {
    if(!pendingSession||checking)return;
    checking=true;
    try{
      const status=await mobileApi("status",{},pendingSession.access_token);
      if(status.approved){stopWaiting();enter(pendingSession);return;}
      if(status.denied){
        stopWaiting();
        mobileMessage.textContent="Has denegado este inicio en tu teléfono. El acceso no está permitido.";
        resend.disabled=true;
      }else if(!status.pending){
        mobileMessage.textContent="La solicitud ha caducado. Pulsa «Reenviar solicitud» para generar otra.";
      }
    }catch(error){
      mobileMessage.textContent=error?.message||"No se ha podido consultar el estado.";
    }finally{checking=false;}
  }
  async function beginApproval() {
    if(!pendingSession)return;
    resend.disabled=true;
    const value=await mobileApi("request",{client_label:"Mi clínica · Navegador"},pendingSession.access_token);
    if(value.approved){enter(pendingSession);return;}
    if(!value.paired&&!value.request_id){enter(pendingSession);return;}
    form.hidden=true;panel.hidden=false;
    mobileMessage.textContent=value.notification_sent
      ?"Te hemos enviado una solicitud al teléfono de confianza. Aprueba solo si eres tú."
      :"Abre «Confirmar accesos» en tu móvil y aprueba esta solicitud.";
    resend.disabled=false;
    if(checkTimer)clearInterval(checkTimer);
    checkTimer=setInterval(check,2500);
    await check();
  }
  form?.addEventListener("submit",async event=>{
    event.preventDefault();
    submit.disabled=true;
    message.textContent="Comprobando acceso…";
    try{
      const session=await passwordLogin();
      password.value="";
      const state=await mobileApi("status",{},session.access_token);
      if(state.paired&&!state.approved) {
        pendingSession=session;
        await beginApproval();
      }else enter(session);
    }catch(error){
      message.textContent=error?.message||"No se ha podido iniciar sesión.";
      submit.disabled=false;
    }
  });
  resend?.addEventListener("click",()=>beginApproval().catch(error=>{
    mobileMessage.textContent=error?.message||"No se ha podido enviar la solicitud.";
    resend.disabled=false;
  }));
  cancel?.addEventListener("click",()=>{
    stopWaiting();pendingSession=null;password.value="";
    panel.hidden=true;form.hidden=false;submit.disabled=false;
    message.textContent="Inicio de sesión cancelado.";
  });
  (async()=>{
    const user=await currentUser().catch(()=>null);
    if(user){window.location.replace("/admin/");return;}
    sessionStorage.removeItem(SESSION_KEY);
  })();
})();