(() => {
  "use strict";
  // Only the authenticated clinical area can read this information.
  const dialog = document.querySelector("#clinic-patient-dialog");
  const idField = document.querySelector("#clinic-patient-id");
  const contact = document.querySelector("#clinic-patient-contact");
  if (!dialog || !idField || !contact) return;

  const notice = document.createElement("div");
  notice.className = "clinic-deferred-consent";
  notice.hidden = true;
  notice.setAttribute("role", "status");
  notice.style.cssText = "margin:12px 0;padding:13px 16px;border:1px solid #D9B89D;border-radius:9px;background:#FFF9F2;color:#5C402E;font-size:.89rem;line-height:1.6";
  contact.insertAdjacentElement("afterend", notice);
  let lookup = 0;

  async function refresh() {
    const current = ++lookup;
    const patientId = String(idField.value || "").trim();
    notice.hidden = true;
    if (dialog.hidden || !/^[0-9a-f-]{36}$/i.test(patientId)) return;
    let accessToken = "";
    try { accessToken = JSON.parse(sessionStorage.getItem("dememoria_admin_session") || "null")?.access_token || ""; } catch { /* no session */ }
    if (!accessToken) return;
    try {
      const query = new URLSearchParams({
        select: "id,service_code,starts_at",
        clinical_patient_id: "eq." + patientId,
        consent_deferred: "eq.true",
        order: "starts_at.desc",
        limit: "1",
      });
      const response = await fetch("https://grgyvdxkjdstdyumdfyg.supabase.co/rest/v1/appointment_bookings?" + query, {
        headers: {
          apikey: "sb_publishable_b2MRfP0bPti87V2FXCzHGw_Y9vvcbii",
          Authorization: "Bearer " + accessToken,
        },
        cache: "no-store",
      });
      if (!response.ok) return;
      const rows = await response.json();
      if (current !== lookup || dialog.hidden || idField.value !== patientId || !rows.length) return;
      // Si el consentimiento ya figura archivado en la historia, no mostrarlo como pendiente.
      const documentsQuery = new URLSearchParams({
        select: "id",
        patient_id: "eq." + patientId,
        category: "eq.consent",
        limit: "1",
      });
      const documentsResponse = await fetch("https://grgyvdxkjdstdyumdfyg.supabase.co/rest/v1/clinical_documents?" + documentsQuery, {
        headers: {
          apikey: "sb_publishable_b2MRfP0bPti87V2FXCzHGw_Y9vvcbii",
          Authorization: "Bearer " + accessToken,
        },
        cache: "no-store",
      });
      if (documentsResponse.ok) {
        const recorded = await documentsResponse.json();
        if (Array.isArray(recorded) && recorded.length) return;
      }
      if (current !== lookup || dialog.hidden || idField.value !== patientId) return;
      const link = rows[0].service_code === "neuropsicologia" ? "/consentimiento-neuropsicologico/" : "/consentimiento-psicologico/";
      notice.replaceChildren();
      const title = document.createElement("strong");
      title.textContent = "Consentimiento clínico pendiente de documentar";
      const body = document.createElement("p");
      body.style.cssText = "margin:5px 0";
      body.textContent = "Esta persona ha reservado sin firmar documentos clínicos. Revisa el encuadre, informa y obtén el consentimiento antes de iniciar la atención; registra el resultado en la historia.";
      const anchor = document.createElement("a");
      anchor.href = link;
      anchor.target = "_blank";
      anchor.rel = "noopener noreferrer";
      anchor.textContent = "Consultar el documento de consentimiento";
      notice.append(title, body, anchor);
      notice.hidden = false;
    } catch {
      // Booking reads must never block clinical record access.
    }
  }

  new MutationObserver(refresh).observe(dialog, {attributes:true,attributeFilter:["hidden"]});
  document.querySelector("#clinic-patient-close")?.addEventListener("click", () => { lookup++; notice.hidden = true; });
})();