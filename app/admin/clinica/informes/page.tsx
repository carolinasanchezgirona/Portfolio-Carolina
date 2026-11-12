"use client";

import { useEffect, useState } from "react";
import AdminWorkspaceNav from "../../workspace-nav";
import "./informes.css";

type State = "checking" | "ready" | "error";
type ReportType = {
  id: string;
  title: string;
  subtitle: string;
  scope: string;
  screening: string[];
  sections: string[];
  safeguards: string[];
};

const reports: ReportType[] = [
  {
    id: "clinico",
    title: "Informe psicológico clínico",
    subtitle: "Documentación asistencial basada en la historia y evaluación disponibles",
    scope: "Para describir sintomatología, proceso asistencial, evolución e impacto funcional. No constituye automáticamente un nuevo proceso de evaluación ni una pericial.",
    screening: [
      "Comprobar quién solicita el documento y su finalidad concreta.",
      "Determinar si basta una copia o acceso a la documentación clínica existente, sin convertir ese derecho en un servicio de pago.",
      "Verificar que los hechos y conclusiones solicitados están respaldados por información clínica suficiente.",
      "Delimitar alcance, plazo y presupuesto solo cuando se encargue un trabajo profesional adicional."
    ],
    sections: [
      "Datos profesionales e identificación de la persona evaluada",
      "Finalidad y destinatario declarado del informe",
      "Fuentes de información y periodo asistencial documentado",
      "Antecedentes pertinentes y motivo de consulta",
      "Exploración clínica, resultados disponibles y evolución",
      "Repercusión funcional observada o referida, indicando la fuente",
      "Integración clínica, conclusiones proporcionadas y limitaciones",
      "Fecha, firma, número de colegiación y condiciones de uso"
    ],
    safeguards: [
      "No afirmar causalidad ni incapacidad laboral basándose solo en el relato del paciente.",
      "Distinguir observación clínica, autoinforme y documentación de terceros.",
      "No presentar el informe asistencial como dictamen pericial independiente."
    ]
  },
  {
    id: "psicologica",
    title: "Evaluación psicológica con informe",
    subtitle: "Nuevo encargo de evaluación con una pregunta clínica definida",
    scope: "Para una valoración clínica y funcional nueva, que requiere selección individualizada de entrevista, instrumentos y fuentes relevantes.",
    screening: [
      "Identificar la pregunta de evaluación y descartar que ya exista una valoración equivalente.",
      "Comprobar los requisitos de la entidad destinataria antes de presupuestar.",
      "Informar del procedimiento, límites, confidencialidad y posibles usos del resultado.",
      "Pactar las sesiones, pruebas necesarias, devolución y presupuesto individual."
    ],
    sections: [
      "Objeto y alcance de la evaluación",
      "Procedimiento, fechas y fuentes consultadas",
      "Antecedentes y entrevista clínica",
      "Observación conductual e instrumentos administrados",
      "Resultados psicométricos con baremos y límites aplicables",
      "Integración diagnóstica, hipótesis alternativas e impacto funcional",
      "Conclusiones, recomendaciones y limitaciones",
      "Firma profesional y fecha de emisión"
    ],
    safeguards: [
      "No utilizar paquetes de pruebas indiscriminados ni atribuir diagnósticos por una sola escala.",
      "Respetar las evaluaciones de TDAH, TEA y otras ya tarifadas, sin duplicar el mismo informe.",
      "La evaluación no garantiza el reconocimiento administrativo solicitado."
    ]
  },
  {
    id: "neuropsicologico",
    title: "Evaluación neuropsicológica e informe funcional",
    subtitle: "Memoria, deterioro cognitivo, autonomía y necesidades de apoyo",
    scope: "Para caracterizar capacidades preservadas, alteraciones cognitivas y su repercusión en actividades de la vida diaria, con la profundidad que exija el caso.",
    screening: [
      "Solicitar los requisitos del trámite: discapacidad, dependencia, coordinación sanitaria u otro.",
      "Delimitar la pregunta clínica y considerar informes neurológicos, funcionales y valoraciones previas.",
      "Seleccionar pruebas según edad, escolaridad, idioma, condiciones sensoriales y factores de confusión.",
      "Prever entrevista de informante y valoración de AVD/AIVD cuando estén indicadas y autorizadas."
    ],
    sections: [
      "Objeto y contexto de la solicitud",
      "Antecedentes neurológicos, médicos, emocionales y farmacológicos relevantes",
      "Fuentes documentales y entrevistas con fechas",
      "Pruebas, normas utilizadas y validez de la evaluación",
      "Resultados por dominios cognitivos y capacidades preservadas",
      "Funcionamiento cotidiano, AVD/AIVD y apoyos disponibles",
      "Integración clínica, diagnóstico diferencial y límites de inferencia",
      "Conclusiones funcionales, orientaciones y firma profesional"
    ],
    safeguards: [
      "La valoración privada no concede por sí misma discapacidad ni dependencia.",
      "Evitar inferencias automáticas sobre capacidad jurídica a partir de un cribado cognitivo.",
      "Derivar a Consultoría neuropsicológica los encargos específicamente judiciales."
    ]
  },
  {
    id: "juridico",
    title: "Valoración para finalidad jurídica",
    subtitle: "Derivación a la Consultoría neuropsicológica existente",
    scope: "Los informes técnicos y periciales se tramitan como un encargo diferenciado, sin mezclarlos con la relación asistencial ordinaria.",
    screening: [
      "Precisar la pregunta pericial, partes implicadas, destinatario y documentos disponibles.",
      "Comprobar independencia técnica y posibles conflictos de rol o intereses.",
      "Delimitar procedimiento, fuentes, entrevista, pruebas, ratificación y presupuesto.",
      "Verificar consentimiento, obligaciones legales y derechos de la persona valorada."
    ],
    sections: [
      "Identificación del encargo y preguntas periciales",
      "Declaración de fuentes, independencia y posibles limitaciones",
      "Método, entrevistas, observación y pruebas empleadas",
      "Resultados cognitivos, funcionales y análisis de consistencia",
      "Discusión técnica vinculada a la pregunta pericial",
      "Conclusiones acotadas, limitaciones y documentación pertinente",
      "Firma, fecha, identificación profesional y anexos"
    ],
    safeguards: [
      "No formular conclusiones jurídicas ni prometer resultados procesales.",
      "No convertir automáticamente al terapeuta tratante en perito independiente.",
      "Mantener la ratificación y los costes adicionales separados del presupuesto inicial."
    ]
  }
];

