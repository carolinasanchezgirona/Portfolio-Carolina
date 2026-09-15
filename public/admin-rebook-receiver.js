(() => {
  "use strict";
  const params = new URLSearchParams(window.location.search);
  if (params.get("rebook") !== "1") return;

  let draft = null;
  try { draft = JSON.parse(sessionStorage.getItem("clinic_rebook_draft") || "null"); } catch {}
  if (!draft || Date.now() - Number(draft.created_at || 0) > 10 * 60 * 1000) {
    sessionStorage.removeItem("clinic_rebook_draft");
    return;
  }

  const app = document.querySelector("#admin-app");
  const openAndFill = () => {
    if (!app || app.hidden) return false;
    const button = document.querySelector("#admin-new");
    if (!button) return false;
    button.click();
    setTimeout(() => {
      const name = document.querySelector("#appointment-name");
      const email = document.querySelector("#appointment-email");
      const phone = document.querySelector("#appointment-phone");
      const patientType = document.querySelector("#appointment-patient-type");
      if (name) name.value = draft.name || "";
      if (email) email.value = draft.email || "";
      if (phone) phone.value = draft.phone || "";
      if (patientType) patientType.value = "existing";
      sessionStorage.removeItem("clinic_rebook_draft");
      const clean = new URL(window.location.href);
      clean.searchParams.delete("rebook");
      history.replaceState({}, "", clean.pathname + clean.search + clean.hash);
    }, 50);
    return true;
  };

  if (openAndFill()) return;
  const observer = new MutationObserver(() => {
    if (openAndFill()) observer.disconnect();
  });
  if (app) observer.observe(app, { attributes: true, attributeFilter: ["hidden"] });
  setTimeout(() => observer.disconnect(), 15000);
})();