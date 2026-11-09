import type { Metadata, Viewport } from "next";
import { redirect } from "next/navigation";
import "./app.css";

export const metadata: Metadata = {
  title: "Mi espacio · Carolina Sánchez",
  description: "Acceso a las actividades terapéuticas asignadas desde tu consulta.",
  robots: { index: false, follow: false, nocache: true },
  manifest: "/entre-sesiones-app.webmanifest",
  icons: { icon: [{ url: "/cs-app-icon.svg", type: "image/svg+xml" }], apple: "/cs-app-icon.svg" },
  appleWebApp: { capable: true, statusBarStyle: "default", title: "Mi espacio" },
};

export const viewport: Viewport = {
  themeColor: "#F2EFE7",
  width: "device-width",
  initialScale: 1,
};

export default function EntreSesionesAppPage() {
  redirect("/entre-sesiones/app/espacio/?vista=panel");
}
