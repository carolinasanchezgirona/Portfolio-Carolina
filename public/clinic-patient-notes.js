(() => {
  "use strict";
  const area = document.getElementById("clinic-private-notes-body");
  const save = document.getElementById("clinic-private-notes-save");
  const reload = document.getElementById("clinic-private-notes-reload");
  const status = document.getElementById("clinic-private-notes-status");
  const date = document.getElementById("clinic-private-notes-date");
  if (!area || !save || !reload || !status || !date) return;
  const endpoint = "https://grgyvdxkjdstdyumdfyg.supabase.co/rest/v1/clinical_patient_notes";
  const key = "sb_publishable_b2MRfP0bPti87V2FXCzHGw_Y9vvcbii";
  // Unsaved drafts exist only in this page's memory, separately for each patient.
  const drafts = new Map();
  let current = "";
  function render(id) {
    if (id !== current) return;
    const item = drafts.get(id);
    area.value = item?.body || "";
    area.disabled = !item?.loaded || item.loading || item.saving;
    save.disabled = area.disabled || item.body === item.saved;
    reload.hidden = !item?.error;
    reload.disabled = Boolean(item?.loading || item?.saving);
    status.textContent = item?.loading ? "Cargando notas…" : item?.saving ? "Guardando notas…" : item?.error || (item?.body !== item?.saved ? "Cambios sin guardar. Pulsa «Guardar notas»." : item?.loaded ? "Notas guardadas." : "");
    status.dataset.error = String(Boolean(item?.error));
    date.textContent = item?.updated ? "Último guardado: " + new Date(item.updated).toLocaleString("es-ES") : "";
  }
  async function api(url, init = {}) {
    let session;
    try { session = JSON.parse(sessionStorage.getItem("dememoria_admin_session") || "null"); } catch { /* fail closed */ }
    if (!session?.access_token) throw new Error("Tu sesión ha caducado. Vuelve a iniciar sesión antes de guardar.");
    const response = await fetch(url, { ...init, cache: "no-store", headers: {
      apikey: key, Authorization: "Bearer " + session.access_token,
      "Content-Type": "application/json", Prefer: "return=representation",
    } });
    const body = await response.json().catch(() => null);
    if (!response.ok) {
      if (response.status === 409) throw new Error("Esta nota ha cambiado en otra ventana. Tu borrador sigue aquí. Cópialo antes de recargar la nota guardada.");
      throw new Error(response.status === 401 || response.status === 403 ? "No tienes una sesión válida para acceder a estas notas." : "No se han podido guardar o cargar las notas. Tu borrador sigue en esta ficha; comprueba la conexión.");
    }
    if (!Array.isArray(body)) throw new Error("No se ha podido confirmar la operación.");
    return body;
  }
  async function load(id, discard = false) {
    let item = drafts.get(id);
    if (item?.loading || item?.saving) { render(id); return; }
    if (item?.loaded && item.body !== item.saved && !discard) { render(id); return; }
    item = item || { body: "", saved: "", loaded: false, revision: null };
    drafts.set(id, item); item.loading = true; item.error = ""; render(id);
    try {
      const rows = await api(endpoint + "?select=patient_id,body,revision,updated_at&patient_id=eq." + encodeURIComponent(id) + "&limit=1");
      const row = rows[0];
      item.body = item.saved = row?.body || "";
      item.revision = row?.revision || null; item.updated = row?.updated_at || null; item.loaded = true;
    } catch (error) { item.error = error.message; }
    finally { item.loading = false; render(id); }
  }
  area.addEventListener("input", () => {
    const item = drafts.get(current); if (!item?.loaded || item.saving) return;
    item.body = area.value; item.error = "";
    // Keep cursor and selection intact while updating status.
    save.disabled = item.body === item.saved;
    status.textContent = item.body === item.saved ? "Notas guardadas." : "Cambios sin guardar. Pulsa «Guardar notas».";
    status.dataset.error = "false"; reload.hidden = true;
  });
  save.addEventListener("click", async () => {
    const id = current, item = drafts.get(id);
    if (!item?.loaded || item.saving || item.loading || item.body === item.saved) return;
    item.saving = true; item.error = ""; render(id);
    const body = item.body;
    try {
      const payload = { body, revision: (item.revision || 0) + 1, updated_at: new Date().toISOString() };
      const rows = await api(endpoint + (item.revision ? "?patient_id=eq." + encodeURIComponent(id) + "&revision=eq." + item.revision : ""), {
        method: item.revision ? "PATCH" : "POST",
        body: JSON.stringify(item.revision ? payload : { ...payload, patient_id: id }),
      });
      const row = rows[0];
      if (!row || row.patient_id !== id) throw new Error("Esta nota ha cambiado en otra ventana. Tu borrador sigue aquí. Cópialo antes de recargar la nota guardada.");
      item.saved = body; item.revision = row.revision; item.updated = row.updated_at;
    } catch (error) { item.error = error.message; }
    finally { item.saving = false; render(id); }
  });
  reload.addEventListener("click", () => { if (current) void load(current, true); });
  window.addEventListener("clinical:patient-opened", event => {
    const id = event.detail?.patientId;
    if (typeof id !== "string" || !/^[0-9a-f-]{36}$/i.test(id)) return;
    current = id; area.value = ""; void load(id);
  });
  window.addEventListener("beforeunload", event => {
    if ([...drafts.values()].some(item => item.body !== item.saved)) { event.preventDefault(); event.returnValue = ""; }
  });
})();
