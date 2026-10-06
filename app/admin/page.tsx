import Script from "next/script";
import "./dashboard.css";

export default function AdminHomePage() {
  return (
    <main className="admin-home-page">
      <section id="admin-home" className="admin-home" hidden>
        <header className="admin-home-header">
          <div>
            <p className="admin-home-eyebrow">Dememoria · Área profesional</p>
            <h1>Inicio</h1>
            <p id="admin-home-date">Lo que necesita tu atención hoy.</p>
          </div>
          <nav className="admin-home-nav">
            <a href="/admin/clinica/?panel=1">Gestión clínica</a>
            <a href="/admin/agenda/">Agenda</a>
            <a href="/admin/articulos/">Artículos</a>
            <a href="/admin/preguntas/">Preguntas</a>
            <a href="/admin/recursos/">Recursos</a>
          </nav>
        </header>

        <p id="admin-home-status" className="admin-home-status" role="status" />
        <section id="admin-home-priorities" className="admin-home-priorities" aria-label="Prioridades" />

        <div className="admin-home-grid">
          <section className="admin-home-panel">
            <div className="admin-home-panel-heading"><div><p className="admin-home-eyebrow">Consulta</p><h2>Hoy</h2></div><a href="/admin/agenda/">Abrir agenda</a></div>
            <div id="admin-home-today" className="admin-home-list" />
          </section>
          <section className="admin-home-panel">
            <div className="admin-home-panel-heading"><div><p className="admin-home-eyebrow">Clínica</p><h2>Pendientes</h2></div><a href="/admin/clinica/?panel=1">Abrir clínica</a></div>
            <div id="admin-home-clinical" className="admin-home-list" />
          </section>
          <section className="admin-home-panel">
            <div className="admin-home-panel-heading"><div><p className="admin-home-eyebrow">Contenido</p><h2>Editorial</h2></div><a href="/admin/articulos/">Abrir editorial</a></div>
            <div id="admin-home-editorial" className="admin-home-list" />
          </section>
          <section className="admin-home-panel">
            <div className="admin-home-panel-heading"><div><p className="admin-home-eyebrow">Recursos</p><h2>Actividad comercial</h2></div><a href="/admin/recursos/">Abrir recursos</a></div>
            <div id="admin-home-commerce" className="admin-home-list" />
          </section>
        </div>
      </section>
      <Script src="/admin-dashboard.js?v=20261006-1" strategy="afterInteractive" />
    </main>
  );
}
