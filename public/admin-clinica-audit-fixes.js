(() => {
  "use strict";

  const SUPABASE_URL = "https://grgyvdxkjdstdyumdfyg.supabase.co";
  const REST_URL = `${SUPABASE_URL}/rest/v1`;
  const KEY = "sb_publishable_b2MRfP0bPti87V2FXCzHGw_Y9vvcbii";
  const SESSION_KEY = "dememoria_admin_session";

  const q = (selector) => document.querySelector(selector);
  const sessionDialog = q("#clinic-session-dialog");
  const sessionState = q("#clinic-session-state");
  const sessionMessage = q("#clinic-session-message");
  const appointmentId = q("#clinic-session-appointment-id");
  const refresh = q("#clinic-refresh");
  const exerciseForm = q("#clinic-exercise-form");
  const exerciseMessage = q("#clinic-exercise-message");
  const exerciseDialog = q("#clinic-exercise-dialog");
  const patientId = q("#clinic-patient-id");
  const patientExercises = q("#clinic-patient-exercises");

  function currentSession() {
    try { return JSON.parse(sessionStorage.getItem(SESSION_KEY) || "null"); } catch { return null; }
  }

  function headers(extra = {}) {
    const current = currentSession();
    return {
      apikey: KEY,
      Authorization: `Bearer ${current?.access_token || ""}`,
      "Content-Type": "application/json",
      ...extra,
    };
  }

  async function jsonRequest(url, options = {}) {
    const response = await fetch(url, { cache: "no-store", ...options, headers: headers(options.headers || {}) });
    const body = response.status === 204 ? null : await response.json().catch(() => null);
    if (!response.ok) throw new Error(body?.message || body?.error || body?.hint || "No se ha podido completar la operación.");
    return body;
  }

  function setApprovedControlsLocked() {
    if (!sessionDialog?.open || !sessionState) return;
    const approved = sessionState.textContent?.startsWith("Registro aprobado el");
    sessionDialog.querySelectorAll("#clinic-process-markers input, #clinic-intervention-markers input, .clinic-evolution-grid select, #clinic-session-goals input")
      .forEach((control) => { control.disabled = approved; });
    [q("#clinic-add-goal"), q("#clinic-generate-draft")].forEach((button) => {
      if (button) button.disabled = approved;
    });
  }

  async function markAppointmentCompleted(id) {
    if (!id) return;
    const rows = await jsonRequest(`${REST_URL}/appointment_bookings?select=id,starts_at,patient_name,patient_email,patient_phone,patient_type,service_code,status,price_eur&id=eq.${encodeURIComponent(id)}&limit=1`);
    const appointment = rows?.[0];
    if (!appointment || appointment.status === "completed") return;
    await jsonRequest(`${REST_URL}/rpc/admin_update_appointment`, {
      method: "POST",
      body: JSON.stringify({
        p_id: appointment.id,
        p_starts_at: appointment.starts_at,
        p_patient_name: appointment.patient_name,
        p_patient_email: appointment.patient_email || null,
        p_patient_phone: appointment.patient_phone || null,
        p_patient_type: appointment.patient_type || "existing",
        p_service_code: appointment.service_code || "psicologia_general_sanitaria",
        p_status: "completed",
        p_price_eur: Number(appointment.price_eur || 60),
      }),
    });
  }

  sessionDialog?.addEventListener("close", async () => {
    setApprovedControlsLocked();
    if (sessionMessage?.textContent !== "Registro aprobado y cerrado.") return;
    try {
      await markAppointmentCompleted(appointmentId?.value || "");
      refresh?.click();
    } catch (error) {
      console.error("[clinic] No se pudo marcar la cita como realizada", error);
    }
  });

  if (sessionDialog && sessionState) {
    const observer = new MutationObserver(setApprovedControlsLocked);
    observer.observe(sessionDialog, { attributes: true, attributeFilter: ["open"] });
    observer.observe(sessionState, { childList: true, subtree: true, characterData: true });
  }

  async function sendAssignment(assignmentId) {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/send-clinical-exercise`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify({ assignment_id: assignmentId }),
    });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(body.error || "No se ha podido enviar el enlace.");
  }

  if (exerciseForm) {
    exerciseForm.addEventListener("submit", async (event) => {
      const pendingId = exerciseForm.dataset.pendingAssignmentId;
      if (!pendingId) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      exerciseMessage.textContent = "Reintentando envío…";
      try {
        await sendAssignment(pendingId);
        delete exerciseForm.dataset.pendingAssignmentId;
        exerciseMessage.textContent = "Ejercicio enviado.";
        exerciseDialog?.close();
        refresh?.click();
      } catch (error) {
        exerciseMessage.textContent = `${error instanceof Error ? error.message : "No se ha podido enviar."} El ejercicio sigue guardado y puedes volver a intentarlo sin duplicarlo.`;
      }
    }, true);

    const messageObserver = new MutationObserver(async () => {
      if (!exerciseDialog?.open) return;
      const text = exerciseMessage?.textContent || "";
      if (!text || !/no se ha podido enviar|error/i.test(text) || exerciseForm.dataset.pendingAssignmentId) return;
      const pid = patientId?.value;
      const title = q("#clinic-exercise-title")?.value.trim();
      if (!pid || !title) return;
      try {
        const rows = await jsonRequest(`${REST_URL}/clinical_exercise_assignments?select=id,title,status,created_at&patient_id=eq.${encodeURIComponent(pid)}&status=eq.prepared&title=eq.${encodeURIComponent(title)}&order=created_at.desc&limit=1`);
        if (rows?.[0]?.id) exerciseForm.dataset.pendingAssignmentId = rows[0].id;
      } catch {}
    });
    if (exerciseMessage) messageObserver.observe(exerciseMessage, { childList: true, subtree: true, characterData: true });
  }

  async function enhancePreparedExercises() {
    const pid = patientId?.value;
    if (!pid || !patientExercises) return;
    try {
      const assignments = await jsonRequest(`${REST_URL}/clinical_exercise_assignments?select=id,title,status,email_status,created_at&patient_id=eq.${encodeURIComponent(pid)}&status=eq.prepared&order=created_at.desc`);
      const rows = Array.from(patientExercises.querySelectorAll("article"));
      rows.forEach((row) => {
        if (row.querySelector("[data-resend-exercise]")) return;
        const title = row.querySelector("strong")?.textContent?.trim();
        const state = row.querySelector("span")?.textContent || "";
        if (!title || !state.includes("Preparado, sin enviar")) return;
        const assignment = assignments.find((item) => item.title === title);
        if (!assignment) return;
        const button = document.createElement("button");
        button.type = "button";
        button.className = "clinic-secondary";
        button.dataset.resendExercise = assignment.id;
        button.textContent = "Enviar ahora";
        button.addEventListener("click", async () => {
          button.disabled = true;
          button.textContent = "Enviando…";
          try {
            await sendAssignment(assignment.id);
            refresh?.click();
          } catch (error) {
            button.disabled = false;
            button.textContent = "Reintentar envío";
            const message = q("#clinic-patient-message");
            if (message) message.textContent = error instanceof Error ? error.message : "No se ha podido enviar el ejercicio.";
          }
        });
        row.append(button);
      });
    } catch (error) {
      console.error("[clinic] No se pudieron preparar acciones de reenvío", error);
    }
  }

  const exercisesObserver = patientExercises ? new MutationObserver(() => enhancePreparedExercises()) : null;
  if (patientExercises && exercisesObserver) exercisesObserver.observe(patientExercises, { childList: true, subtree: true });
})();
