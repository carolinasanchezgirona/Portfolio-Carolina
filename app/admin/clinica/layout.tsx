import type { Metadata } from "next";
import "./mobile-fixes.css";
import "./brand-fixes.css";
import "./admin-enhancements.css";
import "./neuro-materials.css";

export const metadata: Metadata = {
  title: "Gestión clínica | Carolina Sánchez",
  description: "Aplicación privada para la gestión clínica de Dememoria.",
  manifest: "/clinic-manifest.webmanifest",
  icons: { icon: { url: "/clinic-pwa-icon-192.png", type: "image/png", sizes: "192x192" }, apple: { url: "/clinic-pwa-icon-180.png", type: "image/png", sizes: "180x180" } },
  appleWebApp: { capable: true, title: "Mi clínica", statusBarStyle: "default" },
  robots: { index: false, follow: false, nocache: true },
};

export default function ClinicaLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      {children}
      <script src="/clinic-video-manager.js?v=20261009-1" defer />
      <script src="/admin-clinica-print-fixes.js?v=20260915-1" defer />
      <script src="/clinic-rebook.js?v=20260915-1" defer />
      <script src="/clinic-word-export.js?v=20261009-legal-1" defer />
      <script src="/clinic-report-options.js?v=20261009-legal-1" defer />
      <script src="/clinic-ux-guards.js?v=20260915-1" defer />
      <script src="/clinic-patient-dashboard.js?v=20261020-palette-1" defer />
      <script src="/clinic-goals-manager.js?v=20261020-palette-1" defer />
      <script src="/clinic-scale-trends.js?v=20261020-palette-1" defer />
      <script src="/clinic-template-library.js?v=20261020-palette-1" defer />
      <script src="/clinic-admin-tasks.js?v=20261020-palette-1" defer />
      <script src="/clinic-patient-admin-enhancements.js?v=20261009-fixes-2" defer />
      <script src="/clinic-patient-workspace.js?v=20261020-palette-1" defer />
      <script src="/clinic-deferred-consent.js?v=20261018-1" defer />
      <script src="/clinic-pwa.js?v=20261020-android-native-1" defer />
    </>
  );
}
