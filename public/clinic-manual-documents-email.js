(() => {
  "use strict";
  const dialog = document.getElementById("clinic-patient-dialog");
  const patientIdField = document.getElementById("clinic-patient-id");
  const panel = document.getElementById("clinic-manual-documents");
  const emailText = document.getElementById("clinic-legal-email");
  const sendButton = document.getElementById("clinic-legal-send");
  const consentOption = document.getElementById("clinic-legal-consents");
  const privacyOption = document.getElementById("clinic-legal-privacy");
  const statusText = document.getElementById("clinic-legal-message");
  if (!dialog || !panel || !patientIdField || !emailText || !sendButton || !consentOption || !privacyOption || !statusText) return;

  const endpoint = "/api/admin/patient-documents-email";
  let loadedId = "";
  let confirmedEmail = "";
  let previewRun = 0;
  let sending = false;
  function token() {
    try { return JSON.parse(sessionStorage.getItem("dememoria_admin_session") || "null")?.access_token || ""; }
    catch { return ""; }
  }
  function currentId() {
    return dialog.hidden ? "" : String(patientIdField.value || "").trim();
  }
  function documents() {
    const values = [];
    if (consentOption.checked) values.push("consentimientos");
    if (privacyOption.checked) values.push("privacidad");
    return values;
  }
  function setStatus(message) { statusText.textContent = message; }
  function refreshButton() { sendButton.disabled = sending || !confirmedEmail || !documents().length; }

  async function preview() {
    const patientId = currentId();
    if (!patientId || !/^[0-9a-f-]{36}$/i.test(patientId)) return;
    const current = ++previewRun;
    loadedId = patientId;
    confirmedEmail = "";
    emailText.textContent = "Comprobando correo guardado…";
    setStatus("");
    refreshButton();
    const access = token();
    if (!access) { emailText.textContent = "Inicia sesión profesional."; return; }
    try {
      const response = await fetch(endpoint + "?patient_id=" + encodeURIComponent(patientId), {
        headers: { Authorization: "Bearer " + access },
        cache: "no-store",
      });
      const data = await response.json().catch(() => ({}));
      if (current !== previewRun || currentId() !== patientId) return;
      if (!response.ok || !data.email) {
        emailText.textContent = "No disponible";
        setStatus(data.error || "No se ha podido verificar el correo guardado.");
        return;
      }
      confirmedEmail = String(data.email);
      emailText.textContent = confirmedEmail;
      if (!data.configured) setStatus("El servicio de correo no está configurado en el servidor.");
      refreshButton();
    } catch {
      if (current !== previewRun || currentId() !== patientId) return;
      emailText.textContent = "No disponible";
      setStatus("No se ha podido comprobar el destinatario.");
    }
  }

  sendButton.addEventListener("click", async () => {
    const patientId = currentId();
    const selected = documents();
    if (sending || !patientId || patientId !== loadedId || !confirmedEmail || !selected.length) return;
    const label = selected.map(v => v === "consentimientos" ? "consentimientos informados" : "política de protección de datos").join(" y ");
    if (!window.confirm("Se enviará un correo con " + label + " a " + confirmedEmail + ". ¿Confirmas el envío manual?")) return;
    sending = true;
    refreshButton();
    setStatus("Solicitando el envío…");
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { Authorization: "Bearer " + token(), "Content-Type": "application/json" },
        body: JSON.stringify({
          patient_id: patientId,
          documents: selected,
          email_confirmation: confirmedEmail,
          confirm_recipient: true,
        }),
        cache: "no-store",
      });
      const data = await response.json().catch(() => ({}));
      if (currentId() !== patientId) return;
      if (!response.ok || !data.accepted) {
        setStatus(data.error || "El proveedor no ha aceptado el envío.");
        return;
      }
      setStatus("Correo aceptado por el proveedor para " + confirmedEmail + ". La entrega no está confirmada. No se ha firmado ningún consentimiento.");
    } catch {
      if (currentId() === patientId) setStatus("No se puede confirmar si el proveedor aceptó el correo. Compruébalo antes de volver a enviarlo.");
    } finally {
      sending = false;
      refreshButton();
    }
  });

  consentOption.addEventListener("change", refreshButton);
  privacyOption.addEventListener("change", refreshButton);
  panel.addEventListener("toggle", () => {
    if (panel.open && currentId() && !sending) void preview();
  });
  new MutationObserver(() => {
    if (dialog.hidden) {
      previewRun++;
      confirmedEmail = "";
      loadedId = "";
      emailText.textContent = "Selecciona un paciente";
      setStatus("");
      refreshButton();
    } else {
      window.setTimeout(() => { if (currentId() && panel.open && currentId() !== loadedId) void preview(); }, 100);
    }
  }).observe(dialog, { attributes: true, attributeFilter: ["hidden"] });
})();
