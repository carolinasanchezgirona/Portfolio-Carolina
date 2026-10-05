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

  async function login() {
    const response = await fetch(AUTH_URL + "/token?grant_type=password", {
      method: "POST",
      headers: { apikey: KEY, "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.value.trim(), password: password.value })
    });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(body.error_description || body.msg || "No se ha podido iniciar sesión.");
    if (body.user?.id !== OWNER) throw new Error("Esta cuenta no tiene acceso al área clínica.");
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(body));
  }

  form?.addEventListener("submit", async (event) => {
    event.preventDefault();
    message.textContent = "Comprobando acceso…";
    submit.disabled = true;
    try {
      await login();
      password.value = "";
      window.location.assign("/admin/clinica/?panel=1");
    } catch (error) {
      message.textContent = error?.message || "No se ha podido iniciar sesión.";
      submit.disabled = false;
    }
  });
})();