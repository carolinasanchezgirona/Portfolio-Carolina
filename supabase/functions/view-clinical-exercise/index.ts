
import { PDFDocument, StandardFonts, rgb } from "npm:pdf-lib@1.17.1";
import { normalizeVisualBlocks, visualHtml, matrix, getCalendar, type VisualBlock } from "./visual-blocks.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const ALLOWED_USER_ID = "9d2cfdb1-fed6-4f76-b47a-d58507eb14f2";

type PatientDocument = {
  version?: number;
  material_type?: "exercise" | "psychoeducation";
  duration_minutes?: number | null;
  frequency?: string;
  introduction?: string;
  why?: string;
  objective?: string;
  instructions?: string;
  example?: string;
  record_prompt?: string;
  safety_note?: string;
  remember?: string;
  session_questions?: string[];
  clinical_area?: "psychology" | "neuropsychology";
  neuro_profile?: Record<string, string> | null;
  visual_blocks?: VisualBlock[];
};

type MaterialRow = {
  id: string;
  patient_id?: string;
  title: string;
  content: string;
  patient_document?: unknown;
  created_at?: string;
  sent_at?: string | null;
  status?: string;
  email_status?: string;
  access_expires_at?: string | null;
  revoked_at?: string | null;
  first_opened_at?: string | null;
  patient_state?: string;
  patient_state_at?: string | null;
  patient_response?: unknown;
  patient_response_status?: "empty" | "draft" | "shared";
  patient_response_updated_at?: string | null;
  patient_response_shared_at?: string | null;
};

const serviceHeaders = {
  apikey: SERVICE_ROLE_KEY,
  Authorization: "Bearer " + SERVICE_ROLE_KEY,
  "Content-Type": "application/json"
};

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, apikey, content-type",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS"
  };
}

function escapeHtml(value: unknown) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("\"", "&quot;")
    .replaceAll("'", "&#039;");
}

function pdfSafe(value: unknown) {
  return String(value ?? "")
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, "\"")
    .replace(/[\u2013\u2014]/g, "-")
    .replace(/\u2026/g, "...")
    .replace(/\u2022/g, "-")
    .replace(/\u00A0/g, " ")
    .replace(/[→➜➝]/g, "->")
    .replace(/[←]/g, "<-")
    .replace(/[↔]/g, "<->")
    .replace(/≥/g, ">=")
    .replace(/≤/g, "<=")
    .replace(/≠/g, "!=")
    .replace(/×/g, "x")
    .replace(/[\u{1F000}-\u{1FAFF}]/gu, "")
    .replace(/[^\x09\x0A\x0D\x20-\x7E\u00A0-\u00FF]/g, "")
    .trim();
}

function normalizePatientDocument(raw: unknown, content = ""): PatientDocument {
  const source = raw && typeof raw === "object" && !Array.isArray(raw) ? raw as Record<string, unknown> : {};
  const type = source.material_type === "psychoeducation" ? "psychoeducation" : "exercise";
  const durationValue = Number(source.duration_minutes);
  const questions = Array.isArray(source.session_questions)
    ? source.session_questions.map((item) => String(item ?? "").trim()).filter(Boolean).slice(0, 6)
    : [];
  return {
    version: 1,
    material_type: type,
    clinical_area: source.clinical_area === "neuropsychology" ? "neuropsychology" : "psychology",
    neuro_profile: source.neuro_profile && typeof source.neuro_profile === "object" && !Array.isArray(source.neuro_profile) ? source.neuro_profile as Record<string, string> : null,
    visual_blocks: normalizeVisualBlocks(source.visual_blocks),
    duration_minutes: Number.isFinite(durationValue) && durationValue > 0 && durationValue <= 180 ? Math.round(durationValue) : null,
    frequency: String(source.frequency ?? "").trim() || (type === "psychoeducation"
      ? "Revísalo una vez esta semana y vuelve a él si te resulta útil."
      : "Practícalo según lo acordado en sesión. Si no concretamos frecuencia, prueba una vez y anota qué observas."),
    introduction: String(source.introduction ?? "").trim() || (type === "psychoeducation"
      ? "Este material resume una idea trabajada en sesión para que puedas revisarla con calma y volver a ella cuando lo necesites."
      : "Este material forma parte del trabajo acordado en sesión. Úsalo como una guía breve entre sesiones y adáptalo a tu ritmo."),
    why: String(source.why ?? "").trim() || (type === "psychoeducation"
      ? "Comprender este proceso puede ayudarte a reconocer mejor qué está ocurriendo y disponer de un mapa más claro antes de decidir qué practicar."
      : "Este ejercicio permite practicar fuera de sesión una habilidad concreta y observar cómo funciona en situaciones reales. No buscamos hacerlo perfecto ni eliminar el malestar de inmediato, sino obtener información útil y ampliar recursos."),
    objective: String(source.objective ?? "").trim(),
    instructions: String(source.instructions ?? "").trim() || String(content ?? "").trim(),
    example: String(source.example ?? "").trim(),
    record_prompt: String(source.record_prompt ?? "").trim() || (type === "exercise"
      ? "Después de probarlo, anota brevemente en qué situación lo utilizaste, qué hiciste y qué observaste. No hace falta escribir mucho."
      : ""),
    safety_note: String(source.safety_note ?? "").trim(),
    remember: String(source.remember ?? "").trim() || (type === "psychoeducation"
      ? "No necesitas memorizarlo ni estar de acuerdo con todo a la primera. Quédate con las ideas que te ayuden a entender mejor lo que ocurre."
      : "No se trata de hacerlo perfecto. Si algo no encaja, resulta demasiado difícil o genera dudas, déjalo anotado para revisarlo en sesión."),
    session_questions: questions.length ? questions : (type === "psychoeducation"
      ? ["¿Qué idea te ha resultado más útil o relevante?", "¿Hay algo que no encaje con tu experiencia o quieras revisar?"]
      : ["¿Qué te resultó más fácil o más difícil?", "¿Qué observaste al probarlo?", "¿Qué ajustarías para que te resulte más útil?"])
  };
}

async function sha256(value: string) {
  const bytes = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(bytes)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

function slug(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 70) || "material";
}

