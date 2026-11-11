"use client";

import { useEffect, useState } from "react";
import AdminWorkspaceNav from "../../workspace-nav";
import "./protocolos.css";

type ProtocolSection = { title: string; items: string[] };
type ClinicalProtocol = {
  slug: string; title: string; population: string; age_min: number;
  age_max: number | null; version: string; summary: string;
  sections: ProtocolSection[]; updated_at: string;
};
type LoadState = "loading" | "ready" | "error";

const URL_BASE = "https://grgyvdxkjdstdyumdfyg.supabase.co";
const PUBLISHABLE_KEY = "sb_publishable_b2MRfP0bPti87V2FXCzHGw_Y9vvcbii";
const SESSION_KEY = "dememoria_admin_session";
const OWNER_ID = "9d2cfdb1-fed6-4f76-b47a-d58507eb14f2";
const LOGIN_URL = "/admin/clinica/acceso/?next=%2Fadmin%2Fclinica%2Fprotocolos%2F";

function ageLabel(item: ClinicalProtocol) {
  return item.age_max == null ? String(item.age_min) + "+ años" : item.age_min + "–" + item.age_max + " años";
}

async function fetchAuthorizedProtocols(): Promise<ClinicalProtocol[]> {
  let session: { access_token?: string } | null = null;
  try { session = JSON.parse(sessionStorage.getItem(SESSION_KEY) || "null"); } catch { /* Invalid session. */ }
  if (!session?.access_token) {
    window.location.replace(LOGIN_URL);
    throw new Error("Se requiere iniciar sesión.");
  }

  const headers = { apikey: PUBLISHABLE_KEY, Authorization: "Bearer " + session.access_token };
  const userResponse = await fetch(URL_BASE + "/auth/v1/user", { headers, cache: "no-store" });
  if (!userResponse.ok) {
    sessionStorage.removeItem(SESSION_KEY);
    window.location.replace(LOGIN_URL);
    throw new Error("La sesión profesional ha caducado.");
  }
  const user = await userResponse.json();
  if (user?.id !== OWNER_ID) {
    sessionStorage.removeItem(SESSION_KEY);
    window.location.replace(LOGIN_URL);
    throw new Error("La cuenta no está autorizada.");
  }

  const gateResponse = await fetch(URL_BASE + "/rest/v1/rpc/admin_mobile_gate", {
    method: "POST",
    headers: { ...headers, "Content-Type": "application/json" },
    body: "{}",
    cache: "no-store"
  });
  if (!gateResponse.ok || await gateResponse.json() !== true) {
    window.location.replace(LOGIN_URL);
    throw new Error("Es necesaria la verificación de acceso profesional.");
  }

  const response = await fetch(
    URL_BASE + "/rest/v1/clinical_assessment_protocols?select=slug,title,population,age_min,age_max,version,summary,sections,updated_at&order=age_min.asc",
    { headers, cache: "no-store" }
  );
  if (!response.ok) throw new Error("No se ha podido abrir la biblioteca privada.");
  const data: unknown = await response.json();
  if (!Array.isArray(data)) throw new Error("La biblioteca ha devuelto una respuesta inesperada.");
  return data.filter((row): row is ClinicalProtocol =>
    typeof row?.slug === "string" &&
    typeof row?.title === "string" &&
    Array.isArray(row?.sections) &&
    row.sections.every((section: unknown) =>
      section !== null && typeof section === "object" &&
      typeof (section as ProtocolSection).title === "string" &&
      Array.isArray((section as ProtocolSection).items)
    )
  );
}

