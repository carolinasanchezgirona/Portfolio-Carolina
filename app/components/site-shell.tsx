"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

const administrativeRoutes = [
  "/cita",
  "/privacidad",
  "/consentimiento-psicologico",
  "/consentimiento-neuropsicologico",
];

function isAdministrativeRoute(pathname: string) {
  return administrativeRoutes.some(
    (route) => pathname === route || pathname === `${route}/` || pathname.startsWith(`${route}/`),
  );
}

function SiteHeader() {
  return (
    <header className="site-header site-global-header">
      <a className="brand" href="/" aria-label="Carolina Sánchez, inicio">
        <span className="brand-name">Carolina Sánchez</span>
        <span className="brand-sub">Psicóloga · Neuropsicóloga</span>
      </a>

      <nav className="nav site-global-nav" aria-label="Navegación principal">
        <a href="/psicologia/">Psicología</a>
        <a href="/neuropsicologia/">Neuropsicología</a>
        <a href="/sobre-mi/">Sobre mí</a>
        <a className="nav-cta" href="/cita/">Pedir cita</a>
      </nav>

      <details className="site-mobile-nav">
        <summary>Menú</summary>
        <div className="site-mobile-nav-panel">
          <a href="/">Inicio</a>
          <a href="/psicologia/">Psicología</a>
          <a href="/ansiedad/">Ansiedad</a>
          <a href="/duelo/">Duelo</a>
          <a href="/neuropsicologia/">Neuropsicología</a>
          <a href="/evaluacion-neuropsicologica/">Evaluación neuropsicológica</a>
          <a href="/deterioro-cognitivo/">Deterioro cognitivo</a>
          <a href="/sobre-mi/">Sobre mí</a>
          <a href="/psicologa-arenys-de-mar/">Consulta en Arenys de Mar</a>
          <a href="/cita/">Pedir cita</a>
        </div>
      </details>
    </header>
  );
}

function SiteFooter() {
  return (
    <footer className="editorial-footer site-global-footer">
      <div className="editorial-wrap site-footer-grid">
        <div className="site-footer-intro">
          <p className="editorial-footer-brand">Carolina Sánchez | Psicóloga</p>
          <p>Dememoria · Consulta de Psicología y Neuropsicología</p>
          <p>Arenys de Mar · Atención presencial y online</p>
        </div>

        <nav className="site-footer-column" aria-label="Psicología">
          <p className="site-footer-heading">Psicología</p>
          <a href="/psicologia/">Psicología General Sanitaria</a>
          <a href="/ansiedad/">Ansiedad</a>
          <a href="/duelo/">Duelo y pérdidas</a>
        </nav>

        <nav className="site-footer-column" aria-label="Neuropsicología">
          <p className="site-footer-heading">Neuropsicología</p>
          <a href="/neuropsicologia/">Neuropsicología</a>
          <a href="/evaluacion-neuropsicologica/">Evaluación neuropsicológica</a>
          <a href="/deterioro-cognitivo/">Deterioro cognitivo y memoria</a>
        </nav>

        <nav className="site-footer-column" aria-label="Consulta">
          <p className="site-footer-heading">Consulta</p>
          <a href="/sobre-mi/">Sobre mí</a>
          <a href="/psicologa-arenys-de-mar/">Psicóloga en Arenys de Mar</a>
          <a href="/cita/">Pedir cita</a>
        </nav>
      </div>

      <div className="editorial-wrap site-footer-bottom">
        <span>© 2026 Carolina Sánchez Girona</span>
        <a href="mailto:contact@carolinasanchezgirona.com">contact@carolinasanchezgirona.com</a>
      </div>
    </footer>
  );
}

export default function SiteShell({ children }: { children: ReactNode }) {
  const pathname = usePathname() || "/";

  if (isAdministrativeRoute(pathname)) {
    return <>{children}</>;
  }

  return (
    <div className="editorial-site global-shell">
      <SiteHeader />
      <div className="site-public-content">{children}</div>
      <SiteFooter />
    </div>
  );
}