function page(title: string, body: string, status = 200, extraHeaders: Record<string,string> = {}) {
  const css = ".visual-item{padding:16px 0;border-bottom:1px solid #D7E5EE}.visual-item h3{color:#173A5E}.visual-item figure{margin:0}.visual-item img{max-width:100%;max-height:360px;object-fit:contain}.visual-item figcaption{font-size:12px;color:#6B7C87;margin-top:6px}.visual-scroll{overflow-x:auto}.visual-item table{width:100%;border-collapse:collapse;table-layout:fixed}.visual-item th,.visual-item td{border:1px solid #D7E5EE;padding:9px;overflow-wrap:anywhere}.visual-item th{background:#EAF6FB}.visual-calendar td{height:62px;vertical-align:top}.visual-calendar small{display:block;font-size:10px}.visual-chart{display:grid;gap:10px}.visual-bar{display:grid;grid-template-columns:minmax(80px,1fr) minmax(90px,3fr) auto;gap:9px;align-items:center}.visual-bar>div{height:17px;background:#EAF6FB}.visual-bar i{display:block;height:100%;background:#08A6A0}.visual-steps{display:grid;gap:9px;padding-left:25px}.visual-steps li{background:#EAF6FB;border-radius:8px;padding:12px}:root{--navy:#173A5E;--turq:#08A6A0;--sky:#EAF6FB;--ink:#243746;--muted:#6B7C87;--line:#D7E5EE;--warm:#FFF8EE}*{box-sizing:border-box}body{margin:0;background:#F4F8FA;color:var(--ink);font-family:Arial,Helvetica,sans-serif}.shell{max-width:1080px;margin:0 auto;padding:26px 16px 44px}.portal{display:grid;grid-template-columns:260px minmax(0,1fr);gap:18px}.library{align-self:start;position:sticky;top:18px;background:#fff;border:1px solid var(--line);border-radius:18px;padding:18px;box-shadow:0 12px 34px rgba(23,58,94,.06)}.library h2{margin:3px 0 5px;color:var(--navy);font-family:Georgia,serif;font-size:21px}.library-note{margin:0 0 14px;color:var(--muted);font-size:12px;line-height:1.45}.library-list{display:grid;gap:7px}.library-item{display:block;padding:10px 11px;border:1px solid transparent;border-radius:10px;color:#435c6b;text-decoration:none;font-size:12.5px;line-height:1.35}.library-item:hover{background:#F5FAFC}.library-item.active{border-color:#BDE1E3;background:#EFFAFA;color:var(--navy);font-weight:700}.card{overflow:hidden;background:#fff;border:1px solid var(--line);border-radius:22px;box-shadow:0 18px 55px rgba(23,58,94,.09)}.topline{height:8px;background:var(--turq)}.content{padding:clamp(24px,5vw,46px)}.brand{display:flex;justify-content:space-between;gap:18px;align-items:flex-start;margin-bottom:22px}.eyebrow{margin:0;color:var(--turq);font-size:12px;font-weight:800;letter-spacing:.12em;text-transform:uppercase}.brand-name{margin:0;color:var(--muted);font-size:12px;text-align:right;line-height:1.45}h1{margin:8px 0 12px;color:var(--navy);font-family:Georgia,'Times New Roman',serif;font-size:clamp(29px,6vw,43px);line-height:1.08;font-weight:700}.intro{margin:0 0 20px;color:#405766;font-size:17px;line-height:1.65}.meta{display:flex;gap:8px;flex-wrap:wrap;margin:0 0 24px}.meta span{display:inline-flex;align-items:center;min-height:30px;padding:5px 10px;border-radius:999px;background:#F0F6F9;color:#496577;font-size:12px;font-weight:700}.section{padding:22px 0;border-top:1px solid #E4EDF2}.section h2{margin:0 0 10px;color:var(--navy);font-size:15px;line-height:1.25}.copy{white-space:pre-wrap;font-size:15px;line-height:1.72}.section.why{margin:8px 0 4px;padding:20px;border:0;border-radius:15px;background:var(--sky);box-shadow:inset 4px 0 0 var(--turq)}.section.remember{margin-top:8px;padding:18px 20px;border:1px solid #CDE5EA;border-radius:14px;background:#F7FCFC}.section.safety{margin-top:8px;padding:18px 20px;border:1px solid #F0DEC2;border-radius:14px;background:var(--warm)}.questions{margin:8px 0 0;padding-left:20px}.questions li{margin:7px 0;line-height:1.55}.actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:24px;padding-top:22px;border-top:1px solid #E4EDF2}.button{display:inline-flex;align-items:center;justify-content:center;min-height:44px;padding:11px 18px;border-radius:10px;border:1px solid var(--navy);background:var(--navy);color:#fff;text-decoration:none;font-size:14px;font-weight:750}.response-box{margin-top:18px;padding:20px;border:1px solid #BFDDE3;border-radius:16px;background:#FBFEFF}.response-box h2{margin:0 0 6px;color:var(--navy);font-size:17px}.response-box>p{margin:0 0 16px;color:var(--muted);font-size:12.5px;line-height:1.55}.response-field{display:grid;gap:7px;margin-top:14px}.response-field span{color:var(--navy);font-size:13px;font-weight:750;line-height:1.45}.response-field textarea{width:100%;min-height:112px;resize:vertical;border:1px solid #BED0DB;border-radius:11px;padding:12px 13px;background:#fff;color:var(--ink);font:inherit;font-size:14px;line-height:1.55}.response-field textarea:focus{outline:2px solid rgba(8,166,160,.18);border-color:var(--turq)}.response-actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:16px}.response-actions button{min-height:40px;padding:9px 13px;border-radius:10px;font:inherit;font-size:12.5px;font-weight:800;cursor:pointer}.response-save{border:1px solid #B9CFDA;background:#fff;color:var(--navy)}.response-share{border:1px solid var(--navy);background:var(--navy);color:#fff}.response-status{margin-top:12px;padding:10px 12px;border-radius:10px;background:#F1F7F9;color:#4B6675;font-size:12px;line-height:1.45}.response-status.shared{background:#EAF9F8;color:#145D5A}.state-box{margin-top:18px;padding:18px;border-radius:14px;background:#F8FBFC;border:1px solid var(--line)}.state-box h2{margin:0 0 5px;color:var(--navy);font-size:15px}.state-box p{margin:0 0 12px;color:var(--muted);font-size:12px;line-height:1.5}.state-actions{display:flex;gap:7px;flex-wrap:wrap}.state-actions form{margin:0}.state-actions button{min-height:36px;padding:8px 11px;border:1px solid #C8D9E4;border-radius:9px;background:#fff;color:#3D5868;font:inherit;font-size:12px;font-weight:700;cursor:pointer}.state-actions button.active{border-color:var(--turq);background:#EAF9F8;color:#145D5A}.small{margin:16px 0 0;color:var(--muted);font-size:12px;line-height:1.55}.footer{padding:18px 24px;background:#F8FBFC;color:var(--muted);font-size:12px;line-height:1.5}@media(max-width:760px){.portal{grid-template-columns:1fr}.library{position:static}.library-list{display:flex;overflow:auto;padding-bottom:3px}.library-item{min-width:190px}.brand{display:block}.brand-name{text-align:left;margin-top:8px}.content{padding:24px 20px}}";
  return new Response("<!doctype html><html lang=\"es\"><head><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\"><meta name=\"robots\" content=\"noindex,nofollow\"><title>" + escapeHtml(title) + "</title><style>" + css + "</style></head><body>" + body + "</body></html>", {
    status,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
      "Referrer-Policy": "no-referrer",
      "X-Content-Type-Options": "nosniff",
      "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'; img-src data:; base-uri 'none'; form-action 'self'; frame-ancestors 'none'",
      ...extraHeaders
    }
  });
}

