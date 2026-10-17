import type { Metadata } from "next";
import EntreSesionesApp from "./panel";

export const metadata: Metadata = {
  title: "Entre Sesiones · App",
  description: "Acceso a las actividades terapéuticas asignadas desde tu consulta.",
  robots: { index: false, follow: false, nocache: true },
  manifest: "/entre-sesiones/app/manifest.webmanifest",
  icons: { icon: "/clinic-pwa-icon.svg", apple: "/clinic-pwa-icon.svg" },
  appleWebApp: { capable: true, statusBarStyle: "default", title: "Entre Sesiones" },
};

export default function EntreSesionesAppPage() {
  return <EntreSesionesApp />;
}
