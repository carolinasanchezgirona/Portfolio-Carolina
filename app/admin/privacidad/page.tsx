import type { Metadata } from "next";
import Script from "next/script";
import AdminWorkspaceNav from "../workspace-nav";
import "./privacy-incidents.css";

export const metadata: Metadata = {
  title: "Protección de datos · Registro de incidencias | Administración",
  robots: { index: false, follow: false, nocache: true },
};

export default function PrivacyIncidentsPage() {
  return <main id="admin-main-content" className="privacy-incidents">
    <AdminWorkspaceNav active="privacidad" />
    <header className="privacy-head">
      <p className="privacy-overline">Administración · Acceso restringido</p>
      <h1>Protección de datos e incidencias</h1>
      <p>Registro interno de brechas, decisiones, medidas de contención y documentación probatoria. Independiente de las fichas clínicas.</p>
    </header>
    <section className="privacy-gate" id="privacy-gate" role="status" aria-live="polite">
      Verificando sesión administrativa y permisos…
    </section>
    <section id="privacy-private" hidden>
      <div className="privacy-title">
        <h2>Registro de incidencias</h2>
        <button id="privacy-refresh" type="button">Actualizar</button>
      </div>
      <div id="privacy-records" className="privacy-records" aria-live="polite" />
      <section id="privacy-details" hidden className="privacy-details">
        <h2>Actuaciones y evidencia</h2>
        <p className="privacy-help">Los eventos registrados son inmutables. No incluyas nombres de pacientes en títulos o nombres de archivo.</p>
        <div id="privacy-evidence" className="privacy-evidence"/>
        <label className="privacy-field">Adjuntar el informe interno original (PDF o Word)
          <input id="privacy-file" type="file" accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" />
        </label>
        <button type="button" id="privacy-upload" className="privacy-primary">Guardar documento en archivo privado</button>
        <p id="privacy-upload-status" role="status" aria-live="polite"/>
        <form id="privacy-event-form">
          <label className="privacy-field">Actuación documentada
            <select id="privacy-event-type" required>
              <option value="verification">Verificación de versiones y copias</option>
              <option value="support">Solicitud a plataforma / proveedor</option>
              <option value="risk">Evaluación del riesgo</option>
              <option value="notification">Decisión sobre notificación</option>
              <option value="containment">Contención</option>
              <option value="followup">Seguimiento</option>
            </select>
          </label>
          <label className="privacy-field">Descripción y resultado
            <textarea id="privacy-event-detail" required rows={4} maxLength={5000} placeholder="Hechos constatados, pruebas consultadas y actuaciones pendientes. No incluyas identificadores innecesarios."/>
          </label>
          <button type="submit" className="privacy-primary">Registrar actuación</button>
          <p id="privacy-event-status" role="status" aria-live="polite"/>
        </form>
        <h3>Historial verificable</h3>
        <div id="privacy-event-log"/>
      </section>
    </section>
    <p className="privacy-footer">Documentación interna confidencial. No se proporciona acceso desde la web pública ni desde el portal del paciente.</p>
    <Script src="/privacy-incident-register.js?v=20261110-1" strategy="afterInteractive" />
  </main>;
}