function sectionHtml(title: string, value: string, className = "") {
  if (!value) return "";
  return "<section class=\"section " + className + "\"><h2>" + escapeHtml(title) + "</h2><div class=\"copy\">" + escapeHtml(value) + "</div></section>";
}

function patientStateLabel(value: string | undefined) {
  if (value === "reviewed") return "Lo he revisado";
  if (value === "discuss") return "Quiero comentarlo en sesión";
  return "Pendiente";
}

function materialDate(item: MaterialRow) {
  const raw = item.sent_at || item.created_at;
  if (!raw) return "";
  try {
    return new Intl.DateTimeFormat("es-ES", { day: "numeric", month: "short", year: "numeric", timeZone: "Europe/Madrid" }).format(new Date(raw));
  } catch {
    return "";
  }
}

function responseDate(value: string | null | undefined) {
  if (!value) return "";
  try {
    return new Intl.DateTimeFormat("es-ES", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", timeZone: "Europe/Madrid" }).format(new Date(value));
  } catch {
    return "";
  }
}

function normalizePatientResponse(raw: unknown, questionCount: number) {
  const source = raw && typeof raw === "object" && !Array.isArray(raw) ? raw as Record<string, unknown> : {};
  const record = String(source.record ?? "").slice(0, 12000);
  const rawAnswers = Array.isArray(source.answers) ? source.answers : [];
  const answers = Array.from({ length: questionCount }, (_, index) => String(rawAnswers[index] ?? "").slice(0, 6000));
  return { version: 1, record, answers };
}

function responseEditorHtml(item: MaterialRow, doc: PatientDocument, token: string | null, preview = false) {
  if (!token || preview || doc.material_type === "psychoeducation") return "";
  const questions = (doc.session_questions || []).slice(0, 6);
  const response = normalizePatientResponse(item.patient_response, questions.length);
  const fields: string[] = [];
  if (doc.record_prompt) {
    fields.push("<label class=\"response-field\"><span>Tu registro</span><textarea name=\"response_record\" rows=\"5\" maxlength=\"12000\" placeholder=\"Escribe aquí. Puedes guardar y continuar otro día.\">" + escapeHtml(response.record) + "</textarea></label>");
  }
  questions.forEach((question, index) => {
    fields.push("<label class=\"response-field\"><span>" + escapeHtml(question) + "</span><textarea name=\"response_question_" + index + "\" rows=\"4\" maxlength=\"6000\" placeholder=\"Tu respuesta…\">" + escapeHtml(response.answers[index] || "") + "</textarea></label>");
  });
  if (!fields.length) return "";

  const status = item.patient_response_status || "empty";
  const date = responseDate(status === "shared" ? item.patient_response_shared_at : item.patient_response_updated_at);
  let statusText = "Todavía no has guardado respuestas.";
  let statusClass = "";
  if (status === "draft") statusText = "Borrador guardado" + (date ? " · " + date : "") + ". Carolina no ve este borrador.";
  if (status === "shared") {
    statusText = "Respuestas compartidas con Carolina" + (date ? " · " + date : "") + ". Puedes modificarlas y volver a compartirlas.";
    statusClass = " shared";
  }

  return "<section class=\"response-box\"><h2>Rellena el ejercicio aquí</h2><p>Puedes escribir directamente desde el móvil, la tableta o el ordenador. Guardar borrador no comparte tus respuestas. Solo serán visibles para Carolina cuando pulses <strong>Compartir respuestas</strong>.</p><form method=\"post\"><input type=\"hidden\" name=\"token\" value=\"" + escapeHtml(token) + "\"><input type=\"hidden\" name=\"material\" value=\"" + escapeHtml(item.id) + "\">" + fields.join("") + "<div class=\"response-actions\"><button class=\"response-save\" type=\"submit\" name=\"response_action\" value=\"draft\">Guardar borrador</button><button class=\"response-share\" type=\"submit\" name=\"response_action\" value=\"share\">Compartir respuestas con Carolina</button></div><div class=\"response-status" + statusClass + "\">" + escapeHtml(statusText) + "</div></form></section>";
}

function materialContentHtml(item: MaterialRow, token: string | null, preview = false) {
  const doc = normalizePatientDocument(item.patient_document, item.content);
  const whyHeading = doc.material_type === "psychoeducation" ? "Por qué este material puede ayudarte" : "Por qué hacemos este ejercicio";
  const questions = (doc.session_questions || []).map((value) => "<li>" + escapeHtml(value) + "</li>").join("");
  const metaParts: string[] = [];
  if (doc.duration_minutes) metaParts.push("<span>Tiempo aproximado: " + escapeHtml(doc.duration_minutes) + " min</span>");
  if (doc.frequency) metaParts.push("<span>" + escapeHtml(doc.frequency) + "</span>");
  const selectedDate = materialDate(item);
  if (selectedDate) metaParts.push("<span>Material: " + escapeHtml(selectedDate) + "</span>");

  let download = "";
  if (token && !preview) {
    const url = new URL(SUPABASE_URL + "/functions/v1/view-clinical-exercise");
    url.searchParams.set("token", token);
    url.searchParams.set("material", item.id);
    url.searchParams.set("format", "pdf");
    download = "<a class=\"button\" href=\"" + escapeHtml(url.toString()) + "\" rel=\"noreferrer\">Descargar PDF</a>";
  }

  let stateBox = "";
  if (token && !preview) {
    const states = [
      ["pending", "Pendiente"],
      ["reviewed", "Lo he revisado"],
      ["discuss", "Quiero comentarlo en sesión"]
    ];
    const forms = states.map(([value,label]) => {
      const active = (item.patient_state || "pending") === value ? " active" : "";
      return "<form method=\"post\"><input type=\"hidden\" name=\"token\" value=\"" + escapeHtml(token) + "\"><input type=\"hidden\" name=\"material\" value=\"" + escapeHtml(item.id) + "\"><button class=\"" + active.trim() + "\" type=\"submit\" name=\"patient_state\" value=\"" + value + "\">" + label + "</button></form>";
    }).join("");
    stateBox = "<section class=\"state-box\"><h2>Tu estado</h2><p>Esto solo indica si ya lo has revisado o si quieres comentarlo en sesión. No recoge notas ni respuestas clínicas.</p><div class=\"state-actions\">" + forms + "</div></section>";
  }

  return "<div class=\"topline\"></div><div class=\"content\">" +
    "<div class=\"brand\"><div><p class=\"eyebrow\">MATERIAL ENTRE SESIONES</p></div><p class=\"brand-name\">Psicología Sanitaria<br>y Neuropsicología</p></div>" +
    "<h1>" + escapeHtml(item.title) + "</h1>" +
    "<p class=\"intro\">" + escapeHtml(doc.introduction) + "</p>" +
    (metaParts.length ? "<div class=\"meta\">" + metaParts.join("") + "</div>" : "") +
    sectionHtml(whyHeading, doc.why || "", "why") +
    sectionHtml("Qué vamos a observar o entrenar", doc.objective || "") +
    sectionHtml(doc.material_type === "psychoeducation" ? "Contenido" : "Cómo hacerlo", doc.instructions || "") +
    sectionHtml("Ejemplo", doc.example || "") +
    visualHtml(doc.visual_blocks, escapeHtml) +
    sectionHtml("Tu registro / espacio para trabajar", doc.record_prompt || "") +
    responseEditorHtml(item, doc, token, preview) +
    sectionHtml("Si resulta demasiado intenso", doc.safety_note || "", "safety") +
    sectionHtml("Qué conviene recordar", doc.remember || "", "remember") +
    (questions ? "<section class=\"section\"><h2>Para comentar en sesión</h2><ul class=\"questions\">" + questions + "</ul></section>" : "") +
    "<div class=\"actions\">" + download + "</div>" +
    stateBox +
    "<p class=\"small\">" + (preview ? "Vista previa profesional. No contiene datos identificativos del paciente." : "El PDF no incluye tu nombre, diagnóstico ni notas internas de la consulta. Puedes guardarlo para conservar el material.") + "</p>" +
    "</div><footer class=\"footer\">Carolina Sánchez Girona · Psicología Sanitaria y Neuropsicología · carolinasanchezgirona.com</footer>";
}

function portalHtml(materials: MaterialRow[], selected: MaterialRow, token: string | null, preview = false) {
  const items = materials.map((item) => {
    const active = item.id === selected.id ? " active" : "";
    if (preview || !token) {
      return "<span class=\"library-item" + active + "\">" + escapeHtml(item.title) + "</span>";
    }
    const url = new URL(SUPABASE_URL + "/functions/v1/view-clinical-exercise");
    url.searchParams.set("token", token);
    url.searchParams.set("material", item.id);
    return "<a class=\"library-item" + active + "\" href=\"" + escapeHtml(url.toString()) + "\">" + escapeHtml(item.title) + "</a>";
  }).join("");

  return "<main class=\"shell\"><div class=\"portal\"><aside class=\"library\"><p class=\"eyebrow\">ENTRE SESIONES</p><h2>Mis materiales</h2><p class=\"library-note\">" +
    (preview ? "Vista previa de la biblioteca personal." : "Aquí aparecen los materiales que tu profesional ha compartido contigo y que siguen disponibles.") +
    "</p><div class=\"library-list\">" + items + "</div></aside><article class=\"card\">" +
    materialContentHtml(selected, token, preview) +
    "</article></div><p class=\"small\">Este acceso es personal. No lo reenvíes. Si crees que otra persona ha accedido, comunícalo a tu profesional.</p></main>";
}

async function verifyOwner(req: Request) {
  const authorization = req.headers.get("Authorization") ?? "";
  if (!authorization.startsWith("Bearer ")) return false;
  const response = await fetch(SUPABASE_URL + "/auth/v1/user", {
    headers: { apikey: ANON_KEY, Authorization: authorization }
  });
  if (!response.ok) return false;
  const user = await response.json();
  return user?.id === ALLOWED_USER_ID;
}

async function findSeedByToken(token: string): Promise<MaterialRow | null> {
  if (!/^[A-Za-z0-9_-]{40,}$/.test(token)) return null;
  const hash = await sha256(token);
  const response = await fetch(
    SUPABASE_URL + "/rest/v1/clinical_exercise_assignments?access_token_hash=eq." + encodeURIComponent(hash) +
      "&select=id,patient_id,title,content,patient_document,created_at,sent_at,status,email_status,access_expires_at,revoked_at,first_opened_at,patient_state,patient_state_at,patient_response,patient_response_status,patient_response_updated_at,patient_response_shared_at&limit=1",
    { headers: serviceHeaders }
  );
  if (!response.ok) return null;
  const item = (await response.json())?.[0] as MaterialRow | undefined;
  if (!item || item.revoked_at || !item.access_expires_at || new Date(item.access_expires_at) <= new Date()) return null;
  return item;
}

async function patientMaterials(patientId: string): Promise<MaterialRow[]> {
  const response = await fetch(
    SUPABASE_URL + "/rest/v1/clinical_exercise_assignments?patient_id=eq." + encodeURIComponent(patientId) +
      "&revoked_at=is.null&status=in.(sent,assigned,reviewed)&select=id,patient_id,title,content,patient_document,created_at,sent_at,status,email_status,access_expires_at,revoked_at,first_opened_at,patient_state,patient_state_at,patient_response,patient_response_status,patient_response_updated_at,patient_response_shared_at&order=sent_at.desc.nullslast,created_at.desc&limit=100",
    { headers: serviceHeaders }
  );
  if (!response.ok) return [];
  return await response.json();
}

async function markOpened(item: MaterialRow) {
  if (item.first_opened_at) return;
  const opened = new Date().toISOString();
  await fetch(SUPABASE_URL + "/rest/v1/clinical_exercise_assignments?id=eq." + encodeURIComponent(item.id), {
    method: "PATCH",
    headers: { ...serviceHeaders, Prefer: "return=minimal" },
    body: JSON.stringify({ first_opened_at: opened, updated_at: opened })
  });
  item.first_opened_at = opened;
}

async function buildPdf(titleValue: string, patientDocument: PatientDocument, materialDateValue?: string) {
  const pdf = await PDFDocument.create();
  pdf.setTitle(pdfSafe(titleValue));
  pdf.setAuthor("Carolina Sánchez Girona");
  pdf.setSubject("Material entre sesiones");
  pdf.setCreator("carolinasanchezgirona.com");

  const bodyFont = await pdf.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdf.embedFont(StandardFonts.HelveticaBold);
  const titleFont = await pdf.embedFont(StandardFonts.TimesRomanBold);

  const A4: [number, number] = [595.28, 841.89];
  const marginX = 58;
  const bottom = 58;
  const maxWidth = A4[0] - marginX * 2;
  const navy = rgb(23 / 255, 58 / 255, 94 / 255);
  const turquoise = rgb(8 / 255, 166 / 255, 160 / 255);
  const ink = rgb(36 / 255, 55 / 255, 70 / 255);
  const muted = rgb(107 / 255, 124 / 255, 135 / 255);
  const lineColor = rgb(215 / 255, 229 / 255, 238 / 255);
  const sky = rgb(234 / 255, 246 / 255, 251 / 255);
  const warm = rgb(1, 248 / 255, 238 / 255);

  let current = pdf.addPage(A4);
  let y = A4[1] - 62;

  function wrap(font: any, text: string, size: number, width: number) {
    const result: string[] = [];
    for (const paragraph of pdfSafe(text).split(/\n/)) {
      if (!paragraph.trim()) { result.push(""); continue; }
      const words = paragraph.trim().split(/\s+/);
      let lineText = "";
      for (const word of words) {
        const candidate = lineText ? lineText + " " + word : word;
        if (font.widthOfTextAtSize(candidate, size) <= width) {
          lineText = candidate;
          continue;
        }
        if (lineText) result.push(lineText);
        if (font.widthOfTextAtSize(word, size) <= width) {
          lineText = word;
          continue;
        }
        let chunk = "";
        for (const char of word) {
          const next = chunk + char;
          if (font.widthOfTextAtSize(next, size) > width && chunk) {
            result.push(chunk);
            chunk = char;
          } else chunk = next;
        }
        lineText = chunk;
      }
      if (lineText) result.push(lineText);
    }
    return result;
  }

  function newPage() {
    current = pdf.addPage(A4);
    y = A4[1] - 62;
    current.drawRectangle({ x: 0, y: A4[1] - 8, width: A4[0], height: 8, color: turquoise });
    current.drawText("ENTRE SESIONES", { x: marginX, y, size: 8.5, font: boldFont, color: turquoise });
    current.drawText("Carolina Sánchez Girona", { x: A4[0] - marginX - 115, y, size: 7.8, font: bodyFont, color: muted });
    y -= 30;
  }

  function ensureSpace(height: number) {
    if (y - height < bottom) newPage();
  }

  function drawParagraph(text: string, options: { size?: number; leading?: number; font?: any; color?: any; indent?: number } = {}) {
    if (!text) return;
    const size = options.size ?? 10.5;
    const leading = options.leading ?? 15.2;
    const font = options.font ?? bodyFont;
    const color = options.color ?? ink;
    const indent = options.indent ?? 0;
    const lines = wrap(font, text, size, maxWidth - indent);
    for (const lineText of lines) {
      if (!lineText) { y -= leading * .65; continue; }
      ensureSpace(leading + 6);
      current.drawText(lineText, { x: marginX + indent, y, size, font, color });
      y -= leading;
    }
  }

  function drawSection(heading: string, text: string, highlighted = false, warmBox = false) {
    if (!text) return;
    const bodyLines = wrap(bodyFont, text, 10.4, highlighted ? maxWidth - 30 : maxWidth);
    const estimated = 27 + Math.min(bodyLines.length, 8) * 15;
    ensureSpace(Math.min(estimated, 170));
    if (highlighted && bodyLines.length <= 8) {
      const boxHeight = 30 + bodyLines.length * 15.2;
      current.drawRectangle({ x: marginX, y: y - boxHeight + 8, width: maxWidth, height: boxHeight, color: warmBox ? warm : sky });
      current.drawRectangle({ x: marginX, y: y - boxHeight + 8, width: 4, height: boxHeight, color: turquoise });
      current.drawText(pdfSafe(heading).toUpperCase(), { x: marginX + 16, y: y - 10, size: 9.2, font: boldFont, color: navy });
      y -= 32;
      for (const lineText of bodyLines) {
        current.drawText(lineText, { x: marginX + 16, y, size: 10.4, font: bodyFont, color: ink });
        y -= 15.2;
      }
      y -= 13;
      return;
    }
    current.drawText(pdfSafe(heading).toUpperCase(), { x: marginX, y, size: 9.4, font: boldFont, color: navy });
    y -= 20;
    drawParagraph(text);
    y -= 10;
    current.drawLine({ start: { x: marginX, y }, end: { x: A4[0] - marginX, y }, thickness: .6, color: lineColor });
    y -= 18;
  }

  function drawWorkArea(linesCount = 7) {
    ensureSpace(linesCount * 24 + 18);
    current.drawText("ESPACIO PARA TUS NOTAS", { x: marginX, y, size: 8.8, font: boldFont, color: navy });
    y -= 18;
    for (let index = 0; index < linesCount; index++) {
      current.drawLine({ start: { x: marginX, y }, end: { x: A4[0] - marginX, y }, thickness: .55, color: lineColor });
      y -= 24;
      if (y < bottom + 20 && index < linesCount - 1) newPage();
    }
    y -= 4;
  }

  current.drawRectangle({ x: 0, y: A4[1] - 8, width: A4[0], height: 8, color: turquoise });
  current.drawText("ENTRE SESIONES", { x: marginX, y, size: 9, font: boldFont, color: turquoise });
  current.drawText("Carolina Sánchez Girona", { x: A4[0] - marginX - 115, y, size: 7.8, font: bodyFont, color: muted });
  y -= 38;

  async function drawVisualResources(raw: VisualBlock[] | undefined) {
    const blocks = normalizeVisualBlocks(raw);
    if (!blocks.length) return;
    drawSection("Recursos visuales", "Observa los estímulos y sigue las consignas acordadas en sesión.");
    function rowCells(values: string[], count: number, header = false, height = 33) {
      ensureSpace(height + 8);
      const width = maxWidth / count;
      values.forEach((value, i) => {
        const x = marginX + i * width;
        current.drawRectangle({ x, y: y - height + 7, width, height, borderColor: lineColor, borderWidth: .7, ...(header ? { color: sky } : {}) });
        wrap(header ? boldFont : bodyFont, value, 8.2, width - 10).slice(0, 2).forEach((line, j) => {
          current.drawText(line, { x: x + 5, y: y - 8 - j * 11, size: 8.2, font: header ? boldFont : bodyFont, color: ink });
        });
      });
      y -= height;
    }
    for (const block of blocks) {
      ensureSpace(65);
      drawParagraph(block.title.toUpperCase(), { size: 10, leading: 15, font: boldFont, color: navy });
      y -= 8;
      if (block.type === "image" && block.data) {
        try {
          const bytes = Uint8Array.from(atob(block.data.split(",")[1]), char => char.charCodeAt(0));
          const picture = block.data.startsWith("data:image/png") ? await pdf.embedPng(bytes) : await pdf.embedJpg(bytes);
          const factor = Math.min(maxWidth / picture.width, 200 / picture.height, 1);
          const width = picture.width * factor, height = picture.height * factor;
          ensureSpace(height + 22);
          current.drawImage(picture, { x: marginX, y: y - height, width, height });
          y -= height + 12;
          drawParagraph(block.alt || "", { size: 8.5, leading: 12, color: muted });
        } catch { drawParagraph("Imagen no disponible en PDF. Verifica el original antes de prescribir."); }
      } else if (block.type === "table") {
        const rows = matrix(block);
        const count = rows[0]?.length || 0;
        if (count >= 2 && count <= 6 && rows.length >= 2 && rows.every(row => row.length === count)) {
          rows.forEach((row, i) => rowCells(row, count, i === 0));
        }
      } else if (block.type === "chart") {
        const pairs = matrix(block).filter(row => row.length === 2 && row[0] && Number.isFinite(Number(row[1])) && Number(row[1]) >= 0 && Number(row[1]) <= 10000).slice(0, 8);
        const maximum = Math.max(1, ...pairs.map(row => Number(row[1])));
        for (const row of pairs) {
          ensureSpace(44);
          drawParagraph(row[0] + ": " + row[1], { size: 9.2, leading: 13 });
          current.drawRectangle({ x: marginX, y: y - 11, width: maxWidth, height: 10, color: sky });
          const barWidth = Number(row[1]) / maximum * maxWidth;
          if (barWidth > 0) current.drawRectangle({ x: marginX, y: y - 11, width: barWidth, height: 10, color: turquoise });
          y -= 22;
        }
      } else if (block.type === "diagram") {
        const steps = (block.content || "").split(/\r?\n/).map(step => step.trim()).filter(Boolean).slice(0, 8);
        for (const [i, step] of steps.entries()) {
          const lines = wrap(bodyFont, step, 9, maxWidth - 38).slice(0, 5);
          const height = 18 + lines.length * 13;
          ensureSpace(height + 8);
          current.drawRectangle({ x: marginX, y: y - height + 7, width: maxWidth, height, color: sky });
          current.drawText((i + 1) + ".", { x: marginX + 10, y: y - 11, font: boldFont, size: 9.5, color: navy });
          lines.forEach((line, j) => current.drawText(line, { x: marginX + 34, y: y - 11 - j * 13, font: bodyFont, size: 9, color: ink }));
          y -= height + 5;
        }
      } else if (block.type === "calendar") {
        const cal = getCalendar(block.content || "");
        if (cal) {
          drawParagraph(String(cal.month).padStart(2, "0") + "/" + cal.year, { font: boldFont });
          rowCells(["L", "M", "X", "J", "V", "S", "D"], 7, true, 27);
          const count = Math.ceil((cal.days + cal.offset) / 7) * 7;
          for (let i = 0; i < count; i += 7) rowCells(Array.from({ length: 7 }, (_, j) => {
            const day = i + j + 1 - cal.offset;
            return day > 0 && day <= cal.days ? String(day) : "";
          }), 7, false, 29);
          for (const [day, label] of cal.events.entries()) drawParagraph(day + ": " + label, { size: 9, leading: 12 });
        }
      }
      y -= 14;
    }
  }

  if (materialDateValue) {
    let issuedLabel = "";
    try {
      issuedLabel = new Intl.DateTimeFormat("es-ES", { day: "numeric", month: "short", year: "numeric", timeZone: "Europe/Madrid" }).format(new Date(materialDateValue));
    } catch {}
    if (issuedLabel) {
      current.drawText("Material acordado en sesión · " + pdfSafe(issuedLabel), { x: marginX, y, size: 8.4, font: bodyFont, color: muted });
      y -= 22;
    }
  }

  const titleLines = wrap(titleFont, titleValue, 25, maxWidth);
  for (const titleLine of titleLines) {
    ensureSpace(34);
    current.drawText(titleLine, { x: marginX, y, size: 25, font: titleFont, color: navy });
    y -= 31;
  }
  y -= 2;

  const metaValues: string[] = [];
  if (patientDocument.duration_minutes) metaValues.push("Tiempo aproximado: " + patientDocument.duration_minutes + " min");
  if (patientDocument.frequency) metaValues.push(pdfSafe(patientDocument.frequency));
  if (metaValues.length) {
    drawParagraph(metaValues.join(" · "), { size: 8.8, leading: 13, font: boldFont, color: muted });
    y -= 7;
  }

  drawParagraph(patientDocument.introduction || "", { size: 11.4, leading: 17, color: rgb(64 / 255, 87 / 255, 102 / 255) });
  y -= 18;

  const whyHeading = patientDocument.material_type === "psychoeducation" ? "Por qué este material puede ayudarte" : "Por qué hacemos este ejercicio";
  drawSection(whyHeading, patientDocument.why || "", true);
  drawSection("Qué vamos a observar o entrenar", patientDocument.objective || "");
  drawSection(patientDocument.material_type === "psychoeducation" ? "Contenido" : "Cómo hacerlo", patientDocument.instructions || "");
  drawSection("Ejemplo", patientDocument.example || "");
  await drawVisualResources(patientDocument.visual_blocks);
  drawSection("Tu registro / espacio para trabajar", patientDocument.record_prompt || "");
  if (patientDocument.record_prompt && patientDocument.material_type !== "psychoeducation") drawWorkArea(7);
  drawSection("Si resulta demasiado intenso", patientDocument.safety_note || "", true, true);
  drawSection("Qué conviene recordar", patientDocument.remember || "", true);

  const questions = (patientDocument.session_questions || []).map((item) => "- " + item).join("\n");
  drawSection("Para comentar en sesión", questions);

  const pages = pdf.getPages();
  pages.forEach((pageItem, index) => {
    pageItem.drawLine({ start: { x: marginX, y: 38 }, end: { x: A4[0] - marginX, y: 38 }, thickness: .5, color: lineColor });
    pageItem.drawText("Carolina Sánchez Girona · Psicología Sanitaria y Neuropsicología · carolinasanchezgirona.com", {
      x: marginX, y: 23, size: 6.9, font: bodyFont, color: muted
    });
    pageItem.drawText(String(index + 1) + "/" + String(pages.length), {
      x: A4[0] - marginX - 22, y: 23, size: 6.9, font: bodyFont, color: muted
    });
  });

  return await pdf.save();
}

async function pdfResponse(title: string, doc: PatientDocument, dateValue?: string, extraHeaders: Record<string,string> = {}) {
  const bytes = await buildPdf(title, doc, dateValue);
  return new Response(bytes, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=\"entre-sesiones-" + slug(title) + ".pdf\"",
      "Cache-Control": "no-store",
      "Referrer-Policy": "no-referrer",
      "X-Content-Type-Options": "nosniff",
      ...extraHeaders
    }
  });
}

