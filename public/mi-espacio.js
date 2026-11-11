(() => {
  "use strict";

  // Only the installable app's internal route uses in-place authentication and app navigation.
  // The existing public Mi espacio login continues opening a separate tab.
  const insideEntreSesionesApp = window.location.pathname.startsWith("/entre-sesiones/app/espacio");
  const LEGACY_BETWEEN_KEY = "between_sessions_access_token";
  const READING_KEY = "patient_reading_preferences_v1";

  // Clinical drafts never enter localStorage: compare in-memory snapshots only.
  const materialSavedSnapshots = new WeakMap();
  // Descarta respuestas de peticiones antiguas tras cerrar sesión o cambiar de cuenta.
  // Ningún texto clínico se copia a almacenamiento persistente.
  let portalSessionEpoch = 0;
  const state = {
    storageScope: null,
    storageScopeVersion: 0,
    portalAuthenticated: false,
    portalData: null,
    guestMode: false,
    accessEmail: ""
  };

  const panels = [...document.querySelectorAll("[data-space-panel]")];
  const navButtons = [...document.querySelectorAll("[data-space-view]")];
  const accessGate = document.getElementById("space-access");
  const sessionCheck = document.getElementById("space-session-check");
  const shell = document.getElementById("space-shell");
  const emailForm = document.getElementById("space-email-form");
  const loginForm = document.getElementById("space-login-form");
  const setupForm = document.getElementById("space-set-password-form");
  const accessEmail = document.getElementById("space-access-email");
  const loginEmail = document.getElementById("space-login-email");
  const loginPassword = document.getElementById("space-login-password");
  const setupEmail = document.getElementById("space-setup-email");
  const setupPassword = document.getElementById("space-new-password");
  const confirmPassword = document.getElementById("space-confirm-password");
  const openPanelButton = document.getElementById("space-open-panel");
  const accessMessage = document.getElementById("space-access-message");
  let passwordLinkFlow = "";
  let passwordTokenHash = "";
  let linkPurpose = "setup";
  const patientMaterials = document.getElementById("space-patient-materials");
  const patientFiles = document.getElementById("space-shared-files");

  function scopedPatientKey(base) {
    return state.storageScope ? base + ":" + state.storageScope : null;
  }

  const readingSize = document.getElementById("space-reading-size");
  const readingSimple = document.getElementById("space-reading-simple");
  const readingMotion = document.getElementById("space-reading-motion");
  const readingFeedback = document.getElementById("space-reading-feedback");
  const readingPage = document.querySelector(".space-page");
  let readingSettings = { size: "normal", simple: false, quiet: false };

  function applyReadingSettings() {
    if (!readingPage) return;
    readingPage.dataset.readingSize = readingSettings.size;
    readingPage.classList.toggle("space-reading-simple", readingSettings.simple);
    readingPage.classList.toggle("space-reading-quiet", readingSettings.quiet);
    if (readingSize) readingSize.value = readingSettings.size;
    if (readingSimple) readingSimple.checked = readingSettings.simple;
    if (readingMotion) readingMotion.checked = readingSettings.quiet;
    const allowed = Boolean(state.storageScope && state.portalAuthenticated);
    for (const control of [readingSize, readingSimple, readingMotion]) if (control) control.disabled = !allowed;
  }

  function loadReadingSettings() {
    readingSettings = { size: "normal", simple: false, quiet: false };
    if (!state.storageScope) { applyReadingSettings(); return; }
    try {
      const value = JSON.parse(localStorage.getItem(scopedPatientKey(READING_KEY)) || "{}");
      if (value && typeof value === "object") {
        readingSettings.size = ["normal", "large", "extra"].includes(value.size) ? value.size : "normal";
        readingSettings.simple = value.simple === true;
        readingSettings.quiet = value.quiet === true;
      }
    } catch { /* Sin compartir ajustes entre cuentas ni salir del dispositivo. */ }
    applyReadingSettings();
  }

  function saveReadingSettings() {
    if (!state.portalAuthenticated || !state.storageScope) return;
    readingSettings = {
      size: ["normal", "large", "extra"].includes(readingSize?.value) ? readingSize.value : "normal",
      simple: Boolean(readingSimple?.checked),
      quiet: Boolean(readingMotion?.checked),
    };
    applyReadingSettings();
    try {
      localStorage.setItem(scopedPatientKey(READING_KEY), JSON.stringify(readingSettings));
      if (readingFeedback) readingFeedback.textContent = "Preferencias guardadas solo en este dispositivo.";
    } catch {
      if (readingFeedback) readingFeedback.textContent = "Se ha aplicado el ajuste, pero este navegador no permite guardarlo.";
    }
  }

  [readingSize, readingSimple, readingMotion].forEach(control => {
    control?.addEventListener("change", saveReadingSettings);
  });

  function usePatientStorageScope(scope) {
    // Preserva el aislamiento por cuenta de las preferencias de lectura.
    state.storageScope = scope || null;
    loadReadingSettings();
  }

  async function loadPatientStorageScope() {
    const revision = ++state.storageScopeVersion;
    usePatientStorageScope(null);
    try {
      const response = await fetch("/api/patient-portal/preferences", {
        credentials: "include", cache: "no-store"
      });
      if (!response.ok) return;
      const body = await response.json();
      const scope = typeof body.storage_scope === "string" && /^[a-f0-9]{24}$/.test(body.storage_scope)
        ? body.storage_scope : null;
      if (revision === state.storageScopeVersion && state.portalAuthenticated && scope) {
        usePatientStorageScope(scope);
      }
    } catch {
      // Si la identificación falla, nunca se heredan preferencias de otra cuenta.
    }
  }

  const viewSlug = Object.freeze({
    today: "panel", therapy: "terapia", account: "configuracion"
  });
  const slugView = Object.freeze({
    panel: "today", terapia: "therapy", configuracion: "account"
  });

  function currentViewFromUrl() {
    return slugView[new URLSearchParams(window.location.search).get("vista")] || "today";
  }

  function focusPatientMaterialFromHash() {
    if (!state.portalAuthenticated || currentViewFromUrl() !== "therapy") return;
    const hash = window.location.hash;
    if (!/^#space-material-[0-9a-f-]{36}$/i.test(hash)) return;
    const item = document.getElementById(hash.slice(1));
    if (!item || !patientMaterials?.contains(item)) return;
    item.open = true;
    const heading = item.querySelector("summary");
    if (heading) {
      heading.setAttribute("tabindex", "-1");
      heading.focus({ preventScroll: true });
    }
    item.scrollIntoView({ block: "start", behavior: "auto" });
  }

  function snapshotPatientMaterial(details) {
    return JSON.stringify([...details.querySelectorAll("[data-response-record],[data-response-answer],[data-neuro-answer],[data-form-answer]")]
      .map(field => String(field.value || "")));
  }

  function patientMaterialHasUnsavedChanges() {
    if (!state.portalAuthenticated || !patientMaterials) return false;
    return [...patientMaterials.querySelectorAll(".space-patient-material")].some(details => {
      const baseline = materialSavedSnapshots.get(details);
      return baseline !== undefined && snapshotPatientMaterial(details) !== baseline;
    });
  }

  function sessionPreparationHasUnsavedNotes() {
    if (!state.portalAuthenticated) return false;
    return ["space-prep-difficult", "space-prep-helped", "space-prep-talk"].some(id =>
      Boolean(document.getElementById(id)?.value?.trim())
    );
  }

  function showView(name) {
    if (!panels.some(panel => panel.dataset.spacePanel === name)) name = "today";
    panels.forEach(panel => {
      panel.hidden = panel.dataset.spacePanel !== name;
    });
    navButtons.forEach(button => {
      const active = button.dataset.spaceView === name;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    if (insideEntreSesionesApp) {
      const destination = viewSlug[name] || "";
      document.querySelectorAll(".esapp-bottom-nav a").forEach(link => {
        const active = destination && new URL(link.href, window.location.origin).searchParams.get("vista") === destination;
        if (active) link.setAttribute("aria-current", "page");
        else link.removeAttribute("aria-current");
      });
    }
    if (name === "therapy" && window.location.hash.startsWith("#space-material-")) {
      focusPatientMaterialFromHash();
      return;
    }
    window.scrollTo({ top: 0, behavior: readingSettings.quiet ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  }

  // PWA-only navigation: reuse the authenticated portal, keep in-progress
  // therapy form fields in the DOM, and allow Android Back to restore a tab.
  function navigateToView(name) {
    if (!state.portalAuthenticated || !Object.prototype.hasOwnProperty.call(viewSlug, name)) return;
    if (insideEntreSesionesApp) {
      const nextSlug = viewSlug[name];
      const url = new URL(window.location.href);
      const current = url.pathname + url.search + url.hash;
      url.searchParams.set("vista", nextSlug);
      url.hash = ""; // La actividad previa no debe enfocar otra sección.
      const destination = url.pathname + url.search + url.hash;
      if (destination !== current) {
        window.history.pushState({ entreSesionesTab: name }, "", destination);
      }
    }
    showView(name);
  }

  function setAccessMessage(message, isError = false) {
    if (!accessMessage) return;
    accessMessage.textContent = message || "";
    accessMessage.classList.toggle("is-error", Boolean(isError));
  }

  function showAccessForm(which) {
    if (loginForm) loginForm.hidden = which !== "login";
    if (emailForm) emailForm.hidden = which !== "email";
    if (setupForm) setupForm.hidden = which !== "setup";
    if (openPanelButton) openPanelButton.hidden = true;
    setAccessMessage("");
    if (which === "login") loginEmail?.focus();
    if (which === "email") accessEmail?.focus();
    if (which === "setup") setupEmail?.focus();
  }

  function showAccessGate(checking = false) {
    portalSessionEpoch++;
    // El contenido clínico debe salir también del DOM, no solo quedar oculto.
    // Así no puede reutilizarse al cambiar de paciente en el mismo navegador.
    state.portalAuthenticated = false;
    state.portalData = null;
    state.storageScopeVersion++;
    usePatientStorageScope(null);
    patientMaterials?.replaceChildren();
    patientFiles?.replaceChildren();
    const quickCount = document.getElementById("space-quick-material-count");
    if (quickCount) quickCount.textContent = "Inicia sesión para ver los materiales de tu cuenta.";
    const privateCount = document.getElementById("space-material-count");
    if (privateCount) privateCount.textContent = "Acceso privado";
    document.dispatchEvent(new Event("patient-portal-locked"));
    if (insideEntreSesionesApp) {
      const tabs = document.querySelector(".esapp-bottom-nav");
      if (tabs) tabs.hidden = true;
    }
    if (readingPage) readingPage.dataset.portalPhase = checking ? "checking" : "signed-out";
    if (sessionCheck) sessionCheck.hidden = !checking;
    if (accessGate) accessGate.hidden = checking;
    if (shell) shell.hidden = true;
    if (!checking && !passwordTokenHash) showAccessForm("login");
  }

  function openPortal(view = "today") {
    if (readingPage) readingPage.dataset.portalPhase = "authenticated";
    if (sessionCheck) sessionCheck.hidden = true;
    if (accessGate) accessGate.hidden = true;
    if (shell) shell.hidden = false;
    if (insideEntreSesionesApp && state.portalAuthenticated) {
      const tabs = document.querySelector(".esapp-bottom-nav");
      if (tabs) tabs.hidden = false;
    }
    showView(view);
  }

  function appointmentText(appointment) {
    if (!appointment?.starts_at) return null;
    try {
      const date = new Date(appointment.starts_at);
      const formatted = new Intl.DateTimeFormat("es-ES", {
        weekday: "long",
        day: "numeric",
        month: "long",
        hour: "2-digit",
        minute: "2-digit"
      }).format(date);
      return formatted.charAt(0).toUpperCase() + formatted.slice(1);
    } catch {
      return null;
    }
  }

  function materialTypeLabel(document) {
    return document?.material_type === "psychoeducation" ? "Psicoeducación" : "Ejercicio";
  }

  function appendPatientSection(target, title, value) {
    const text = String(value || "").trim();
    if (!text) return;
    const section = document.createElement("section");
    section.className = "space-patient-section";
    const heading = document.createElement("h4");
    heading.textContent = title;
    const copy = document.createElement("p");
    copy.textContent = text;
    section.append(heading, copy);
    target.append(section);
  }

  // A workbook is one collapsible item, with independently collapsible
  // reading and exercise sections. All content stays in the private portal.
  function createWorkbookPart(title, description, open = false) {
    const section = document.createElement("details");
    section.className = "space-workbook-part";
    section.open = open;
    const summary = document.createElement("summary");
    const text = document.createElement("span");
    text.className = "space-workbook-part-heading";
    const name = document.createElement("strong");
    name.textContent = title;
    const hint = document.createElement("small");
    hint.textContent = description;
    text.append(name, hint);
    const arrow = document.createElement("span");
    arrow.className = "space-workbook-part-chevron";
    arrow.setAttribute("aria-hidden", "true");
    arrow.textContent = "⌄";
    summary.append(text, arrow);
    const content = document.createElement("div");
    content.className = "space-workbook-part-body";
    section.append(summary, content);
    return { section, content };
  }

  function patientResponseData(item, questionCount) {
    const source = item?.patient_response && typeof item.patient_response === "object" ? item.patient_response : {};
    const answers = Array.isArray(source.answers) ? source.answers : [];
    return {
      record: String(source.record || ""),
      answers: Array.from({ length: questionCount }, (_, index) => String(answers[index] || ""))
    };
  }

  async function savePatientMaterialResponse(item, form, action, status) {
    const responseEpoch = portalSessionEpoch;
    if (!state.portalAuthenticated) return;
    const details = form.closest(".space-patient-material");
    const submittedSnapshot = details ? snapshotPatientMaterial(details) : "";
    const button = form.querySelector(`button[value="${action}"]`);
    const buttons = [...form.querySelectorAll("button")];
    buttons.forEach((node) => { node.disabled = true; });
    if (status) status.textContent = action === "share" ? "Compartiendo…" : "Guardando…";
    try {
      const record = form.querySelector("[data-response-record]")?.value || "";
      const neuroAnswers=[...form.closest(".space-patient-material-body").querySelectorAll("[data-neuro-answer]")].map(field=>field.value.slice(0,3000));
      const answers = [...form.querySelectorAll("[data-response-answer]")].map((field) => field.value || "");
      const formAnswers = Object.fromEntries([...form.querySelectorAll("[data-form-answer]")]
        .map(field => [field.dataset.formAnswer, String(field.value || "")]));
      const response = await fetch("/api/patient-portal/response", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ material_id: item.id, action, record, answers, form_answers: formAnswers, ...(neuroAnswers.length ? { neuro_answers: neuroAnswers } : {}) })
      });
      const body = await response.json().catch(() => ({}));
      if (responseEpoch !== portalSessionEpoch || !state.portalAuthenticated || !details?.isConnected) return;
      if (response.status === 401) {
        state.portalAuthenticated = false;
        state.portalData = null;
        showAccessGate();
        setAccessMessage("Tu sesión ha caducado. Solicita un nuevo enlace.", true);
        return;
      }
      if (!response.ok) throw new Error(body.error || "No se ha podido guardar.");
      item.patient_response = { version: Object.keys(formAnswers).length ? 3 : neuroAnswers.length ? 2 : 1, record, answers, form_answers: formAnswers, ...(neuroAnswers.length ? { neuro_answers: neuroAnswers } : {}) };
      item.patient_response_status = body.status;
      item.patient_response_updated_at = body.saved_at;
      item.patient_response_shared_at = body.status === "shared" ? body.saved_at : null;
      if (details) materialSavedSnapshots.set(details, submittedSnapshot);
      const editedAgain = details && snapshotPatientMaterial(details) !== submittedSnapshot;
      if (status) {
        status.classList.toggle("shared", body.status === "shared");
        status.textContent = editedAgain
          ? "Se ha guardado la versión anterior. Hay cambios nuevos SIN guardar."
          : body.status === "shared"
            ? "Respuestas compartidas con Carolina."
            : "Borrador guardado. Carolina todavía no ve estas respuestas.";
      }
    } catch (error) {
      if (responseEpoch === portalSessionEpoch && state.portalAuthenticated && details?.isConnected && status) {
        status.textContent = error?.message || "No se ha podido guardar.";
      }
    } finally {
      // Si falló un cierre de sesión, el formulario sigue perteneciendo a esta
      // pantalla: debe poder reintentarse sin mostrar «guardado» por error.
      if (state.portalAuthenticated && details?.isConnected && patientMaterials?.contains(details)) {
        buttons.forEach((node) => { node.disabled = false; });
        if (button) button.blur();
      }
    }
  }


  // Guide is attached to an existing exercise response; no clinical data in localStorage.
  function createGuidedRecord(recordField) {
    const panel = document.createElement("details");
    panel.className = "space-guided-record";
    const summary = document.createElement("summary");
    summary.textContent = "Hacer un autorregistro paso a paso";
    const description = document.createElement("p");
    description.textContent = "Contesta solo lo que quieras. Después añade el texto al ejercicio y guárdalo.";
    const prompts = [
      ["Situación", "¿Qué ocurrió?"],
      ["Pensamientos", "¿Qué pasó por tu mente?"],
      ["Emociones", "¿Qué sentiste?"],
      ["Sensaciones", "¿Qué notaste en tu cuerpo?"],
      ["Respuesta", "¿Qué hiciste o evitaste hacer?"],
      ["Reflexión", "¿Qué te gustaría recordar o probar?"]
    ];
    const fields = document.createElement("div");
    fields.className = "space-guided-fields";
    const inputs = prompts.map(([title, hint]) => {
      const label = document.createElement("label");
      label.className = "space-guided-field";
      const name = document.createElement("strong");
      name.textContent = title;
      const help = document.createElement("span");
      help.textContent = hint;
      const input = document.createElement("textarea");
      input.maxLength = 1800;
      input.rows = 2;
      label.append(name, help, input);
      fields.append(label);
      return { title, input };
    });
    const actions = document.createElement("div");
    actions.className = "space-guided-actions";
    const add = document.createElement("button");
    add.type = "button";
    add.className = "space-secondary";
    add.textContent = "Añadir a mi ejercicio";
    const status = document.createElement("span");
    status.className = "space-small";
    status.setAttribute("role", "status");
    add.addEventListener("click", () => {
      const answered = inputs.filter(({ input }) => input.value.trim());
      if (!answered.length) { status.textContent = "Escribe al menos una respuesta."; return; }
      const text = ["AUTORREGISTRO", ...answered.map(({ title, input }) => title + ":\n" + input.value.trim())].join("\n\n");
      const next = [recordField.value.trim(), text].filter(Boolean).join("\n\n────────\n\n");
      if (next.length > 12000) { status.textContent = "El ejercicio ha alcanzado su longitud máxima."; return; }
      recordField.value = next;
      inputs.forEach(({ input }) => { input.value = ""; });
      status.textContent = "Añadido al ejercicio. Pulsa Guardar borrador para conservarlo.";
      recordField.focus();
    });
    actions.append(add, status);
    panel.append(summary, description, fields, actions);
    return panel;
  }

  function appendMaterialExamples(parent, value) {
    if (!value) return;
    for (const line of String(value).split(/\r?\n/)) {
      if (!line.trim().startsWith("Esquema:")) {
        appendPatientSection(parent, "", line);
        continue;
      }
      const labels = line.trim().slice(8).split("→").map((label) => label.trim()).filter(Boolean).slice(0, 5);
      if (labels.length < 3) { appendPatientSection(parent, "Ejemplo", line); continue; }
      const ns = "http://www.w3.org/2000/svg";
      const svg = document.createElementNS(ns, "svg");
      svg.setAttribute("viewBox", `0 0 360 ${labels.length * 100 - 20}`);
      svg.setAttribute("role", "img");
      svg.setAttribute("aria-label", labels.join(" → "));
      svg.style.cssText = "width:100%;max-width:360px;height:auto;display:block;margin:16px auto";
      labels.forEach((label, index) => {
        const rect = document.createElementNS(ns, "rect");
        for (const [key, value] of Object.entries({x:10,y:index*100+5,width:340,height:65,rx:12,fill:index%2 ? "#EAF6FB" : "#d8f3ef"})) rect.setAttribute(key, String(value));
        svg.append(rect);
        const words = label.slice(0, 90).split(" ");
        const lines = [""];
        for (const word of words) { if ((lines[lines.length-1] + " " + word).trim().length > 34) lines.push(word); else lines[lines.length-1] = (lines[lines.length-1] + " " + word).trim(); }
        lines.slice(0, 3).forEach((line, offset) => {
          const text = document.createElementNS(ns, "text");
          text.setAttribute("x", "180"); text.setAttribute("y", String(index*100+30+offset*18));
          text.setAttribute("text-anchor", "middle"); text.setAttribute("fill", "#173A5E"); text.setAttribute("font-size", "16");
          text.textContent = line; svg.append(text);
        });
        if (index < labels.length-1) {
          const arrow = document.createElementNS(ns, "path");
          arrow.setAttribute("d", `M180 ${index*100+75} v20 m-6 -6 l6 6 6 -6`);
          arrow.setAttribute("fill", "none"); arrow.setAttribute("stroke", "#08A6A0"); arrow.setAttribute("stroke-width", "3"); svg.append(arrow);
        }
      });
      parent.append(svg);
    }
  }


  // Los PDF se descargan mediante un enlace HTTPS autenticado. El servidor
  // verifica cada solicitud y responde con Content-Disposition: attachment.
  // Evita URL.createObjectURL y los clics sintéticos, que fallan en algunos
  // navegadores móviles y aplicaciones instaladas.
  function patientMaterialDownloadUrl(item) {
    return "/api/patient-portal/material-pdf?material_id=" + encodeURIComponent(item.id);
  }

  // El cuaderno se presenta a quien lo realiza; no se envían al navegador las soluciones.
  function appendNeuroWorkbook(container, doc, item) {
    const chunks=String(doc.instructions||"").split(/(?:^|\n)\s*(Ejercicio\s+\d+\s*:[^\n]*)\n/gi);
    if(chunks.length<3)return false;
    const saved=Array.isArray(item?.patient_response?.neuro_answers)?item.patient_response.neuro_answers:[];
    const visuals=Array.isArray(doc.visual_blocks)?doc.visual_blocks:[];
    const wrap=document.createElement("section");
    wrap.className="space-neuro-workbook";
    const intro=document.createElement("p");
    intro.className="space-neuro-workbook-intro";
    intro.textContent="Tus actividades de esta semana. Cada ejercicio tiene su material y un espacio para responder. Puedes guardar un borrador y continuar otro día.";
    wrap.append(intro);
    function visualInto(target,resource) {
      if(!resource||!resource.type)return;
      const panel=document.createElement("div");
      panel.className="space-neuro-visual";
      const h=document.createElement("h6");h.textContent=String(resource.title||"Material para observar").replace(/^Ejercicio \d+\s*·\s*/,"");
      panel.append(h);
      const values=String(resource.content||"").split(/\r?\n/).map(row=>row.trim()).filter(Boolean).slice(0,13);
      if(resource.type==="table"||resource.type==="calendar"){
        let rows=resource.type==="table"?values.map(row=>row.split("|").map(cell=>cell.trim().slice(0,110))):[];
        if(resource.type==="calendar"){
          const m=/^(\d{4})-(\d{2})$/.exec(values[0]||"");
          if(m){
            const year=Number(m[1]),month=Number(m[2]),days=new Date(Date.UTC(year,month,0)).getUTCDate();
            const offset=(new Date(Date.UTC(year,month-1,1)).getUTCDay()+6)%7;
            const events=new Map(values.slice(1).map(x=>x.split("|")).filter(x=>Number.isInteger(Number(x[0]))).map(x=>[Number(x[0]),x.slice(1).join("|")]));
            rows=[["L","M","X","J","V","S","D"]];
            for(let n=0;n<Math.ceil((offset+days)/7);n++){
              rows.push(Array.from({length:7},(_,i)=>{
                const day=n*7+i-offset+1;
                return day<1||day>days?"":String(day)+(events.has(day)?" · "+String(events.get(day)).slice(0,25):"");
              }));
            }
          }
        }
        const width=rows[0]?.length||0;
        if(rows.length>=2&&width>=2&&width<=7&&rows.every(row=>row.length===width)){
          const scrolling=document.createElement("div");scrolling.className="space-neuro-table-scroll";
          const table=document.createElement("table");
          rows.forEach((row,i)=>{const tr=document.createElement("tr");row.forEach(value=>{const cell=document.createElement(i===0?"th":"td");cell.textContent=value;tr.append(cell);});table.append(tr);});
          scrolling.append(table);panel.append(scrolling);
        }
      }else if(resource.type==="diagram"){
        const list=document.createElement("ol");list.className="space-neuro-diagram";
        values.slice(0,8).forEach(line=>{const li=document.createElement("li");li.textContent=line;list.append(li);});
        panel.append(list);
      }else if(resource.type==="chart"){
        const pairs=values.map(v=>v.split("|")).filter(row=>row.length===2&&Number.isFinite(Number(row[1]))&&Number(row[1])>=0).slice(0,8);
        const highest=Math.max(1,...pairs.map(p=>Number(p[1])));
        pairs.forEach(([name,n])=>{const row=document.createElement("div");row.className="space-neuro-chart-row";
          const caption=document.createElement("span");caption.textContent=name;
          const track=document.createElement("div");track.className="space-neuro-chart-track";
          const bar=document.createElement("i");bar.style.width=Math.min(100,Math.round(Number(n)/highest*100))+"%";track.append(bar);
          const count=document.createElement("strong");count.textContent=n;row.append(caption,track,count);panel.append(row);
        });
      }else if(resource.type==="image"&&/^data:image\/(?:png|jpeg);base64,[A-Za-z0-9+/=]+$/.test(String(resource.data||""))&&String(resource.data).length<=650000){
        const img=document.createElement("img");img.src=resource.data;img.alt=String(resource.alt||"Material visual");img.loading="lazy";img.className="space-neuro-image";panel.append(img);
      }
      if(panel.children.length>1)target.append(panel);
    }
    for(let i=1;i+1<chunks.length;i+=2){
      const title=chunks[i],number=Number(/Ejercicio\s+(\d+)/i.exec(title)?.[1]||0);
      if(!number||number>14)continue;
      const card=document.createElement("article");
      card.className="space-neuro-task";
      const heading=document.createElement("h5");heading.textContent=title.replace(/^Ejercicio\s+\d+\s*:\s*/i,"Ejercicio "+number+" · ");card.append(heading);
      for(const line of chunks[i+1].split(/\r?\n/)){
        const pair=/^(Consigna|Material|Cómo responder):\s*(.*)$/i.exec(line.trim());
        if(!pair)continue;
        if(pair[1]==="Material")continue;
        const block=document.createElement("div");block.className="space-neuro-task-instruction";
        const strong=document.createElement("strong");strong.textContent=pair[1];
        const p=document.createElement("p");p.textContent=pair[2];block.append(strong,p);card.append(block);
      }
      const visual=visuals.find(x=>x?.title?.startsWith("Ejercicio "+number+" ·"));
      visualInto(card,visual);
      const answerLabel=document.createElement("label");answerLabel.className="space-neuro-task-answer";
      const caption=document.createElement("strong");caption.textContent="Tu respuesta · Ejercicio "+number;
      const textarea=document.createElement("textarea");textarea.rows=4;textarea.maxLength=3000;textarea.dataset.neuroAnswer=String(number-1);textarea.placeholder="Escribe aquí tu respuesta, pasos o dudas…";
      textarea.value=String(saved[number-1]||"").slice(0,3000);
      answerLabel.append(caption,textarea);card.append(answerLabel);
      wrap.append(card);
    }
    if(!wrap.querySelector("textarea[data-neuro-answer]"))return false;
    container.append(wrap);
    return true;
  }


  // The complete PDF stays in private storage. The embedded reader requests it
  // directly from the authenticated, patient-scoped endpoint, never a public URL.
  function appendCompletePdfToForm(form, sourceFile) {
    const sourceId = String(sourceFile?.id || "");
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(sourceId)) return;
    const url = "/api/patient-portal/file?id=" + encodeURIComponent(sourceId);
    const section = document.createElement("section");
    section.className = "space-pdf-form-document";
    const heading = document.createElement("h5");
    heading.textContent = "Contenido completo del documento";
    const lead = document.createElement("p");
    lead.textContent = "Lee aquí todas las explicaciones, técnicas, ejemplos y consignas del PDF original. Después encontrarás los espacios para responder. El documento conserva sus páginas y su contenido íntegro.";
    // Render every page to first-party canvases. Browser-native PDF iframes do
    // not work reliably on Android and must never be the only reading path.
    const reader = document.createElement("div");
    reader.className = "space-pdf-form-reader";
    reader.dataset.pdfUrl = url;
    reader.setAttribute("role", "group");
    reader.setAttribute("aria-label", "Todas las páginas del PDF original");
    const loading = document.createElement("p");
    loading.className = "space-pdf-form-loading";
    loading.setAttribute("role", "status");
    loading.textContent = "Cargando las páginas completas del documento…";
    reader.append(loading);
    const fallback = document.createElement("p");
    fallback.className = "space-pdf-form-fallback";
    fallback.textContent = "Si el visor integrado no funciona en tu móvil, puedes abrir el documento original sin perder las respuestas de esta página.";
    const open = document.createElement("a");
    open.href = url;
    open.target = "_blank";
    open.rel = "noopener noreferrer";
    open.className = "space-secondary";
    open.textContent = "Abrir documento completo en otra pestaña";
    section.append(heading, lead, reader, fallback, open);
    form.append(section);
  }

  // Native inline reader, protected by the same patient session as the file.
  // No external PDF script or missing vendored dependency is needed. The
  // patient has an explicit link to the same private PDF if their mobile
  // browser does not support embedded PDF viewing.
  const renderedPdfHosts = new WeakSet();
  async function renderCompletePdfPages(host) {
    if (!host || renderedPdfHosts.has(host) || !state.portalAuthenticated) return;
    const url = host.dataset.pdfUrl || "";
    if (!/^\/api\/patient-portal\/file\?id=[0-9a-f-]{36}$/i.test(url)) return;
    renderedPdfHosts.add(host);
    const reader = document.createElement("iframe");
    reader.className = "space-pdf-form-frame";
    reader.title = "Documento terapéutico original completo";
    reader.loading = "lazy";
    reader.referrerPolicy = "no-referrer";
    reader.src = url;
    reader.setAttribute("aria-label", "PDF original completo en visor privado");
    host.replaceChildren(reader);
  }

  // Each objective can define its own questions, without replicating the PDF.
  function appendInteractiveQuestions(form, item, doc) {
    const definitions = Array.isArray(doc.form_fields) ? doc.form_fields.slice(0, 30) : [];
    const previous = item?.patient_response?.form_answers && typeof item.patient_response.form_answers === "object"
      ? item.patient_response.form_answers : {};
    const validTypes = new Set(["short_text", "long_text", "scale_0_10", "date", "yes_no", "choice"]);
    const seen = new Set();
    const section = document.createElement("section");
    section.className = "space-interactive-fields";
    const title = document.createElement("h5");
    title.textContent = "Preguntas y registros de este objetivo";
    section.append(title);
    for (const def of definitions) {
      if (!def || !/^[A-Za-z0-9_-]{1,50}$/.test(String(def.id || "")) ||
          !validTypes.has(def.type) || !String(def.label || "").trim() || seen.has(def.id)) continue;
      seen.add(def.id);
      const label = document.createElement("label");
      label.className = "space-interactive-field";
      const question = document.createElement("strong");
      question.textContent = String(def.label).slice(0, 200);
      label.append(question);
      if (def.help) {
        const help = document.createElement("span");
        help.className = "space-interactive-help";
        help.textContent = String(def.help).slice(0, 500);
        label.append(help);
      }
      let control;
      if (def.type === "long_text") {
        control = document.createElement("textarea");
        control.rows = 4;
        control.maxLength = 5000;
      } else if (["scale_0_10", "yes_no", "choice"].includes(def.type)) {
        control = document.createElement("select");
        const choices = [["", "Sin responder"]];
        if (def.type === "scale_0_10") for (let i = 0; i <= 10; i++) choices.push([String(i), String(i)]);
        if (def.type === "yes_no") choices.push(["si", "Sí"], ["no", "No"], ["no_aplica", "No aplica"]);
        if (def.type === "choice" && Array.isArray(def.options)) {
          for (const option of def.options.slice(0, 12)) if (typeof option === "string") choices.push([option.slice(0, 100), option.slice(0, 100)]);
        }
        for (const [value, text] of choices) {
          const opt = document.createElement("option");
          opt.value = value;
          opt.textContent = text;
          control.append(opt);
        }
      } else {
        control = document.createElement("input");
        control.type = def.type === "date" ? "date" : "text";
        if (def.type !== "date") control.maxLength = 500;
      }
      control.dataset.formAnswer = def.id;
      control.value = String(Object.prototype.hasOwnProperty.call(previous, def.id) ? previous[def.id] : "");
      label.append(control);
      section.append(label);
    }
    if (seen.size) form.append(section);
  }

  function createPatientMaterial(item, index) {
    const documentData = item?.patient_document && typeof item.patient_document === "object" ? item.patient_document : {};
    const details = document.createElement("details");
    details.className = "space-patient-material";
    details.dataset.patientMaterialId = String(item.id || "");
    if (/^[0-9a-f-]{36}$/i.test(String(item.id || ""))) {
      details.id = "space-material-" + item.id;
    }
    // Workbooks start collapsed. Opening one never activates another patient's content.

    const summary = document.createElement("summary");
    const titleWrap = document.createElement("div");
    titleWrap.className = "space-patient-material-title";
    const title = document.createElement("strong");
    title.textContent = item.title || "Material";
    const meta = document.createElement("span");
    meta.textContent = materialTypeLabel(documentData) + (item.status === "reviewed" ? " · revisado" : "");
    titleWrap.append(title, meta);
    const chevron = document.createElement("span");
    chevron.className = "space-patient-material-chevron";
    chevron.textContent = "⌄";
    summary.append(titleWrap, chevron);

    const body = document.createElement("div");
    body.className = "space-patient-material-body";
    // Source-linked forms show the ENTIRE original PDF as the primary clinical
    // text. Generic form scaffolding must never replace or paraphrase it.
    const sourceId = String(documentData.source_document_id || "");
    const sourceFile = /^[0-9a-f-]{36}$/i.test(sourceId)
      ? (Array.isArray(state.portalData?.files) ? state.portalData.files : [])
          .find(file => file.id === sourceId && file.mime_type === "application/pdf")
      : null;
    let techniquesPart = null;
    let neuroTaskContainer = null;
    if (!sourceFile) {
      const reading = createWorkbookPart("Psicoeducación", "Explicaciones y objetivos del material");
      appendPatientSection(reading.content, "Para qué sirve", documentData.introduction);
      appendPatientSection(reading.content,
        documentData.clinical_area === "neuropsychology" ? "Para qué sirven estas actividades" : "Comprender lo que te pasa",
        documentData.why);
      if (reading.content.childNodes.length) body.append(reading.section);

      techniquesPart = createWorkbookPart("Técnicas y ejemplos", "Instrucciones, pautas y material de apoyo");
      appendPatientSection(techniquesPart.content, "Plan de práctica", documentData.frequency);
      if (documentData.clinical_area === "neuropsychology") {
        neuroTaskContainer = document.createElement("div");
        if (!appendNeuroWorkbook(neuroTaskContainer, documentData, item)) {
          appendPatientSection(techniquesPart.content,
            documentData.material_type === "psychoeducation" ? "Contenido" : "Cómo hacerlo",
            documentData.instructions);
          neuroTaskContainer = null;
        }
      } else {
        appendPatientSection(techniquesPart.content,
          documentData.material_type === "psychoeducation" ? "Contenido" : "Cómo hacerlo",
          documentData.instructions);
      }
      appendMaterialExamples(techniquesPart.content, documentData.example);
      appendPatientSection(techniquesPart.content, "Qué conviene recordar", documentData.remember);
      if (techniquesPart.content.childNodes.length) body.append(techniquesPart.section);
    }
    const downloadArea = document.createElement("div");
    downloadArea.className = "space-patient-downloads";
    const downloadLink = document.createElement("a");
    downloadLink.className = "space-secondary space-material-download-button";
    downloadLink.textContent = sourceFile ? "↓ Descargar PDF original completo" : "↓ Descargar PDF";
    if (sourceFile) {
      downloadLink.href = "/api/patient-portal/file?id=" + encodeURIComponent(sourceId) + "&download=1";
      downloadLink.download = "documento-original.pdf";
    } else {
      downloadLink.href = patientMaterialDownloadUrl(item);
      // Content-Disposition on the authenticated endpoint supplies the filename.
      downloadLink.download = "entre-sesiones.pdf";
    }
    downloadLink.setAttribute("aria-label", "Descargar PDF: " + String(item.title || "Material"));
    const downloadHint = document.createElement("span");
    downloadHint.className = "space-material-download-status";
    downloadHint.textContent = sourceFile
      ? "Este es el documento original íntegro, no un resumen del formulario."
      : "El PDF se descarga desde el servidor. Si tu móvil no lo permite, utiliza la opción de imprimir y elige «Guardar como PDF».";
    const printButton = document.createElement("button");
    printButton.type = "button";
    printButton.className = "space-secondary space-material-print-button";
    printButton.textContent = "Imprimir / Guardar como PDF";
    printButton.setAttribute("aria-label", "Imprimir o guardar como PDF: " + String(item.title || "Material"));
    let openingPrintDialog = false;
    printButton.addEventListener("click", () => {
      if (!state.portalAuthenticated || !details.isConnected || !patientMaterials?.contains(details) || openingPrintDialog) return;
      // Algunos navegadores y pruebas móviles repiten el evento click.
      // Evitamos abrir dos cuadros de impresión por una sola pulsación.
      openingPrintDialog = true;
      window.setTimeout(() => { openingPrintDialog = false; }, 1400);
      // La persona realiza la acción; no se almacenan nuevas respuestas ni se envían a otro servicio.
      document.querySelectorAll(".space-patient-material[data-print-material]").forEach(node => {
        node.removeAttribute("data-print-material");
      });
      details.setAttribute("data-print-material", "true");
      details.open = true;
      document.body.classList.add("space-print-patient-material");
      // Closed reading sections must be printed too; restore the person's
      // previous accordion state after the browser closes its print dialog.
      const parts = [...details.querySelectorAll("details.space-workbook-part")];
      const expandedBeforePrint = parts.map(part => part.open);
      parts.forEach(part => { part.open = true; });
      const restoreParts = () => {
        parts.forEach((part, index) => { part.open = expandedBeforePrint[index]; });
      };
      window.addEventListener("afterprint", restoreParts, { once: true });
      try {
        window.print();
        downloadHint.textContent = "En Android, elige «Guardar como PDF» en las opciones de impresión. Si no aparece, abre esta página en Chrome.";
      } catch {
        downloadHint.textContent = "El navegador no admite impresión desde la aplicación. Prueba a abrir Entre Sesiones en Chrome.";
      }
    });
    // Printing the web form does not reliably print embedded PDF pages.
    // For original-PDF forms, offer the actual full PDF download instead.
    if (sourceFile) downloadArea.append(downloadLink, downloadHint);
    else downloadArea.append(downloadLink, printButton, downloadHint);
    // The original file link moves into the reading accordion below.
    if (!sourceFile && techniquesPart) {
      techniquesPart.content.append(downloadArea);
      if (!body.contains(techniquesPart.section)) body.append(techniquesPart.section);
    } else if (!sourceFile) body.append(downloadArea);


    if (sourceFile || documentData.material_type !== "psychoeducation" || documentData.record_prompt) {
      const questions = Array.isArray(documentData.session_questions) && documentData.session_questions.length
        ? documentData.session_questions.slice(0, 6)
        : sourceFile ? [] : ["¿Qué te resultó más fácil o más difícil?", "¿Qué observaste al probarlo?", "¿Qué ajustarías para que te resulte más útil?"];
      const saved = patientResponseData(item, questions.length);
      const responseBox = document.createElement("div");
      responseBox.className = "space-patient-response";
      const heading = document.createElement("h4");
      heading.textContent = sourceFile ? "Material completo y respuestas" : "Rellena el ejercicio aquí";
      const explainer = document.createElement("p");
      explainer.textContent = sourceFile
        ? "Primero encontrarás todo el contenido del PDF, sin recortes. Después puedes responder aquí mismo, guardar un borrador y compartirlo con Carolina cuando lo decidas."
        : documentData.clinical_area==="neuropsychology"
        ? "Escribe en los espacios de cada ejercicio. Guarda un borrador para continuar otro día; Carolina solo verá las respuestas cuando decidas compartirlas."
        : "Puedes escribir o utilizar el autorregistro guiado. Solo se comparte con Carolina si pulsas «Compartir respuestas».";
      const form = document.createElement("form");
      let answerTarget = form;
      let exerciseSection = null;
      let exerciseContent = null;
      if (sourceFile) {
        const workspace = document.createElement("div");
        workspace.className = "space-fillable-workspace";

        // Never assume which PDF pages correspond to psychoeducation or
        // exercises: the entire unmodified original stays in the reading part.
        const readingPart = createWorkbookPart("Leer el cuaderno completo",
          "Psicoeducación, técnicas, ejemplos y consignas originales");
        readingPart.section.classList.add("space-workbook-part-reading");
        appendCompletePdfToForm(readingPart.content, sourceFile);
        readingPart.content.append(downloadArea);
        workspace.append(readingPart.section);

        const answerPart = createWorkbookPart("Ejercicios y respuestas",
          item.patient_response_status === "shared" ? "Respuestas compartidas" :
          item.patient_response_status === "draft" ? "Borrador guardado" : "Formulario para completar");
        answerPart.content.classList.add("space-fillable-answer-panel");
        const panelHeading = document.createElement("h5");
        panelHeading.textContent = "Mis respuestas";
        answerPart.content.append(panelHeading);
        workspace.append(answerPart.section);

        form.append(workspace);
        answerTarget = answerPart.content;
      } else {
        const answerPart = createWorkbookPart("Ejercicios y respuestas",
          item.patient_response_status === "shared" ? "Respuestas compartidas" :
          item.patient_response_status === "draft" ? "Borrador guardado" : "Formulario para completar");
        exerciseSection = answerPart.section;
        exerciseContent = answerPart.content;
        answerTarget = form;
        if (neuroTaskContainer) answerTarget.append(neuroTaskContainer);
      }

      const recordLabel = document.createElement("label");
      recordLabel.textContent = sourceFile
        ? (Array.isArray(documentData.form_fields) && documentData.form_fields.length
          ? "Notas o dudas adicionales (opcional)"
          : "Escribe las respuestas a las actividades del PDF")
        : documentData.clinical_area==="neuropsychology" ? "Notas generales y dudas del cuaderno"
        : (documentData.record_prompt || "Mis notas y autorregistros");
      const record = document.createElement("textarea");
      record.dataset.responseRecord = "true";
      record.maxLength = 12000;
      record.value = saved.record;
      record.placeholder = "Escribe aquí…";
      recordLabel.append(record);
      if (sourceFile) {
        appendInteractiveQuestions(answerTarget, item, documentData);
        answerTarget.append(recordLabel);
      } else {
        if(documentData.clinical_area!=="neuropsychology")form.append(createGuidedRecord(record));
        form.append(recordLabel);
        appendInteractiveQuestions(form, item, documentData);
      }

      questions.forEach((question, questionIndex) => {
        const label = document.createElement("label");
        label.textContent = String(question);
        const field = document.createElement("textarea");
        field.dataset.responseAnswer = String(questionIndex);
        field.maxLength = 6000;
        field.value = saved.answers[questionIndex] || "";
        field.placeholder = "Tu respuesta…";
        label.append(field);
        answerTarget.append(label);
      });

      const actions = document.createElement("div");
      actions.className = "space-patient-response-actions";
      const draft = document.createElement("button");
      draft.className = "space-secondary";
      draft.type = "button";
      draft.value = "draft";
      draft.textContent = "Guardar borrador";
      const share = document.createElement("button");
      share.className = "space-primary";
      share.type = "button";
      share.value = "share";
      share.textContent = "Compartir respuestas con Carolina";
      actions.append(draft, share);

      const responseStatus = document.createElement("div");
      responseStatus.className = "space-patient-response-status";
      responseStatus.setAttribute("role", "status");
      responseStatus.setAttribute("aria-live", "polite");
      if (item.patient_response_status === "shared") {
        responseStatus.classList.add("shared");
        responseStatus.textContent = "Respuestas compartidas con Carolina.";
      } else if (item.patient_response_status === "draft") {
        responseStatus.textContent = "Borrador guardado. Carolina todavía no ve estas respuestas.";
      } else {
        responseStatus.textContent = "Todavía no has guardado respuestas.";
      }

      draft.addEventListener("click", () => savePatientMaterialResponse(item, form, "draft", responseStatus));
      share.addEventListener("click", () => {
        if (!window.confirm("¿Compartir estas respuestas con Carolina? Si prefieres conservarlas solo para ti, puedes guardar un borrador.")) return;
        void savePatientMaterialResponse(item, form, "share", responseStatus);
      });
      if (sourceFile) answerTarget.append(actions, responseStatus);
      else form.append(actions, responseStatus);
      if (exerciseSection) {
        // Move the entire form into the exercise accordion so free-text fields,
        // neuropsychological tasks and save/share actions remain together.
        // The form's own fields are the response source of truth.
        const host = document.createElement("div");
        host.className = "space-workbook-response-content";
        host.append(explainer, form);
        // Neuro tasks live within the same exercise accordion, not in techniques.
        exerciseContent.append(host);
        body.append(exerciseSection);
      } else {
        responseBox.append(heading, explainer, form);
        body.append(responseBox);
      }
    }

    details.append(summary, body);
    if (sourceFile) {
      const readingPart = details.querySelector(".space-workbook-part-reading");
      const showCompleteDocument = () => {
        if (!details.open || !readingPart?.open || !details.isConnected || !state.portalAuthenticated) return;
        const host = readingPart.querySelector(".space-pdf-form-reader");
        if (host) void renderCompletePdfPages(host);
      };
      details.addEventListener("toggle", showCompleteDocument);
      readingPart?.addEventListener("toggle", showCompleteDocument);
    }
    materialSavedSnapshots.set(details, snapshotPatientMaterial(details));
    const markUnsaved = event => {
      const field = event.target;
      if (!(field instanceof HTMLTextAreaElement || field instanceof HTMLInputElement || field instanceof HTMLSelectElement) ||
          !field.matches("[data-response-record],[data-response-answer],[data-neuro-answer],[data-form-answer]")) return;
      const status = details.querySelector(".space-patient-response-status");
      if (!status) return;
      const dirty = patientMaterialHasUnsavedChanges();
      if (dirty && snapshotPatientMaterial(details) !== materialSavedSnapshots.get(details)) {
        status.classList.remove("shared");
        status.textContent = "Cambios SIN guardar. Pulsa «Guardar borrador» o «Compartir respuestas» para conservarlos.";
      } else if (!dirty) {
        status.textContent = item.patient_response_status === "shared"
          ? "Respuestas compartidas con Carolina."
          : item.patient_response_status === "draft"
            ? "Borrador guardado. Carolina todavía no ve estas respuestas."
            : "Todavía no has guardado respuestas.";
      }
    };
    details.addEventListener("input", markUnsaved);
    details.addEventListener("change", markUnsaved);
    return details;
  }

  function patientFileKind(file) {
    if (String(file.mime_type || "").startsWith("audio/")) return "Audio";
    return ({
      intervention_plan: "Plan de intervención",
      information_notice: "Circular informativa",
      external_report: "Informe",
      referral: "Derivación",
      consent: "Consentimiento",
      test_result: "Resultado de prueba",
      attendance: "Justificante"
    })[file.category] || "Documento";
  }

  function createPatientFile(file) {
    // Shared PDFs, audio and documents are all accessible via an individual
    // accordion. Existing grants, URLs and downloads remain unchanged.
    const card = document.createElement("details");
    card.className = "space-patient-shared-file space-shared-file-accordion";
    const summary = document.createElement("summary");
    summary.className = "space-shared-file-summary";
    const summaryText = document.createElement("span");
    summaryText.className = "space-shared-file-summary-text";
    const title = document.createElement("strong");
    title.textContent = String(file.title || "Archivo compartido");
    const label = document.createElement("small");
    label.className = "space-patient-shared-file-kind";
    label.textContent = patientFileKind(file);
    summaryText.append(title, label);
    const chevron = document.createElement("span");
    chevron.className = "space-shared-file-chevron";
    chevron.setAttribute("aria-hidden", "true");
    chevron.textContent = "⌄";
    summary.append(summaryText, chevron);

    const content = document.createElement("div");
    content.className = "space-shared-file-content";
    if (file.patient_note) {
      const note = document.createElement("p");
      note.textContent = String(file.patient_note);
      content.append(note);
    }

    const id = String(file.id || "");
    const url = "/api/patient-portal/file?id=" + encodeURIComponent(id);
    const mime = String(file.mime_type || "");
    if (mime.startsWith("audio/")) {
      const audioPart = createWorkbookPart("Escuchar audio", "Reproductor privado del material compartido");
      const audio = document.createElement("audio");
      audio.controls = true;
      audio.preload = "none";
      audio.src = url;
      audio.setAttribute("aria-label", "Escuchar " + title.textContent);
      audioPart.content.append(audio);
      content.append(audioPart.section);
    }

    const actions = document.createElement("div");
    actions.className = "space-patient-shared-actions";
    const linkedMaterial = mime === "application/pdf"
      ? (Array.isArray(state.portalData?.materials) ? state.portalData.materials : [])
        .find(material => material.patient_document?.source_document_id === id &&
          ["sent", "assigned", "reviewed"].includes(material.status))
      : null;
    if (linkedMaterial) {
      const openWorkbook = document.createElement("button");
      openWorkbook.type = "button";
      openWorkbook.className = "space-primary";
      openWorkbook.textContent = "Abrir y responder";
      openWorkbook.addEventListener("click", () => {
        navigateToView("therapy");
        const linked = document.getElementById("space-material-" + linkedMaterial.id);
        if (linked && patientMaterials?.contains(linked)) {
          linked.open = true;
          linked.scrollIntoView({ block: "start", behavior: "auto" });
          const heading = linked.querySelector("summary");
          heading?.setAttribute("tabindex", "-1");
          heading?.focus({ preventScroll: true });
        }
      });
      actions.append(openWorkbook);
    } else if (mime === "application/pdf") {
      // A PDF which has not been turned into a prescribed activity remains
      // a readable workbook; do not invent questions or patient responses.
      const reading = createWorkbookPart("Leer documento completo",
        "Contenido original, sin modificaciones ni omisiones");
      reading.section.classList.add("space-workbook-part-reading");
      appendCompletePdfToForm(reading.content, file);
      content.append(reading.section);
      const openPrivateReader = () => {
        if (!card.open || !reading.section.open || !card.isConnected || !state.portalAuthenticated) return;
        const host = reading.content.querySelector(".space-pdf-form-reader");
        if (host) void renderCompletePdfPages(host);
      };
      card.addEventListener("toggle", openPrivateReader);
      reading.section.addEventListener("toggle", openPrivateReader);
    }
    if (mime === "application/pdf" || mime.startsWith("image/")) {
      const view = document.createElement("a");
      view.className = "space-secondary";
      view.href = url;
      view.target = "_blank";
      view.rel = "noopener noreferrer";
      view.textContent = linkedMaterial ? "Ver solo el PDF" : "Ver archivo";
      actions.append(view);
    }
    const download = document.createElement("a");
    download.className = "space-secondary";
    download.href = url + "&download=1";
    download.textContent = "↓ Descargar";
    actions.append(download);
    content.append(actions);
    card.append(summary, content);
    return card;
  }

  function renderPatientPortal(data) {
    state.portalData = data;
    state.portalAuthenticated = true;
    state.guestMode = false;

    const name = String(data?.patient?.first_name || "").trim();
    const title = document.getElementById("space-today-title");
    if (title) title.textContent = name ? `Hola, ${name}` : "Un espacio para ti";

    const appointment = data?.next_appointment || null;
    const appointmentTitle = document.getElementById("space-appointment-title");
    const appointmentCopy = document.getElementById("space-appointment-copy");
    const formatted = appointmentText(appointment);
    if (appointmentTitle) appointmentTitle.textContent = formatted || "No tienes una próxima cita registrada";
    if (appointmentCopy) appointmentCopy.textContent = formatted
      ? "Esta es la próxima cita que consta en tu agenda."
      : "Cuando haya una nueva cita vinculada a tu ficha aparecerá aquí.";

    const materials = Array.isArray(data?.materials) ? data.materials : [];
    const files = Array.isArray(data?.files) ? data.files : [];
    // Each treatment PDF appears only once: within its published interactive
    // workbook, or as a read-only collapsible workbook if not converted yet.
    const linkedSourceIds = new Set(materials.map(item =>
      String(item.patient_document?.source_document_id || "")).filter(Boolean));
    const standaloneWorkbooks = files.filter(file =>
      file.mime_type === "application/pdf" &&
      file.category === "intervention_plan" && !linkedSourceIds.has(String(file.id)));
    const workbookFileIds = new Set([...linkedSourceIds,
      ...standaloneWorkbooks.map(file => String(file.id))]);
    const otherFiles = files.filter(file => !workbookFileIds.has(String(file.id)));

    const fileCount = document.getElementById("space-shared-file-count");
    if (fileCount) fileCount.textContent = otherFiles.length === 1
      ? "1 archivo" : otherFiles.length + " archivos";
    if (patientFiles) {
      patientFiles.replaceChildren();
      if (!otherFiles.length) {
        const empty = document.createElement("div");
        empty.className = "space-empty";
        empty.textContent = "No hay otros documentos ni audios compartidos.";
        patientFiles.append(empty);
      } else {
        otherFiles.forEach(file => patientFiles.append(createPatientFile(file)));
      }
    }
    const workbookCount = materials.length + standaloneWorkbooks.length;
    const count = document.getElementById("space-material-count");
    if (count) count.textContent = workbookCount === 1
      ? "1 cuaderno disponible" : workbookCount + " cuadernos disponibles";
    const quickCount = document.getElementById("space-quick-material-count");
    if (quickCount) quickCount.textContent = workbookCount
      ? `Tienes ${workbookCount} ${workbookCount === 1 ? "cuaderno" : "cuadernos"} para consultar o completar.`
      : (otherFiles.length ? `También tienes ${otherFiles.length} archivo(s) compartido(s) en Mi espacio.`
        : "Aquí encontrarás los materiales que Carolina comparta contigo.");
    const therapyStatus = document.getElementById("space-therapy-status");
    if (therapyStatus) therapyStatus.textContent = workbookCount || otherFiles.length
      ? "Tienes cuadernos o archivos disponibles para consultar entre sesiones."
      : "No tienes material pendiente en este momento.";

    if (patientMaterials) {
      patientMaterials.replaceChildren();
      if (!workbookCount) {
        const empty = document.createElement("div");
        empty.className = "space-empty";
        empty.textContent = "No tienes cuadernos disponibles en este momento.";
        patientMaterials.append(empty);
      } else {
        materials.forEach((item, index) => patientMaterials.append(createPatientMaterial(item, index)));
        standaloneWorkbooks.forEach(file => patientMaterials.append(createPatientFile(file)));
      }
    }

    window.dispatchEvent(new Event("patient-portal-session-ready"));
    void loadPatientStorageScope();
    const requestedView = new URLSearchParams(window.location.search).get("vista");
    const requestedPanels = { panel: "today", terapia: "therapy", configuracion: "account" };
    openPortal(requestedPanels[requestedView] || "today");
    focusPatientMaterialFromHash();
    window.dispatchEvent(new Event("patient-portal-view-ready"));
  }

  async function loadPatientSession() {
    const requestEpoch = ++portalSessionEpoch;
    try {
      const response = await fetch("/api/patient-portal/session", {
        cache: "no-store",
        credentials: "include"
      });
      if (requestEpoch !== portalSessionEpoch) return false;
      if (!response.ok) {
        showAccessGate();
        if (response.status !== 401) {
          setAccessMessage("No hemos podido cargar tus datos de manera segura. No necesitas cambiar la contraseña; prueba a recargar la página.", true);
        }
        return false;
      }
      const data = await response.json();
      if (requestEpoch !== portalSessionEpoch) return false;
      if (!data?.authenticated) {
        showAccessGate();
        return false;
      }
      renderPatientPortal(data);
      return true;
    } catch {
      if (requestEpoch !== portalSessionEpoch) return false;
      showAccessGate();
      setAccessMessage("No se ha podido comprobar el acceso. Puedes volver a intentarlo.", true);
      return false;
    }
  }

  async function patientAuthRequest(action, data) {
    const response = await fetch("/api/patient-portal/" + action, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
      body: JSON.stringify(data),
    });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(body.error || "No se ha podido completar la solicitud.");
    return body;
  }

  function setBusy(form, busy) {
    form?.querySelectorAll('button[type="submit"]').forEach(button => {
      button.disabled = Boolean(busy);
    });
  }

  async function requestPatientLink(event) {
    event.preventDefault();
    const email = String(accessEmail?.value || "").trim().toLowerCase();
    if (!email) return;
    setBusy(emailForm, true);
    setAccessMessage("Solicitando un enlace seguro…");
    try {
      await patientAuthRequest("password-link", { email, purpose: linkPurpose });
      setAccessMessage("Si el correo está habilitado, recibirás un enlace. Comprueba también el correo no deseado.");
    } catch (error) {
      setAccessMessage(error?.message || "No se ha podido solicitar el enlace.", true);
    } finally {
      setBusy(emailForm, false);
    }
  }

  async function setNewPassword(event) {
    event.preventDefault();
    const email = String(setupEmail?.value || "").trim().toLowerCase();
    const password = String(setupPassword?.value || "");
    if (password.length < 12 || password.length > 128 || password !== String(confirmPassword?.value || "")) {
      setAccessMessage("Comprueba las contraseñas: deben coincidir y tener al menos 12 caracteres.", true);
      return;
    }
    setBusy(setupForm, true);
    setAccessMessage("Guardando tu contraseña…");
    try {
      await patientAuthRequest("password-set", {
        email, password, token_hash: passwordTokenHash, flow: passwordLinkFlow
      });
      passwordTokenHash = "";
      passwordLinkFlow = "";
      if (setupPassword) setupPassword.value = "";
      if (confirmPassword) confirmPassword.value = "";
      showAccessForm("login");
      if (loginEmail) loginEmail.value = email;
      setAccessMessage("Contraseña guardada. Introduce tu correo y contraseña para entrar.");
    } catch (error) {
      setAccessMessage(error?.message || "No se ha podido guardar la contraseña.", true);
    } finally {
      setBusy(setupForm, false);
    }
  }

  async function loginWithPassword(event) {
    event.preventDefault();
    const loginEpoch = ++portalSessionEpoch;
    const email = String(loginEmail?.value || "").trim().toLowerCase();
    const password = String(loginPassword?.value || "");
    if (!email || !password) return;
    // Preserve the portal's separate-tab behavior, except inside the installed app.
    const newTab = insideEntreSesionesApp ? null : window.open("about:blank", "_blank");
    if (newTab) newTab.opener = null;
    setBusy(loginForm, true);
    setAccessMessage("Comprobando tus datos de acceso…");
    try {
      await patientAuthRequest("password-login", { email, password });
      if (loginEpoch !== portalSessionEpoch) {
        if (newTab && !newTab.closed) newTab.close();
        return;
      }
      if (loginPassword) loginPassword.value = "";
      const response = await fetch("/api/patient-portal/session", { credentials: "include", cache: "no-store" });
      const session = await response.json().catch(() => ({}));
      if (loginEpoch !== portalSessionEpoch) {
        if (newTab && !newTab.closed) newTab.close();
        return;
      }
      if (!response.ok || !session.authenticated) throw new Error("No se ha podido confirmar la sesión.");
      if (insideEntreSesionesApp) {
        renderPatientPortal(session);
        setAccessMessage("");
        return;
      }
      const requestedView = new URLSearchParams(window.location.search).get("vista");
      const allowedViews = ["terapia", "configuracion"];
      const url = allowedViews.includes(requestedView)
        ? "/mi-espacio/?vista=" + requestedView
        : "/mi-espacio/?vista=panel";
      if (newTab && !newTab.closed) {
        newTab.location.replace(url);
        setAccessMessage("Sesión iniciada. Mi espacio se ha abierto en otra pestaña.");
      } else {
        if (openPanelButton) openPanelButton.hidden = false;
        setAccessMessage("Sesión iniciada. Pulsa «Abrir Mi espacio» para abrirlo en otra pestaña.");
      }
    } catch (error) {
      if (newTab && !newTab.closed) newTab.close();
      if (loginEpoch === portalSessionEpoch) {
        setAccessMessage(error?.message || "Correo o contraseña incorrectos.", true);
      }
    } finally {
      setBusy(loginForm, false);
    }
  }

  function resetPatientAccess() {
    state.accessEmail = "";
    if (loginPassword) loginPassword.value = "";
    if (setupPassword) setupPassword.value = "";
    if (confirmPassword) confirmPassword.value = "";
    passwordTokenHash = "";
    passwordLinkFlow = "";
    showAccessForm("login");
  }

  function verifySetupLinkFromUrl() {
    const fragment = new URLSearchParams(window.location.hash.slice(1));
    const tokenHash = fragment.get("configurar");
    const flow = fragment.get("tipo");
    if (!tokenHash) return false;
    history.replaceState(null, "", window.location.pathname + window.location.search);
    if (!/^[A-Za-z0-9_-]{32,256}$/.test(tokenHash) || !["invite", "recovery"].includes(flow)) {
      showAccessForm("login");
      setAccessMessage("El enlace no es válido. Solicita otro.", true);
      return true;
    }
    passwordTokenHash = tokenHash;
    passwordLinkFlow = flow;
    showAccessGate();
    showAccessForm("setup");
    setAccessMessage("Introduce el correo que utilizas en consulta y crea tu contraseña.");
    return true;
  }

  async function logoutPatientPortal() {
    if ((patientMaterialHasUnsavedChanges() || sessionPreparationHasUnsavedNotes()) &&
        !window.confirm("Hay notas sin guardar. Si cierras sesión, se descartarán. ¿Quieres continuar?")) return;
    const logoutEpoch = ++portalSessionEpoch;
    const message = document.getElementById("space-clear-message");
    if (message) message.textContent = "Cerrando tu sesión…";
    try {
      const response = await fetch("/api/patient-portal/logout", {
        method: "POST", credentials: "include", cache: "no-store"
      });
      if (logoutEpoch !== portalSessionEpoch) return;
      if (response.status === 401) {
        // La sesión ya ha caducado: retirar igualmente toda la información del navegador.
        resetPatientAccess();
        showAccessGate();
        return;
      }
      if (!response.ok) throw new Error("logout_not_confirmed");
    } catch {
      if (logoutEpoch === portalSessionEpoch) {
        if (message) message.textContent = "No hemos podido cerrar la sesión en el servidor. Comprueba tu conexión y vuelve a intentarlo.";
        patientMaterials?.querySelectorAll(".space-patient-response-status").forEach(status => {
          if (/^(Guardando|Compartiendo)/.test(status.textContent || "")) {
            status.textContent = "El guardado no se ha podido confirmar en pantalla. Comprueba tus respuestas antes de intentarlo de nuevo.";
          }
        });
      }
      return;
    }
    state.guestMode = false;
    resetPatientAccess();
    showAccessGate();
  }

  function clearLegacyAccessToken() {
    // Old URL tokens never grant clinical access. Remove them from browser URL and storage.
    const url = new URL(window.location.href);
    if (url.searchParams.has("token")) {
      url.searchParams.delete("token");
      history.replaceState({}, "", url.pathname + url.search + url.hash);
    }
    try { sessionStorage.removeItem(LEGACY_BETWEEN_KEY); } catch (_) {}
  }

  navButtons.forEach(button => {
    button.addEventListener("click", () => {
      const view = button.dataset.spaceView;
      if (!state.portalAuthenticated) {
        state.guestMode = false;
        showAccessGate();
        setAccessMessage("Para ver tu terapia, inicia sesión con tu correo y contraseña.");
        return;
      }
      navigateToView(view);
    });
  });

  document.getElementById("space-clear-local")?.addEventListener("click", () => {
    if (!state.portalAuthenticated || !state.storageScope) return;
    if (!window.confirm("¿Restablecer las preferencias de lectura guardadas en este dispositivo? Tus ejercicios y respuestas clínicas no se modificarán.")) return;
    const key = scopedPatientKey(READING_KEY);
    try {
      if (key) localStorage.removeItem(key);
    } catch {
      const message = document.getElementById("space-clear-message");
      if (message) message.textContent = "El navegador no ha permitido borrar las preferencias de lectura.";
      return;
    }
    loadReadingSettings();
    const message = document.getElementById("space-clear-message");
    if (message) message.textContent = "Preferencias de lectura restablecidas en este dispositivo.";
  });

  emailForm?.addEventListener("submit", requestPatientLink);
  loginForm?.addEventListener("submit", loginWithPassword);
  setupForm?.addEventListener("submit", setNewPassword);
  document.getElementById("space-first-access")?.addEventListener("click", () => {
    linkPurpose = "setup";
    const heading = document.getElementById("space-email-title");
    if (heading) heading.textContent = "Tu primer acceso";
    const info = document.getElementById("space-email-description");
    if (info) info.textContent = "Recibirás un enlace para configurar tu contraseña.";
    showAccessForm("email");
  });
  document.getElementById("space-forgot-password")?.addEventListener("click", () => {
    linkPurpose = "reset";
    const heading = document.getElementById("space-email-title");
    if (heading) heading.textContent = "Recuperar contraseña";
    const info = document.getElementById("space-email-description");
    if (info) info.textContent = "Te enviaremos un enlace para elegir una nueva contraseña.";
    if (accessEmail && loginEmail) accessEmail.value = loginEmail.value;
    showAccessForm("email");
  });
  document.querySelectorAll("[data-back-to-login]").forEach(button => button.addEventListener("click", () => {
    passwordTokenHash = "";
    passwordLinkFlow = "";
    showAccessForm("login");
  }));
  openPanelButton?.addEventListener("click", () => {
    const requestedView = new URLSearchParams(window.location.search).get("vista");
    const allowedViews = ["terapia", "configuracion"];
    const url = allowedViews.includes(requestedView)
        ? "/mi-espacio/?vista=" + requestedView
        : "/mi-espacio/?vista=panel";
    window.open(url, "_blank", "noopener,noreferrer");
  });

  document.querySelectorAll("[data-go-therapy]").forEach((button) => {
    button.addEventListener("click", () => {
      if (state.portalAuthenticated) navigateToView("therapy");
      else {
        showAccessGate();
        setAccessMessage("Para ver tu terapia, inicia sesión con tu contraseña.");
      }
    });
  });
  document.getElementById("space-logout")?.addEventListener("click", logoutPatientPortal);

  window.addEventListener("beforeunload", event => {
    if (!patientMaterialHasUnsavedChanges() && !sessionPreparationHasUnsavedNotes()) return;
    event.preventDefault();
    event.returnValue = ""; // The browser decides whether to show the native warning.
  });

  if (insideEntreSesionesApp) {
    window.addEventListener("hashchange", focusPatientMaterialFromHash);
    document.querySelectorAll(".esapp-bottom-nav a").forEach(link => {
      const destination = new URL(link.href, window.location.origin);
      if (destination.origin !== window.location.origin ||
          destination.pathname !== window.location.pathname) return;
      const name = slugView[destination.searchParams.get("vista")];
      if (!name) return;
      link.addEventListener("click", event => {
        if (!state.portalAuthenticated || event.defaultPrevented || event.button !== 0 ||
            event.ctrlKey || event.metaKey || event.altKey || event.shiftKey) return;
        event.preventDefault();
        navigateToView(name);
      });
    });
    window.addEventListener("popstate", () => {
      if (!state.portalAuthenticated) return;
      // Los filtros de una visita anterior no deben contaminar la sección restaurada.
      showView(currentViewFromUrl());
    });
  }

  clearLegacyAccessToken();
  const configuringPassword = verifySetupLinkFromUrl();
  // Even /mi-espacio/ and /entre-sesiones/app/espacio/ without a vista
  // must validate an existing session before rendering the login screen.
  if (!configuringPassword) void loadPatientSession();
  if (insideEntreSesionesApp) {
    // Restauración desde la caché de navegación: revalidar antes de mostrar
    // contenidos clínicos de una sesión que podría haberse cerrado.
    window.addEventListener("pageshow", event => {
      if (!event.persisted) return;
      showAccessGate(true);
      void loadPatientSession();
    });
  }
})();
