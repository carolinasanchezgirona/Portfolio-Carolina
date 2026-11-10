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
  const mfaForm = document.getElementById("clinical-mfa-form");
  const mfaCode = document.getElementById("clinical-mfa-code");
  const mfaMessage = document.getElementById("clinical-mfa-message");
  const mfaSubmit = document.getElementById("clinical-mfa-submit");
  const mfaCancel = document.getElementById("clinical-mfa-cancel");
  const mfaFactor = document.getElementById("clinical-mfa-factor");
  const mfaChoice = document.getElementById("clinical-mfa-choice");
  let pending = null;
  let factorId = null;

  async function authenticator() {
    for(let n=0;n<40;n++){
      if(window.AdminAuthenticator) return window.AdminAuthenticator;
      await new Promise(resolve=>setTimeout(resolve,100));
    }
    throw new Error("No se ha cargado la verificación Authenticator.");
  }
  function getStoredSession() {
    try {return JSON.parse(sessionStorage.getItem(SESSION_KEY)||"null");}
    catch {return null;}
  }
  function safeReturnUrl() {
    const intended = new URLSearchParams(window.location.search).get("next") || "/admin/";
    try {
      const url = new URL(intended, window.location.origin);
      if (url.origin !== window.location.origin || !url.pathname.startsWith("/admin/") || intended.startsWith("//") || intended.includes("\\")) return "/admin/";
      return url.pathname + url.search + url.hash;
    } catch { return "/admin/"; }
  }
  function saveAndEnter(session) {
    sessionStorage.setItem(SESSION_KEY,JSON.stringify(session));
    pending=null;factorId=null;
    password.value="";mfaCode.value="";
    window.location.assign(safeReturnUrl());
  }
  function showMfa(session,factors) {
    pending=session;factorId=factors[0]?.id;
    mfaFactor.replaceChildren();
    for(const [index,factor] of factors.entries()) {
      const option=document.createElement("option");
      option.value=factor.id;
      option.textContent=(window.AdminAuthenticator?.factorName(factor,index)) || "Authenticator "+(index+1);
      mfaFactor.append(option);
    }
    mfaChoice.hidden=factors.length<2;
    form.hidden=true;
    mfaForm.hidden=false;
    mfaMessage.textContent="";
    mfaCode.value="";
    mfaCode.focus();
  }
  async function login() {
    const response=await fetch(AUTH_URL+"/token?grant_type=password",{
      method:"POST",cache:"no-store",
      headers:{apikey:KEY,"Content-Type":"application/json"},
      body:JSON.stringify({email:email.value.trim(),password:password.value}),
    });
    const body=await response.json().catch(()=>({}));
    if(!response.ok) throw new Error(body.error_description||body.msg||"No se ha podido iniciar sesión.");
    if(body.user?.id!==OWNER)throw new Error("Esta cuenta no tiene acceso al área clínica.");
    return body;
  }
  async function processSession(session) {
    const totp=await authenticator();
    const state=await totp.state(session);
    if(state.user.id!==OWNER)throw new Error("Esta cuenta no tiene permisos de administración.");
    if(state.enrolled&&!state.verified){showMfa(session,state.factors);return;}
    saveAndEnter(session);
  }

  form?.addEventListener("submit",async event=>{
    event.preventDefault();
    submit.disabled=true;message.textContent="Comprobando credenciales…";
    try {const session=await login();password.value="";await processSession(session);}
    catch(error){message.textContent=error?.message||"No se ha podido acceder.";submit.disabled=false;}
  });
  mfaForm?.addEventListener("submit",async event=>{
    event.preventDefault();
    if(!pending||!factorId)return;
    mfaSubmit.disabled=true;mfaMessage.textContent="Verificando código…";
    try{
      const totp=await authenticator();
      const verified=await totp.verify(pending,mfaFactor.value||factorId,mfaCode.value.trim());
      saveAndEnter(verified);
    }catch(error){
      mfaMessage.textContent=error?.message||"Código incorrecto o caducado.";
      mfaSubmit.disabled=false;mfaCode.select();
    }
  });
  mfaCancel?.addEventListener("click",()=>{
    pending=null;factorId=null;
    mfaForm.hidden=true;form.hidden=false;
    password.value="";mfaCode.value="";
    submit.disabled=false;message.textContent="";
    sessionStorage.removeItem(SESSION_KEY);
  });

  (async()=>{
    const stored=getStoredSession();
    if(!stored?.access_token)return;
    try {await processSession(stored);}
    catch {sessionStorage.removeItem(SESSION_KEY);}
  })();
})();