async function adminPreview(req: Request) {
  if (!await verifyOwner(req)) {
    return new Response(JSON.stringify({ error: "No autorizado" }), { status: 403, headers: { ...corsHeaders(), "Content-Type": "application/json" } });
  }
  let body: Record<string, unknown>;
  try { body = await req.json(); }
  catch {
    return new Response(JSON.stringify({ error: "JSON no válido" }), { status: 400, headers: { ...corsHeaders(), "Content-Type": "application/json" } });
  }
  const title = String(body.title ?? "").trim();
  if (!title) return new Response(JSON.stringify({ error: "Falta el título" }), { status: 400, headers: { ...corsHeaders(), "Content-Type": "application/json" } });
  const doc = normalizePatientDocument(body.patient_document, String((body.patient_document as Record<string,unknown> | undefined)?.instructions ?? ""));
  if (!doc.instructions) return new Response(JSON.stringify({ error: "Falta el contenido" }), { status: 400, headers: { ...corsHeaders(), "Content-Type": "application/json" } });

  if (body.format === "pdf") {
    return await pdfResponse(title, doc, new Date().toISOString(), corsHeaders());
  }

  const previewId = "preview";
  const previewItem: MaterialRow = {
    id: previewId,
    title,
    content: doc.instructions || "",
    patient_document: doc,
    created_at: new Date().toISOString(),
    patient_state: "pending"
  };
  let materials: MaterialRow[] = [previewItem];
  const patientId = String(body.patient_id ?? "");
  if (/^[0-9a-f-]{36}$/i.test(patientId)) {
    const existing = await patientMaterials(patientId);
    materials = [previewItem, ...existing.filter((item) => item.title !== title).slice(0, 20)];
  }
  return page("Vista previa · Entre Sesiones", portalHtml(materials, previewItem, null, true), 200, corsHeaders());
}

