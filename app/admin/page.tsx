import Script from "next/script";
import type { Metadata } from "next";
import "./dashboard.css";

export const metadata: Metadata = {
  title: "Panel de administración | Carolina Sánchez Girona",
  description: "Acceso privado a las herramientas de gestión de la consulta Dememoria.",
  robots: { index: false, follow: false, nocache: true },
};

type IconName = "clinical" | "calendar" | "economy" | "editorial" | "resources" | "questions" | "arrow" | "shield";
function AdminIcon({ name }: { name: IconName }) {
  return (
    <svg className="admin-hub-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      {name === "clinical" && <><rect x="4" y="3" width="16" height="18" rx="3" /><path d="M9 3v3h6V3M12 10v7M8.5 13.5h7" /></>}
      {name === "calendar" && <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M7 3v4M17 3v4M3 10h18M8 14h3M8 17h3" /></>}
      {name === "economy" && <><rect x="5" y="3" width="14" height="18" rx="2" /><path d="M8 7h8M8 12h2M14 12h2M8 16h2M14 16h2" /></>}
      {name === "editorial" && <><path d="M4 4h16v16H4zM8 8h8M8 12h8M8 16h5" /></>}
      {name === "resources" && <><path d="M4 4h16v16H4zM8 4v16M12 8h5M12 12h5M12 16h4" /></>}
      {name === "questions" && <><path d="M20 11.5a8.5 8.5 0 0 1-8.5 8.5 9 9 0 0 1-4-.9L3 20l1.2-4.1a8.5 8.5 0 1 1 15.8-4.4Z" /><path d="M9.5 9a2.5 2.5 0 1 1 4.1 1.9c-.9.7-1.6 1.1-1.6 2.1M12 16h.01" /></>}
      {name === "arrow" && <><path d="M5 12h14M13 6l6 6-6 6" /></>}
      {name === "shield" && <><path d="m12 22-8-4V6l8-4 8 4v12l-8 4Z" /><path d="m9 12 2 2 4-4" /></>}
    </svg>
  );
}

const sections: { href: string; icon: IconName; eyebrow: string; title: string; detail: string; secondary: string; tone: string }[] = [
  { href: "/admin/clinica/?panel=1", icon: "clinical", eyebrow: "Atención sanitaria", title: "Gestión clínica", detail: "Pacientes, sesiones, informes, actividades y Mi espacio.", secondary: "Abrir gestión clínica", tone: "navy" },
  { href: "/admin/agenda/", icon: "calendar", eyebrow: "Organización", title: "Agenda", detail: "Citas, disponibilidad, cambios, confirmaciones y recordatorios.", secondary: "Abrir agenda", tone: "turquoise" },
  { href: "/admin/economia/", icon: "economy", eyebrow: "Administración", title: "Gestión económica", detail: "Facturas, cobros, gastos, importaciones y exportaciones.", secondary: "Abrir gestión económica", tone: "coral" },
  { href: "/admin/articulos/", icon: "editorial", eyebrow: "Comunicación", title: "Centro editorial", detail: "Artículos, contenidos web y publicaciones de Instagram.", secondary: "Abrir centro editorial", tone: "navy" },
  { href: "/admin/recursos/", icon: "resources", eyebrow: "Materiales digitales", title: "Recursos", detail: "Publicación, materiales gratuitos y de pago, pedidos y descargas.", secondary: "Administrar recursos", tone: "turquoise" },
  { href: "/admin/preguntas/", icon: "questions", eyebrow: "Participación", title: "Preguntas", detail: "Revisar, preparar y publicar las preguntas recibidas.", secondary: "Revisar preguntas", tone: "coral" },
];

export default function AdminHomePage() {
  return (
    <main className="admin-hub-page">
      <div id="admin-home-loading" className="admin-hub-access" role="status">Comprobando acceso a la administración…</div>
      <section id="admin-home" className="admin-home" hidden>
        <header className="admin-hub-topbar">
          <a href="/admin/" className="admin-hub-brand" aria-label="Panel de administración de Dememoria">
            <span className="admin-hub-mark" aria-hidden="true">D</span>
            <span><strong>Dememoria</strong><small>Área profesional · Carolina Sánchez Girona</small></span>
          </a>
          <div className="admin-hub-top-actions">
            <span className="admin-hub-private"><AdminIcon name="shield" /> Acceso privado</span>
            <button id="admin-home-refresh" className="admin-hub-outline" type="button">Actualizar</button>
            <button id="admin-home-logout" className="admin-hub-outline" type="button">Cerrar sesión</button>
          </div>
        </header>

        <div className="admin-hub-intro">
          <div>
            <p className="admin-home-eyebrow">Tu centro de trabajo</p>
            <h1>Panel de administración</h1>
            <p id="admin-home-date" className="admin-hub-date">Consulta y administración desde un mismo lugar.</p>
          </div>
          <a className="admin-hub-main-action" href="/admin/clinica/?panel=1"><AdminIcon name="clinical" /> Ir a Gestión clínica <AdminIcon name="arrow" /></a>
        </div>

        <section className="admin-hub-shortcut-area" aria-labelledby="admin-hub-shortcut-title">
          <div className="admin-hub-section-heading">
            <div><p className="admin-home-eyebrow">Acceso directo</p><h2 id="admin-hub-shortcut-title">Lo que más utilizas</h2></div>
          </div>
          <nav className="admin-hub-shortcuts" aria-label="Acciones rápidas">
            <a href="/admin/agenda/">Ver las citas</a>
            <a href="/admin/clinica/?panel=1">Buscar un paciente</a>
            <a href="/admin/economia/?tab=invoices&amp;nuevo=1">Crear un borrador de factura</a>
            <a href="/admin/articulos/">Preparar contenido</a>
          </nav>
        </section>

        <section className="admin-hub-modules" aria-labelledby="admin-hub-modules-title">
          <div className="admin-hub-section-heading">
            <div><p className="admin-home-eyebrow">Herramientas</p><h2 id="admin-hub-modules-title">Todas tus áreas de trabajo</h2></div>
            <p>Selecciona el apartado en el que quieras trabajar.</p>
          </div>
          <nav className="admin-hub-module-grid" aria-label="Módulos de administración">
            {sections.map(section => (
              <a key={section.href} href={section.href} className={"admin-hub-module admin-hub-tone-" + section.tone}>
                <span className="admin-hub-module-icon"><AdminIcon name={section.icon} /></span>
                <span className="admin-hub-module-label">{section.eyebrow}</span>
                <strong>{section.title}</strong>
                <span className="admin-hub-module-description">{section.detail}</span>
                <span className="admin-hub-module-open">{section.secondary}<AdminIcon name="arrow" /></span>
              </a>
            ))}
          </nav>
        </section>

        <section className="admin-hub-priority-section" aria-labelledby="admin-hub-priorities-title">
          <div className="admin-hub-section-heading">
            <div><p className="admin-home-eyebrow">Vista general</p><h2 id="admin-hub-priorities-title">De un vistazo</h2></div>
            <p id="admin-home-status" className="admin-home-status" role="status" aria-live="polite" />
          </div>
          <div id="admin-home-priorities" className="admin-home-priorities" aria-label="Indicadores actuales">
            <div className="admin-home-empty">Cargando indicadores…</div>
          </div>
        </section>

        <section className="admin-hub-details" aria-labelledby="admin-hub-details-title">
          <div className="admin-hub-section-heading">
            <div><p className="admin-home-eyebrow">Seguimiento diario</p><h2 id="admin-hub-details-title">Lo que requiere tu atención</h2></div>
          </div>
          <div className="admin-home-grid">
            <section className="admin-home-panel">
              <div className="admin-home-panel-heading"><div><p className="admin-home-eyebrow">Consulta</p><h3>Citas de hoy</h3></div><a href="/admin/agenda/">Ver agenda</a></div>
              <div id="admin-home-today" className="admin-home-list"><p className="admin-home-empty">Cargando…</p></div>
            </section>
            <section className="admin-home-panel">
              <div className="admin-home-panel-heading"><div><p className="admin-home-eyebrow">Seguimiento</p><h3>Tareas clínicas</h3></div><a href="/admin/clinica/?panel=1">Abrir clínica</a></div>
              <div id="admin-home-clinical" className="admin-home-list"><p className="admin-home-empty">Cargando…</p></div>
            </section>
            <section className="admin-home-panel">
              <div className="admin-home-panel-heading"><div><p className="admin-home-eyebrow">Economía</p><h3>Facturas y cobros</h3></div><a href="/admin/economia/">Abrir economía</a></div>
              <div id="admin-home-economy" className="admin-home-list"><p className="admin-home-empty">Cargando…</p></div>
            </section>
            <section className="admin-home-panel">
              <div className="admin-home-panel-heading"><div><p className="admin-home-eyebrow">Publicaciones</p><h3>Contenido editorial</h3></div><a href="/admin/articulos/">Abrir editor</a></div>
              <div id="admin-home-editorial" className="admin-home-list"><p className="admin-home-empty">Cargando…</p></div>
            </section>
            <section className="admin-home-panel">
              <div className="admin-home-panel-heading"><div><p className="admin-home-eyebrow">Productos digitales</p><h3>Ventas de recursos</h3></div><a href="/admin/recursos/">Abrir recursos</a></div>
              <div id="admin-home-commerce" className="admin-home-list"><p className="admin-home-empty">Cargando…</p></div>
            </section>
          </div>
        </section>
        <p className="admin-hub-footer-note">Panel exclusivo de la consulta. Las ventas de recursos digitales se muestran por separado de la facturación de servicios sanitarios.</p>
      </section>
      <Script src="/admin-dashboard.js?v=20261009-hub-1" strategy="afterInteractive" />
    </main>
  );
}
