import type { Metadata, Viewport } from "next";
import EntreSesionesApp from "./panel";
import "./app.css";

export const metadata: Metadata = {
  title: "Entre Sesiones · App",
  description: "Acceso a las actividades terapéuticas asignadas desde tu consulta.",
  robots: { index: false, follow: false, nocache: true },
  manifest: "/entre-sesiones-app.webmanifest",
  icons: { icon: [{ url: "/entre-sesiones-icon-es.svg", type: "image/svg+xml" }], apple: "/entre-sesiones-icon-editorial.svg" },
  appleWebApp: { capable: true, statusBarStyle: "default", title: "Entre Sesiones" },
};

export const viewport: Viewport = {
  themeColor: "#F7FAFB",
  width: "device-width",
  initialScale: 1,
};

export default function EntreSesionesAppPage() {
  return <EntreSesionesApp />;
}
