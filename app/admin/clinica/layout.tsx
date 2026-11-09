import Script from "next/script";
import type { Metadata } from "next";
import "./mobile-fixes.css";
import "./brand-fixes.css";
import "./admin-enhancements.css";
import "./adhd-assessments.css";
import "./adhd-neuro-expanded.css";
import "./adhd-assessment-planner.css";
import "./adhd-pdf-library.css";
import "./neuro-materials.css";
import "./manual-documents-email.css";
import "./electronic-signature.css";
import "./simple-consents.css";

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
      <Script src="/clinic-video-manager.js?v=20261009-1" strategy="afterInteractive" />
      <Script src="/admin-clinica-print-fixes.js?v=20260915-1" strategy="afterInteractive" />
      <Script src="/clinic-rebook.js?v=20260915-1" strategy="afterInteractive" />
      <Script src="/clinic-word-export.js?v=20261009-legal-1" strategy="afterInteractive" />
      <Script src="/clinic-report-options.js?v=20261009-legal-1" strategy="afterInteractive" />
      <Script src="/clinic-ux-guards.js?v=20260915-1" strategy="afterInteractive" />
      <Script src="/clinic-patient-dashboard.js?v=20261109-theme-1" strategy="afterInteractive" />
      <Script src="/clinic-goals-manager.js?v=20261109-theme-1" strategy="afterInteractive" />
      <Script src="/clinic-process-reviews.js?v=20261109-1" strategy="afterInteractive" />
      <Script src="/clinic-scale-trends.js?v=20261109-theme-1" strategy="afterInteractive" />
      <Script src="/clinic-template-library.js?v=20261109-theme-1" strategy="afterInteractive" />
      <Script src="/clinic-patient-admin-enhancements.js?v=20261009-fixes-2" strategy="afterInteractive" />
      <Script src="/clinic-patient-workspace.js?v=20261109-theme-1" strategy="afterInteractive" />
      <Script src="/clinic-deferred-consent.js?v=20261018-1" strategy="afterInteractive" />
      <Script src="/clinic-manual-documents-email.js?v=20261109-1" strategy="afterInteractive" />
      <Script src="/clinic-electronic-signature.js?v=20261109-1" strategy="afterInteractive" />
      <Script src="/clinic-simple-consents.js?v=20261109-1" strategy="afterInteractive" />
      <Script src="/clinic-adhd-assessments.js?v=20261104-6" strategy="afterInteractive" />
      <Script src="/clinic-adhd-assessment-planner.js?v=20261104-3" strategy="afterInteractive" />
      <Script src="/clinic-adhd-pdf-library.js?v=20261104-4" strategy="afterInteractive" />
      <Script src="/clinic-adhd-neuro-expanded.js?v=20261104-5" strategy="afterInteractive" />
      <Script src="/clinic-pwa.js?v=20261020-android-native-1" strategy="afterInteractive" />
    </>
  );
}