async function updatePatientSubmission(req: Request) {
  const form = await req.formData();
  const token = String(form.get("token") ?? "");
  const materialId = String(form.get("material") ?? "");
  const seed = await findSeedByToken(token);
  if (!seed?.patient_id) return page("Enlace caducado", "<main class=\"shell\"><article class=\"card\"><div class=\"content\"><p class=\"eyebrow\">ENTRE SESIONES</p><h1>Este enlace ya no está disponible</h1><p>Solicita un nuevo enlace a tu profesional.</p></div></article></main>", 410);
  const materials = await patientMaterials(seed.patient_id);
  const selected = materials.find((item) => item.id === materialId);
  if (!selected) return page("Material no disponible", "<main class=\"shell\"><article class=\"card\"><div class=\"content\"><h1>Este material no está disponible</h1></div></article></main>", 404);

  const now = new Date().toISOString();
  const responseAction = String(form.get("response_action") ?? "");
  let payload: Record<string, unknown>;

  if (responseAction === "draft" || responseAction === "share") {
    const doc = normalizePatientDocument(selected.patient_document, selected.content);
    if (doc.material_type === "psychoeducation") return page("Solicitud no válida", "<main class=\"shell\"><article class=\"card\"><div class=\"content\"><h1>Este material no requiere respuestas.</h1></div></article></main>", 400);
    const questions = (doc.session_questions || []).slice(0, 6);
    const record = String(form.get("response_record") ?? "").slice(0, 12000);
    const answers = questions.map((_, index) => String(form.get("response_question_" + index) ?? "").slice(0, 6000));
    payload = {
      patient_response: { version: 1, record, answers },
      patient_response_status: responseAction === "share" ? "shared" : "draft",
      patient_response_updated_at: now,
      patient_response_shared_at: responseAction === "share" ? now : null,
      updated_at: now
    };
  } else {
    const patientState = String(form.get("patient_state") ?? "");
    if (!["pending","reviewed","discuss"].includes(patientState)) return page("Solicitud no válida", "<main class=\"shell\"><article class=\"card\"><div class=\"content\"><h1>Solicitud no válida</h1></div></article></main>", 400);
    payload = { patient_state: patientState, patient_state_at: now, updated_at: now };
  }

  const update = await fetch(SUPABASE_URL + "/rest/v1/clinical_exercise_assignments?id=eq." + encodeURIComponent(selected.id), {
    method: "PATCH",
    headers: { ...serviceHeaders, Prefer: "return=minimal" },
    body: JSON.stringify(payload)
  });
  if (!update.ok) return page("No se ha podido guardar", "<main class=\"shell\"><article class=\"card\"><div class=\"content\"><h1>No se ha podido guardar</h1><p>Vuelve a intentarlo.</p></div></article></main>", 502);

  const redirect = new URL(SUPABASE_URL + "/functions/v1/view-clinical-exercise");
  redirect.searchParams.set("token", token);
  redirect.searchParams.set("material", selected.id);
  return new Response(null, { status: 303, headers: { Location: redirect.toString(), "Cache-Control": "no-store" } });
}


