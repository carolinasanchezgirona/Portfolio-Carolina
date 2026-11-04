import type { Metadata } from "next";
import "./forms.css";
export const metadata: Metadata = {
  title: "Formularios clínicos | Carolina Sánchez",
  description: "Información sobre la cumplimentación presencial de pruebas clínicas.",
  robots: { index: false, follow: false, nocache: true },
};
export default function FormularioTdahPage() {
  return (
    <main className="adhd-patient-page">
      <header className="adhd-patient-header">
        <a href="/" className="adhd-patient-brand">
          <strong>Carolina Sánchez Girona</strong>
          <span>Psicología · Neuropsicología</span>
        </a>
        <span>Información clínica</span>
      </header>
      <div className="adhd-patient-wrap">
        <section className="adhd-patient-card">
          <p className="adhd-patient-kicker">Evaluaciones de TDAH en adultos</p>
          <h1>Cuestionarios presenciales</h1>
          <p>Los instrumentos de evaluación se administran durante la consulta con la profesional. El acceso remoto a formularios de TDAH está deshabilitado.</p>
          <p>Si dispones de un enlace antiguo, no necesitas cumplimentarlo. Consultaremos los instrumentos pertinentes durante la visita.</p>
          <a href="/cita/" className="adhd-patient-secondary" style={{display:"inline-block",textDecoration:"none",marginTop:16}}>Contactar con la consulta</a>
        </section>
      </div>
    </main>
  );
}