const SUPABASE_URL = "https://grgyvdxkjdstdyumdfyg.supabase.co";
const PUBLISHABLE_KEY = "sb_publishable_b2MRfP0bPti87V2FXCzHGw_Y9vvcbii";
const OWNER_ID = "9d2cfdb1-fed6-4f76-b47a-d58507eb14f2";
const SESSION_KEY = "dememoria_admin_session";
const LOGIN = "/admin/clinica/acceso/?next=%2Fadmin%2Fclinica%2Finformes%2F";

async function verifyProfessionalAccess(): Promise<void> {
  let session: { access_token?: string } | null = null;
  try { session = JSON.parse(sessionStorage.getItem(SESSION_KEY) || "null"); } catch { /* Sesión inválida */ }
  if (!session?.access_token) {
    window.location.replace(LOGIN);
    throw new Error("Es necesario acceder con la cuenta profesional.");
  }
  const headers = { apikey: PUBLISHABLE_KEY, Authorization: "Bearer " + session.access_token };
  const userResponse = await fetch(SUPABASE_URL + "/auth/v1/user", { headers, cache: "no-store" });
  if (!userResponse.ok) {
    sessionStorage.removeItem(SESSION_KEY);
    window.location.replace(LOGIN);
    throw new Error("La sesión ha caducado.");
  }
  const user = await userResponse.json();
  if (user?.id !== OWNER_ID) {
    sessionStorage.removeItem(SESSION_KEY);
    window.location.replace(LOGIN);
    throw new Error("Cuenta no autorizada.");
  }
  const gate = await fetch(SUPABASE_URL + "/rest/v1/rpc/admin_mobile_gate", {
    method: "POST", headers: { ...headers, "Content-Type": "application/json" },
    body: "{}", cache: "no-store"
  });
  if (!gate.ok || await gate.json() !== true) {
    window.location.replace(LOGIN);
    throw new Error("Se requiere verificación de acceso profesional.");
  }
}

