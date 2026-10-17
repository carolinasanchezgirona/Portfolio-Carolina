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
      <span className="esapp-portal-subtitle">Mi espacio personal</span>
    </div>
    <MiEspacioPage />
    <nav className="esapp-bottom-nav" aria-label="Navegación de Entre Sesiones">
      <a href="/entre-sesiones/app/"><span aria-hidden="true">⌂</span>Inicio</a>
      <a href={base + "terapia"}><span aria-hidden="true">▤</span>Mi terapia</a>
      <a href={base + "wellness"}><span aria-hidden="true">◉</span>Wellness</a>
      <a href={base + "progreso"}><span aria-hidden="true">↗</span>Progreso</a>
      <a href={base + "configuracion"}><span aria-hidden="true">☷</span>Cuenta</a>
    </nav>
  </div>;
}
