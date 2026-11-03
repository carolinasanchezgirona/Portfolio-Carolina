/* Native Supabase Auth TOTP for administrator logins.
   Passwords and one-time codes are sent only to the project's Auth endpoint. */
(() => {
  "use strict";
  const current = document.currentScript?.src || "";
  const clinic = current.includes("/admin-authenticator.js");
  const ROOT = clinic
    ? "https://grgyvdxkjdstdyumdfyg.supabase.co"
    : "https://qtuzwzanifviukqcfzwa.supabase.co";
  const KEY = clinic
    ? "sb_publishable_b2MRfP0bPti87V2FXCzHGw_Y9vvcbii"
    : "sb_publishable_G1q_gbdK6tF1JUb9N4mcdg_G0xEEif-";
  const AUTH = ROOT + "/auth/v1";

  async function request(method, path, session, body) {
    const response = await fetch(AUTH + path, {
      method, cache: "no-store",
      headers: {
        apikey: KEY, "Content-Type": "application/json",
        ...(session?.access_token ? {Authorization: "Bearer " + session.access_token} : {}),
      },
      ...(body === undefined ? {} : {body: JSON.stringify(body)}),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      // Do not reveal codes, secrets or access tokens in messages.
      throw new Error(data.msg || data.error_description || data.message ||
        "No se pudo completar la verificación.");
    }
    return data;
  }
  function tokenAal(session) {
    try {
      const base = session.access_token.split(".")[1];
      const json = atob(base.replace(/-/g,"+").replace(/_/g,"/")+"=".repeat((4-base.length%4)%4));
      return JSON.parse(json)?.aal || "aal1";
    } catch {return "aal1";}
  }
  const verifiedFactors = user => (Array.isArray(user?.factors) ? user.factors : [])
    .filter(f => f.factor_type === "totp" && f.status === "verified");
  async function state(session) {
    const user = await request("GET","/user",session);
    const factors = verifiedFactors(user);
    return {user, factors, enrolled:factors.length>0,
      verified: factors.length===0 || tokenAal(session)==="aal2"};
  }
  async function enroll(session) {
    return request("POST","/factors",session,{
      factor_type:"totp", friendly_name: clinic?"Mi clínica":"Mineuri Admin",
      issuer: clinic?"Carolina - Mi clínica":"Mineuri",
    });
  }
  async function verify(session, factorId, code) {
    if (!/^[0-9]{6}$/.test(String(code))) throw new Error("Introduce los seis dígitos de Authenticator.");
    if (!/^[0-9a-f-]{36}$/i.test(String(factorId))) throw new Error("Factor no válido.");
    const challenge = await request("POST","/factors/"+factorId+"/challenge",session,{});
    if (!challenge.id) throw new Error("No se ha generado la comprobación del código.");
    const result = await request("POST","/factors/"+factorId+"/verify",session,{
      challenge_id:challenge.id, code:String(code),
    });
    if (!result.access_token || !result.refresh_token || tokenAal(result)!=="aal2")
      throw new Error("La sesión no se ha actualizado a verificación de dos factores.");
    return {...session,...result,user:result.user||session.user,
      expires_at:Math.floor(Date.now()/1000)+(result.expires_in||3600)};
  }
  async function unenroll(session,factorId) {
    if (tokenAal(session)!=="aal2") throw new Error("Confirma antes tu código de Authenticator.");
    return request("DELETE","/factors/"+encodeURIComponent(factorId),session);
  }
  function renderQr(img, svg) {
    if (!svg || typeof svg !== "string") throw new Error("No se ha recibido el código QR.");
    const raw=svg.startsWith("data:image/svg+xml;utf-8,") ?
      svg.slice("data:image/svg+xml;utf-8,".length) : svg;
    // The QR is rendered as an isolated image; we don't insert provider SVG as HTML.
    img.src="data:image/svg+xml;charset=utf-8,"+(raw.startsWith("%3C")?raw:encodeURIComponent(raw));
    img.alt="Código QR para vincular Authenticator";
  }
  window.AdminAuthenticator={request,tokenAal,verifiedFactors,state,enroll,verify,unenroll,renderQr,clinic};
})();
