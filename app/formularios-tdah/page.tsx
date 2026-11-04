import type { Metadata } from "next";
import Script from "next/script";
import "./forms.css";
export const metadata: Metadata = {
  title: "Formulario clínico seguro | Carolina Sánchez",
  description: "Área protegida para cumplimentar formularios de evaluación.",
  robots: { index: false, follow: false, nocache: true },
};
export default function FormularioTdahPage() {
 return (
  <main className="adhd-patient-page">
   <header className="adhd-patient-header">
    <a href="/" className="adhd-patient-brand"><strong>Carolina Sánchez Girona</strong><span>Psicología · Neuropsicología</span></a>
    <span>Formulario clínico privado</span>
   </header>
   <div className="adhd-patient-wrap">
    <div className="adhd-patient-card">
     <p className="adhd-patient-kicker">Evaluación clínica · Cuestionarios</p>
     <h1>Tu formulario previo a la consulta</h1>
     <p>Completa la información con calma. Puedes guardar un borrador y continuar más tarde. Las respuestas se incorporarán a tu evaluación y serán revisadas por la profesional.</p>
     <p className="adhd-patient-safety">Este formulario no sirve para pedir ayuda urgente. Si necesitas atención inmediata, contacta con emergencias (112).</p>
     <section id="adhd-patient-intro">
      <h2>Verificar tu acceso</h2>
      <p>Para proteger tu información, te enviaremos un código de verificación al correo de tu ficha clínica.</p>
      <button type="button" id="adhd-request-code" className="adhd-patient-primary">Enviar código de verificación</button>
     </section>
     <section id="adhd-patient-check-code" hidden>
      <h2>Introduce el código recibido</h2>
      <label htmlFor="adhd-code">Código de seis dígitos</label>
      <input id="adhd-code" type="text" inputMode="numeric" autoComplete="one-time-code" maxLength={6} pattern="[0-9]{6}" />
      <div className="adhd-patient-buttons">
       <button type="button" id="adhd-verify-code" className="adhd-patient-primary">Verificar y abrir</button>
       <button type="button" id="adhd-again" className="adhd-patient-secondary">Solicitar otro código</button>
      </div>
     </section>
     <section id="adhd-patient-form" hidden>
      <h2 id="adhd-form-title">Formulario</h2>
      <p>Responde según tu experiencia. Si no recuerdas un dato, puedes indicarlo. No se espera ninguna respuesta concreta ni se confirma un diagnóstico con este formulario.</p>
      <div id="adhd-patient-fields" className="adhd-patient-fields" />
      <div className="adhd-patient-buttons">
       <button type="button" id="adhd-save-draft" className="adhd-patient-secondary">Guardar borrador</button>
       <button type="button" id="adhd-submit" className="adhd-patient-primary">Enviar respuestas definitivas</button>
      </div>
     </section>
     <p id="adhd-patient-state" role="status" aria-live="polite" className="adhd-patient-status" />
    </div>
    <p className="adhd-patient-footnote">Tu acceso está limitado a este formulario. No se envía el contenido por correo electrónico y no se publica fuera del expediente clínico.</p>
   </div>
   <Script src="/adhd-patient-form.js?v=20261104-1" strategy="afterInteractive"/>
  </main>
 );
}