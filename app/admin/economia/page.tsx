import Script from "next/script";
import type { Metadata } from "next";
import "./economia.css";
import EconomyImportTools from "./import-tools";

export const metadata: Metadata = {
  title: "Gestión económica | Carolina Sánchez Girona",
  description: "Panel privado de facturación y gastos de la consulta de Carolina Sánchez Girona.",
  robots: { index: false, follow: false, nocache: true },
};

export default function EconomiaPage() {
  return (
    <main className="econ-page">
      <div className="econ-container">
        <header className="econ-header">
          <div className="econ-brand">
            <span aria-hidden="true" className="econ-mark">D</span>
            <div>
              <p className="econ-eyebrow">Dememoria · Administración privada</p>
              <h1>Gestión económica</h1>
              <p>Facturas, cobros y gastos de carolinasanchezgirona.com</p>
            </div>
          </div>
          <nav aria-label="Administración" className="econ-top-links">
            <a href="/admin/clinica/?panel=1">Gestión clínica</a>
            <a href="/admin/agenda/">Agenda</a>
          </nav>
        </header>

        <section id="econ-access" className="econ-card" hidden>
          <h2>Acceso profesional</h2>
          <p>Necesitas una sesión de administración válida para ver datos económicos.</p>
          <a className="econ-button" href="/admin/clinica/acceso/">Iniciar sesión</a>
        </section>
        <p id="econ-status" role="status" aria-live="polite" className="econ-status">Comprobando acceso…</p>

        <div id="econ-content" hidden>
          <nav className="econ-tabs" aria-label="Secciones de economía">
            <button type="button" className="active" data-econ-tab="overview">Resumen</button>
            <button type="button" data-econ-tab="invoices">Facturas</button>
            <button type="button" data-econ-tab="expenses">Gastos</button>
            <button type="button" data-econ-tab="settings">Datos fiscales</button>
          </nav>

          <section data-econ-panel="overview">
            <div className="econ-section-heading">
              <div><p className="econ-eyebrow">Periodo actual</p><h2>Así va la consulta</h2></div>
              <div className="econ-actions">
                <label className="econ-inline-label">Mes <input type="month" id="econ-month" /></label>
                <button type="button" id="econ-refresh" className="econ-outline">Actualizar</button>
              </div>
            </div>
            <div className="econ-kpis">
              <article><span>Cobrado</span><strong id="econ-kpi-collected">0,00 €</strong></article>
              <article><span>Facturado</span><strong id="econ-kpi-issued">0,00 €</strong></article>
              <article><span>Pendiente de cobro</span><strong id="econ-kpi-pending">0,00 €</strong></article>
              <article><span>Gastos registrados</span><strong id="econ-kpi-expenses">0,00 €</strong></article>
            </div>
            <div className="econ-two-columns">
              <article className="econ-card">
                <h3>Resultado de caja orientativo</h3>
                <strong className="econ-balance" id="econ-kpi-balance">0,00 €</strong>
                <p>Entradas cobradas menos gastos registrados durante el mes seleccionado. No es el beneficio fiscal ni sustituye la contabilidad de la gestoría.</p>
              </article>
              <article className="econ-card">
                <h3>Qué queda por hacer</h3>
                <p id="econ-summary-note">Los borradores no cuentan como facturas emitidas. Los pagos se registran por separado.</p>
                <button type="button" className="econ-button" data-econ-goto="invoices">Preparar factura</button>
              </article>
            </div>
          </section>

          <section data-econ-panel="invoices" hidden>
            <div className="econ-section-heading">
              <div><p className="econ-eyebrow">Facturación de la consulta</p><h2>Facturas</h2></div>
              <div className="econ-actions">
                <button id="econ-export-invoices" type="button" className="econ-outline">Exportar facturas CSV</button>
                <button id="econ-new-invoice" type="button" className="econ-button">+ Nueva factura</button>
              </div>
            </div>
            <p className="econ-help">Primero se crea un borrador. Al emitir, el número y los datos fiscales quedan fijados; no se pueden editar ni eliminar desde la aplicación. No se envían facturas por correo automáticamente.</p>
            <form id="econ-invoice-form" className="econ-card" hidden>
              <h3>Preparar borrador</h3>
              <div className="econ-form-grid">
                <label>Paciente de la consulta <select id="econ-invoice-patient" required><option value="">Seleccionar paciente</option></select></label>
                <label>Cita asociada (opcional) <select id="econ-invoice-appointment"><option value="">Sin cita vinculada</option></select></label>
                <label>Destinatario de la factura <input id="econ-invoice-recipient" required maxLength={160} placeholder="Nombre y apellidos del pagador" /></label>
                <label>NIF/NIE del destinatario <input id="econ-invoice-nif" required maxLength={40} /></label>
                <label className="econ-span-full">Domicilio fiscal del destinatario <input id="econ-invoice-address" required maxLength={350} /></label>
                <label>Fecha de la prestación <input type="date" id="econ-invoice-date" required /></label>
                <label>Concepto administrativo <select id="econ-invoice-service">
                  <option value="Sesión de psicología sanitaria">Sesión de psicología sanitaria</option>
                  <option value="Sesión de neuropsicología clínica">Sesión de neuropsicología clínica</option>
                  <option value="Servicio sanitario profesional">Servicio sanitario profesional</option>
                  <option value="custom">Otro concepto (introducir manualmente)</option>
                </select></label>
                <label id="econ-custom-service-wrap" hidden>Concepto personalizado <input id="econ-invoice-custom-service" maxLength={250} /></label>
                <label>Unidades <input type="number" id="econ-invoice-quantity" min="1" max="50" step="1" defaultValue="1" required /></label>
                <label>Precio unitario (€) <input type="number" id="econ-invoice-price" min="0.01" max="100000" step="0.01" defaultValue="75.00" required /></label>
                <label className="econ-span-full">Tratamiento de IVA
                  <select id="econ-invoice-tax" required>
                    <option value="exempt_healthcare">Exento por asistencia sanitaria, art. 20.Uno.3.º LIVA (si procede)</option>
                    <option value="vat_21">IVA general 21 % (si corresponde)</option>
                  </select>
                </label>
              </div>
              <p className="econ-help">Comprueba que el servicio cumple los requisitos de exención. Este módulo inicial no contempla retenciones de IRPF, facturas con varias líneas ni rectificativas: esos casos deben gestionarse con un programa de facturación adaptado.</p>
              <div className="econ-actions">
                <button type="submit" className="econ-button">Guardar borrador</button>
                <button id="econ-invoice-cancel" type="button" className="econ-outline">Cancelar</button>
              </div>
            </form>
            <div id="econ-invoice-list" className="econ-list" />
          </section>

          <section data-econ-panel="expenses" hidden>
            <div className="econ-section-heading">
              <div><p className="econ-eyebrow">Solo actividad profesional de la consulta</p><h2>Gastos</h2></div>
              <button id="econ-export-expenses" type="button" className="econ-outline">Exportar gastos CSV</button>
            </div>
            <form id="econ-expense-form" className="econ-card">
              <h3>Registrar gasto</h3>
              <div className="econ-form-grid">
                <label>Fecha <input id="econ-expense-date" type="date" required /></label>
                <label>Categoría <select id="econ-expense-category">
                  <option value="rent">Alquiler</option><option value="utilities">Suministros</option>
                  <option value="software">Programas y suscripciones</option><option value="materials">Materiales</option>
                  <option value="marketing">Publicidad</option><option value="training">Formación</option>
                  <option value="professional">Servicios profesionales</option><option value="other">Otros</option>
                </select></label>
                <label>Proveedor <input id="econ-expense-supplier" required maxLength={160} /></label>
                <label>Importe total (€) <input id="econ-expense-amount" type="number" min="0.01" max="100000" step="0.01" required /></label>
                <label className="econ-span-full">Concepto <input id="econ-expense-concept" required maxLength={250} /></label>
              </div>
              <button className="econ-button" type="submit">Guardar gasto</button>
            </form>
            <EconomyImportTools />
            <p className="econ-help">El registro sirve para el control interno. Guarda los justificantes originales y consulta con tu gestoría su deducibilidad y el IVA soportado; este importe no equivale automáticamente a un gasto fiscal deducible.</p>
            <div id="econ-expense-list" className="econ-list" />
          </section>

          <section data-econ-panel="settings" hidden>
            <div className="econ-section-heading"><div><p className="econ-eyebrow">Configuración del emisor</p><h2>Datos fiscales</h2></div></div>
            <form id="econ-issuer-form" className="econ-card">
              <div className="econ-form-grid">
                <label>Nombre y apellidos fiscales <input id="econ-issuer-name" required maxLength={160} /></label>
                <label>NIF <input id="econ-issuer-nif" required maxLength={30} /></label>
                <label className="econ-span-full">Domicilio fiscal completo <input id="econ-issuer-address" required maxLength={350} /></label>
                <label>Correo de contacto <input id="econ-issuer-email" type="email" required maxLength={180} /></label>
                <label>Año de inicio de la serie CSG <input id="econ-issuer-first-year" type="number" min="2020" max="2100" required /></label>
                <label>Primer número disponible de la serie <input id="econ-issuer-first-number" type="number" min="1" max="999999" required placeholder="Comprueba los números ya utilizados" /></label>
              </div>
              <p className="econ-help">Introduce los datos fiscales reales y revísalos con tu gestoría. Al emitir, se guarda una copia inalterable de estos datos en cada factura. Antes de la primera emisión, confirma con tu gestoría qué número debe seguir en la serie CSG del año elegido. Los años posteriores comienzan por el número 1; cambiar esta configuración no renumera facturas emitidas.</p>
              <button className="econ-button" type="submit">Guardar datos fiscales</button>
            </form>
            <div className="econ-card">
              <h3>Alcance de esta primera versión</h3>
              <p>Solo para la actividad de Carolina Sánchez Girona. No incluye Mineuri, MineuriStudio ni las ventas de recursos digitales. Para la adaptación obligatoria a los requisitos de los sistemas de facturación, prevista con carácter general para autónomos a partir del 1 de julio de 2027, será necesaria una solución conforme al reglamento vigente, incluida la gestión de rectificativas.</p>
            </div>
          </section>
        </div>
      </div>
      <Script src="/admin-economia.js?v=20261009-ocr-excel-1" strategy="afterInteractive" />
    </main>
  );
}