export default function NeuropsychologyProtocolsPage() {
  const [status, setStatus] = useState<LoadState>("loading");
  const [message, setMessage] = useState("");
  const [protocols, setProtocols] = useState<ClinicalProtocol[]>([]);
  const [selection, setSelection] = useState<string>("infantojuvenil-6-17");

  useEffect(() => {
    let cancelled = false;
    fetchAuthorizedProtocols().then(items => {
      if (cancelled) return;
      setProtocols(items);
      setStatus("ready");
      if (items.length && !items.some(x => x.slug === selection)) setSelection(items[0].slug);
    }).catch(error => {
      if (cancelled) return;
      setMessage(error instanceof Error ? error.message : "No se ha podido cargar el contenido.");
      setStatus("error");
    });
    return () => { cancelled = true; };
  // The initial selection is constant and must not trigger another authenticated request.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const active = protocols.find(item => item.slug === selection) || protocols[0] || null;
  return (
    <main id="admin-main-content" className="clinical-protocols-page">
      {status === "loading" && <div className="protocols-access" role="status">Comprobando el acceso profesional y cargando protocolos…</div>}
      {status === "error" && <div className="protocols-access" role="alert">
        <h1>No se ha podido abrir Protocolos clínicos</h1>
        <p>{message}</p>
        <a href="/admin/clinica/acceso/?next=%2Fadmin%2Fclinica%2Fprotocolos%2F">Acceder al área profesional</a>
        <button type="button" onClick={() => window.location.reload()}>Reintentar</button>
      </div>}
      {status === "ready" && <>
        <div className="protocols-no-print"><AdminWorkspaceNav active="protocolos" /></div>
        <header className="protocols-header protocols-no-print">
          <div>
            <p className="protocols-eyebrow">Gestión clínica · Consulta profesional</p>
            <h1>Protocolos clínicos</h1>
            <p>Biblioteca de valoración neuropsicológica. Contenido de trabajo, independiente de los historiales de pacientes.</p>
          </div>
          <a href="/admin/clinica/?panel=1">Volver a Gestión clínica</a>
        </header>
        {protocols.length === 0 ? <div className="protocols-empty">No hay protocolos disponibles para esta cuenta.</div> :
        <div className="protocols-layout">
          <nav className="protocols-choices protocols-no-print" aria-label="Seleccionar protocolo">
            <h2>Evaluaciones</h2>
            {protocols.map(item => <button type="button" key={item.slug}
              className={"protocols-choice" + (active?.slug === item.slug ? " is-selected" : "")}
              aria-current={active?.slug === item.slug ? "true" : undefined}
              onClick={() => setSelection(item.slug)}>
              <strong>{item.population}</strong>
              <span>{ageLabel(item)}</span>
              <small>Versión {item.version} · {item.sections.length} apartados</small>
            </button>)}
            <p className="protocols-private-note">Solo lectura. Los protocolos están guardados en la base de datos privada y no se comparten con pacientes.</p>
          </nav>
          {active && <article className="protocols-document" key={active.slug}>
            <div className="protocols-document-top">
              <div>
                <p className="protocols-eyebrow">Protocolo de trabajo · Versión {active.version}</p>
                <h2>{active.title}</h2>
                <p className="protocols-summary">{active.summary}</p>
                <div className="protocols-meta">
                  <span>Edad: {ageLabel(active)}</span><span>{active.sections.length} apartados</span>
                  <span>Revisión clínica previa al uso</span>
                </div>
              </div>
              <button className="protocols-print protocols-no-print" type="button" onClick={() => window.print()}>Imprimir / Guardar PDF</button>
            </div>
            <div className="protocols-sections">
              {active.sections.map((section, index) =>
                <details key={index} open={index === 0} className="protocols-section">
                  <summary><span>{section.title}</span><span className="protocols-chevron" aria-hidden="true">⌄</span></summary>
                  <div className="protocols-section-body">
                    <ul>{section.items.map((item, i) => <li key={i}>{item}</li>)}</ul>
                  </div>
                </details>
              )}
            </div>
            <p className="protocols-disclaimer">Documento clínico de orientación y consulta. Adaptar las pruebas a baremos, edad, idioma, hipótesis y disponibilidad; no sustituye el juicio profesional ni los manuales de aplicación de los instrumentos.</p>
          </article>}
        </div>}
      </>}
    </main>
  );
}