/** Internal renderer: no bearer URLs, no patients query, no client-side service keys. */
async function renderAuthenticatedPortalPdf(req: Request): Promise<Response> {
  if (!SERVICE_ROLE_KEY || req.headers.get("Authorization") !== "Bearer " + SERVICE_ROLE_KEY) {
    return new Response(JSON.stringify({ error: "No autorizado." }), {
      status: 403, headers: { "Content-Type": "application/json", "Cache-Control": "no-store" }
    });
  }
  if (Number(req.headers.get("content-length") || "0") > 180000) {
    return new Response(JSON.stringify({ error: "Contenido demasiado extenso." }), { status: 413, headers: { "Content-Type": "application/json", "Cache-Control": "no-store" } });
  }
  let input: Record<string, unknown>;
  try { input = await req.json(); }
  catch { return new Response(JSON.stringify({ error: "Solicitud no válida." }), { status: 400, headers: { "Content-Type": "application/json", "Cache-Control": "no-store" } }); }
  if (input.action !== "portal-pdf" || typeof input.title !== "string" || !input.title.trim() || input.title.length > 250) {
    return new Response(JSON.stringify({ error: "Solicitud no válida." }), { status: 400, headers: { "Content-Type": "application/json", "Cache-Control": "no-store" } });
  }
  const content = typeof input.content === "string" ? input.content.slice(0, 100000) : "";
  const doc = normalizePatientDocument(input.patient_document, content);
  if (!doc.instructions) return new Response(JSON.stringify({ error: "Material vacío." }), { status: 422, headers: { "Content-Type": "application/json", "Cache-Control": "no-store" } });
  try {
    return await pdfResponse(input.title.trim(), doc,
      typeof input.issued_at === "string" ? input.issued_at : undefined, {
        "Cache-Control": "private, no-store, max-age=0",
        "X-Robots-Tag": "noindex, nofollow, noarchive",
      });
  } catch (error) {
    console.error("[portal-pdf] Error generating PDF", error instanceof Error ? error.name : "Unknown");
    return new Response(JSON.stringify({ error: "No se ha podido generar el PDF." }), { status: 500, headers: { "Content-Type": "application/json", "Cache-Control": "no-store" } });
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders() });
  if (req.method === "POST" && req.headers.get("x-portal-pdf") === "1") return await renderAuthenticatedPortalPdf(req);
  // Legacy bearer links are retired: clinical material must be opened through the authenticated patient portal.
  // Never reuse URL bearer tokens to render material or accept clinical responses.
  if (req.method === "GET") {
    return new Response(null, { status: 302, headers: {
      "Location": "https://carolinasanchezgirona.com/mi-espacio/",
      "Cache-Control": "no-store", "Referrer-Policy": "no-referrer", "X-Robots-Tag": "noindex, nofollow"
    } });
  }
  if (req.method === "POST") {
    const legacyType = req.headers.get("content-type") ?? "";
    if (legacyType.includes("application/x-www-form-urlencoded") || legacyType.includes("multipart/form-data")) {
      return page("Acceso actualizado", "<main class=\"shell\"><article class=\"card\"><div class=\"content\"><h1>Acceso actualizado</h1><p>Para consultar o responder a tus ejercicios, inicia sesión en Mi espacio con tu correo y contraseña.</p><p><a href=\"https://carolinasanchezgirona.com/mi-espacio/\">Entrar en Mi espacio</a></p></div></article></main>", 410, { "Cache-Control": "no-store", "Referrer-Policy": "no-referrer" });
    }
  }


  if (req.method === "POST") {
    const contentType = req.headers.get("content-type") ?? "";
    if (contentType.includes("application/json")) return await adminPreview(req);
    if (contentType.includes("application/x-www-form-urlencoded") || contentType.includes("multipart/form-data")) return await updatePatientSubmission(req);
    return new Response(JSON.stringify({ error: "Formato no permitido" }), { status: 415, headers: { ...corsHeaders(), "Content-Type": "application/json" } });
  }

  if (req.method !== "GET") {
    return page("Método no permitido", "<main class=\"shell\"><article class=\"card\"><div class=\"content\"><h1>Método no permitido</h1></div></article></main>", 405);
  }

  const url = new URL(req.url);
  const token = url.searchParams.get("token") ?? "";
  const seed = await findSeedByToken(token);
  if (!seed?.patient_id) {
    return page("Enlace no válido", "<main class=\"shell\"><article class=\"card\"><div class=\"content\"><p class=\"eyebrow\">ENTRE SESIONES</p><h1>Este enlace ya no está disponible</h1><p>Solicita un nuevo enlace a tu profesional.</p></div></article></main>", 410);
  }

  const materials = await patientMaterials(seed.patient_id);
  if (!materials.length) {
    return page("Sin materiales", "<main class=\"shell\"><article class=\"card\"><div class=\"content\"><p class=\"eyebrow\">ENTRE SESIONES</p><h1>No hay materiales disponibles</h1><p>Consulta con tu profesional si esperabas encontrar alguno.</p></div></article></main>", 404);
  }

  const requestedId = url.searchParams.get("material") ?? "";
  const selected = materials.find((item) => item.id === requestedId) || materials.find((item) => item.id === seed.id) || materials[0];
  await markOpened(selected);
  const doc = normalizePatientDocument(selected.patient_document, selected.content);

  if (url.searchParams.get("format") === "pdf") {
    try {
      return await pdfResponse(selected.title, doc, selected.sent_at || selected.created_at || undefined);
    } catch (error) {
      console.error("Clinical PDF generation failed", error instanceof Error ? error.message : "Unknown");
      return page("PDF no disponible", "<main class=\"shell\"><article class=\"card\"><div class=\"content\"><h1>No se ha podido generar el PDF</h1><p>Puedes seguir consultando el material online y solicitar ayuda a tu profesional si el problema continúa.</p></div></article></main>", 500);
    }
  }

  return page("Entre Sesiones", portalHtml(materials, selected, token, false));
});
