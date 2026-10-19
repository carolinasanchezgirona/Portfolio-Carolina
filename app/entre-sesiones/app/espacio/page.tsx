import type { Metadata, Viewport } from "next";
import MiEspacioPage from "../../../mi-espacio/page";
import "../app.css";
import "./portal-app.css";

export const metadata: Metadata = {
  title: "Mi espacio · Entre Sesiones",
  description: "Ejercicios, Wellness y progreso personal dentro de Entre Sesiones.",
  robots: { index: false, follow: false, nocache: true },
  manifest: "/entre-sesiones-app.webmanifest",
  icons: { icon: [{ url: "/entre-sesiones-icon-es.svg", type: "image/svg+xml" }], apple: "/entre-sesiones-icon-es.svg" },
  appleWebApp: { capable: true, statusBarStyle: "default", title: "Entre Sesiones" },
};

export const viewport: Viewport = { themeColor: "#173A5E", width: "device-width", initialScale: 1 };

const base = "/entre-sesiones/app/espacio/?vista=";

export default function EntreSesionesEspacio() {
  return <div className="esapp esapp-portal-app">
    <div className="esapp-portal-identity">
      <a href="/entre-sesiones/app/" className="esapp-portal-home" aria-label="Volver al inicio de Entre Sesiones">
        <span className="esapp-portal-brand-mark" aria-hidden="true">
          <span className="esapp-portal-brand-navy"/><span className="esapp-portal-brand-coral"/>
        </span>
        <span>Entre Sesiones</span>
      </a>
      <a href="/entre-sesiones/app/mensajes/">Mensajes a Carolina</a>
      <span className="esapp-portal-subtitle">Mi espacio personal</span>
    </div>
    <MiEspacioPage />
    <nav className="esapp-bottom-nav" aria-label="Navegación de Entre Sesiones" hidden>
      <a href="/entre-sesiones/app/"><span aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="m3 10 9-7 9 7v11h-6v-7H9v7H3z"/></svg></span>Inicio</a>
      <a href={base + "terapia"}><span aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="3" width="14" height="18" rx="1.5"/><path d="M8 8h8M8 12h8M8 16h6"/></svg></span>Mi terapia</a>
      <a href={base + "wellness"}><span aria-hidden="true"><svg className="esapp-nav-heart" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"><path d="M20.8 4.7a5.4 5.4 0 0 0-7.7 0L12 5.8l-1.1-1.1a5.4 5.4 0 0 0-7.7 7.7L12 21l8.8-8.6a5.4 5.4 0 0 0 0-7.7z"/></svg></span>Wellness</a>
      <a href={base + "progreso"}><span aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="m3 17 7-7 4 4 7-8"/><path d="M15 6h6v6"/></svg></span>Progreso</a>
      <a href={base + "configuracion"}><span aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2"/></svg></span>Cuenta</a>
    </nav>
  </div>;
}