export default function ClinicalReportsPage() {
  const [status, setStatus] = useState<State>("checking");
  const [error, setError] = useState("");
  const [kind, setKind] = useState(reports[0].id);
  const [notice, setNotice] = useState("");
  const selected = reports.find(item => item.id === kind) || reports[0];

  useEffect(() => {
    let mounted = true;
    verifyProfessionalAccess().then(() => { if (mounted) setStatus("ready"); })
      .catch(cause => {
        if (!mounted) return;
        setError(cause instanceof Error ? cause.message : "No se ha podido comprobar el acceso.");
        setStatus("error");
      });
    return () => { mounted = false; };
  }, []);

  function copyStructure() {
    const content = [
      selected.title,
      selected.subtitle,
      "",
      ...selected.sections.map((line, index) => `${index + 1}. ${line}`),
      "",
      "Plantilla orientativa: revisión clínica profesional y adaptación a cada caso obligatorias."
    ].join("\n");
    if (!navigator.clipboard?.writeText) {
      setNotice("El navegador no permite copiar automáticamente. Puedes imprimir esta estructura.");
      return;
    }
    navigator.clipboard.writeText(content).then(
      () => setNotice("Estructura copiada. Revísala y adáptala antes de utilizarla."),
      () => setNotice("No ha sido posible copiar. Puedes utilizar la impresión.")
    );
  }

  return <main id="admin-main-content" className="clinical-reports">
    {status === "checking" && <div className="reports-gate" role="status">Verificando acceso profesional…</div>}
    {status === "error" && <div className="reports-gate" role="alert"><h1>No se ha podido abrir Informes y valoraciones</h1><p>{error}</p><a href={LOGIN}>Acceder al área profesional</a></div>}
    {status === "ready" && <>
      <div className="reports-no-print"><AdminWorkspaceNav active="informes" /></div>
      <header className="reports-header reports-no-print">
        <p className="reports-kicker">Gestión clínica · Evaluación</p>
        <h1>Informes y valoraciones</h1>
        <p>Guía de admisión y estructuras de informes. Forma parte del circuito de evaluación ya existente, no es un catálogo adicional con tarifas duplicadas.</p>
        <nav className="reports-links" aria-label="Enlaces clínicos relacionados">
          <a href="/admin/clinica/?panel=1&view=patients">Pacientes e historiales</a>
          <a href="/admin/clinica/protocolos/">Protocolos clínicos</a>
          <a href="/admin/clinica/documentacion/">Documentación</a>
        </nav>
      </header>
      <div className="reports-layout">
        <aside className="reports-selector reports-no-print">
          <h2>Modalidades</h2>
          {reports.map(item => <button type="button" key={item.id}
            className={item.id === selected.id ? "is-selected" : ""}
            aria-pressed={item.id === selected.id}
            onClick={() => { setKind(item.id); setNotice(""); }}>
            <strong>{item.title}</strong><span>{item.subtitle}</span>
          </button>)}
          <p>No se almacena ninguna información de pacientes en esta pantalla. La documentación debe elaborarse y guardarse en el expediente clínico autorizado.</p>
        </aside>
        <article className="reports-document">
          <p className="reports-kicker">Modelo orientativo · Revisión profesional obligatoria</p>
          <h2>{selected.title}</h2>
          <p className="reports-subtitle">{selected.scope}</p>
          <section>
            <h3>Antes de aceptar el encargo</h3>
            <ul>{selected.screening.map(item => <li key={item}>{item}</li>)}</ul>
          </section>
          <section>
            <h3>Estructura sugerida del informe</h3>
            <ol>{selected.sections.map(item => <li key={item}>{item}</li>)}</ol>
          </section>
          <section>
            <h3>Controles de calidad y alcance</h3>
            <ul>{selected.safeguards.map(item => <li key={item}>{item}</li>)}</ul>
          </section>
          <div className="reports-tools reports-no-print">
            <button type="button" onClick={copyStructure}>Copiar estructura</button>
            <button type="button" onClick={() => window.print()}>Imprimir / guardar PDF</button>
          </div>
          <p className="reports-notice" role="status" aria-live="polite">{notice}</p>
          <p className="reports-footnote">Esta biblioteca contiene modelos de consulta, no informes completos ni expedientes clínicos. No genera borradores vinculados al paciente ni registra entregas; utiliza los circuitos clínicos existentes para esas acciones.</p>
        </article>
      </div>
    </>}
  </main>;
}
