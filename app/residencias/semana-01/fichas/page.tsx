import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Material profesional de Vida Activa | Fichas para centros",
  description: "Las fichas y los recursos completos de Vida Activa forman parte del material profesional para residencias. Conoce la muestra pública y solicita información.",
  robots: { index: false, follow: true },
  alternates: { canonical: "/residencias/vida-activa/" },
};

export default function FichasProfesionales() {
  return <main className="res-page res-commercial">
    <section className="res-hero res-hero-compact va-commercial-hero">
      <div className="editorial-wrap">
        <nav aria-label="Ruta de navegación" className="res-breadcrumb"><Link href="/">Inicio</Link><span>/</span><Link href="/residencias/vida-activa/">Vida Activa</Link><span>/</span><span>Material profesional</span></nav>
        <p className="res-eyebrow">Vida Activa · Material para centros</p>
        <h1>Fichas diseñadas para utilizarse, no solo para archivarse.</h1>
        <p className="res-lead">Las fichas de participantes, guías de facilitación y orientaciones de respuesta forman parte del programa profesional. Ya no se ofrecen como una colección completa de descarga pública.</p>
        <div className="res-actions">
          <Link className="editorial-btn editorial-btn-primary" href="/residencias/#contacto-profesional">Solicitar propuesta para mi centro</Link>
          <Link className="editorial-btn editorial-btn-secondary" href="/residencias/muestra/">Ver una actividad de muestra</Link>
        </div>
      </div>
    </section>
    <section className="res-section">
      <div className="editorial-wrap res-split">
        <div><p className="res-eyebrow">Qué incluye la edición para equipos</p><h2>Guía, material y adaptación en un mismo sistema.</h2><p>La propuesta integra instrucciones para el equipo, tareas para participantes y criterios de revisión. Cada actividad debe adaptarse a las características y la voluntad de participación de las personas residentes.</p></div>
        <aside className="res-note"><strong>Acceso a los materiales</strong><p>El alcance y las condiciones de entrega se acuerdan con cada centro. No introduzcas datos personales ni clínicos de residentes en el formulario de información.</p></aside>
      </div>
    </section>
  </main>;
}
